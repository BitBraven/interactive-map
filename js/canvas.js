import { CANVAS_ID, IMAGES_PATH, MIN_ZOOM_SCALE, MAX_ZOOM_SCALE } from './config.js';
import { updateRegionSound } from './audio.js';
import { updateClouds, drawWeatherEffects, drawWeatherFilter, updateWeatherEffects, updateWeatherOverlay } from './weather.js';
import { updateDayNightCycle, drawDayNightOverlay } from './daynight.js';
import { drawOverlays } from './overlay.js';

// ==============================
// Canvas Interface Handling
// ==============================

const canvas = document.getElementById(CANVAS_ID);
const ctx = canvas.getContext("2d");
[canvas.width, canvas.height] = [window.innerWidth, window.innerHeight];

// ----- Pan & Zoom Variables -----
let isDragging = false;
let startDragX = 0;
let startDragY = 0;

export let scale = 1;
export let offsetX = 0;
export let offsetY = 0;
export let currentWallpaperMatrix = new DOMMatrix();

// -- Images --
const wallpaper = new Image();
const background = new Image();
background.src = IMAGES_PATH + "map_background.jpg";

export function drawWallpaper() {
    // Draw the background over the full screen.
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.drawImage(background, 0, 0, window.innerWidth, window.innerHeight);
    ctx.restore();

    if (wallpaper.complete && wallpaper.naturalWidth && wallpaper.naturalHeight) {
        const imgWidth = wallpaper.naturalWidth;
        const imgHeight = wallpaper.naturalHeight;

        // Compute the scale to fit the wallpaper without upscaling.
        const fitScale = Math.min(
            window.innerWidth / imgWidth,
            window.innerHeight / imgHeight,
            1
        );

        // Center the wallpaper.
        const dx = (window.innerWidth - imgWidth * fitScale) / 2;
        const dy = (window.innerHeight - imgHeight * fitScale) / 2;

        // Base transformation: scale and center the wallpaper.
        const baseMatrix = new DOMMatrix().translate(dx, dy).scale(fitScale);
        // User transformation.
        const userMatrix = new DOMMatrix().translate(offsetX, offsetY).scale(scale);
        // Combined transform for the wallpaper.
        const combinedMatrix = userMatrix.multiply(baseMatrix);
        currentWallpaperMatrix = combinedMatrix;

        // Draw the wallpaper.
        ctx.save();
        ctx.setTransform(combinedMatrix);
        ctx.drawImage(wallpaper, 0, 0, imgWidth, imgHeight);
        ctx.restore();

        // Create a remapping matrix to convert window coordinates to wallpaper natural coordinates.
        // This matrix maps (0,0) to (0,0) and (window.innerWidth, window.innerHeight) to (imgWidth, imgHeight).
        const remapMatrix = new DOMMatrix().scale(
            imgWidth / window.innerWidth,
            imgHeight / window.innerHeight
        );

        // Compose the transforms so that overlay functions (which use window dimensions)
        // get remapped into wallpaper coordinates and then follow the wallpaper's transform.
        const overlayMatrix = combinedMatrix.multiply(remapMatrix);

        ctx.save();
        ctx.setTransform(overlayMatrix);

        drawWeatherEffects(ctx);
        drawOverlays(ctx);
        drawDayNightOverlay(ctx);
        drawWeatherFilter(ctx);
        ctx.restore();
    }
}

// ------------------------------
// Animation Loop
// ------------------------------
let lastFrameTime = performance.now();
export const animationLoop = (timestamp) => {
    const dt = (timestamp - lastFrameTime) / 1000;
    lastFrameTime = timestamp;

    updateDayNightCycle(timestamp);
    updateWeatherOverlay(timestamp);

    drawWallpaper();
    updateClouds(dt, timestamp);
    updateWeatherEffects(dt);

    requestAnimationFrame(animationLoop);
};

export function resetZoom() {
    scale = 1;
    offsetX = 0;
    offsetY = 0;
    drawWallpaper();
}

export function getWallpaper() {
    return wallpaper;
}

// ------------------------------
// Canvas Event Listeners for Panning & Zooming
// ------------------------------

// Only check for Region sound occasionaly, for performance optimization
let lastRegionSoundUpdate = 0;
export function tryUpdateRegionSound() {
    const now = performance.now();
    if (now - lastRegionSoundUpdate >= 1000) {
        updateRegionSound();
        lastRegionSoundUpdate = now;
    }
}

canvas.addEventListener("wheel", e => {
    e.preventDefault();
    let zoomFactor = 1 + (-e.deltaY * 0.001);
    let newScale = scale * zoomFactor;

    if (newScale < MIN_ZOOM_SCALE) {
        zoomFactor = MIN_ZOOM_SCALE / scale;
        newScale = MIN_ZOOM_SCALE;
    } else if (newScale > MAX_ZOOM_SCALE) {
        zoomFactor = MAX_ZOOM_SCALE / scale;
        newScale = MAX_ZOOM_SCALE;
    }

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    offsetX = mouseX - zoomFactor * (mouseX - offsetX);
    offsetY = mouseY - zoomFactor * (mouseY - offsetY);

    scale = newScale;
    drawWallpaper();
    tryUpdateRegionSound();
}, { passive: false });

canvas.addEventListener("mousedown", e => {
    isDragging = true;
    startDragX = e.clientX - offsetX;
    startDragY = e.clientY - offsetY;
    canvas.style.cursor = "grabbing";
});

canvas.addEventListener("mousemove", e => {
    if (isDragging) {
        offsetX = e.clientX - startDragX;
        offsetY = e.clientY - startDragY;
        drawWallpaper();
        tryUpdateRegionSound();
    }
});

["mouseup", "mouseleave"].forEach(type => {
    canvas.addEventListener(type, () => {
        isDragging = false;
        canvas.style.cursor = "grab";
        tryUpdateRegionSound();
    });
});