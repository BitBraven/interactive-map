import { CONFIG_SETTINGS, CONFIG_LOAD_PROMISE, OVERLAYS_PATH, OVERLAY_FILES, OVERLAYS_PANEL } from './config.js';
import { createAndPlayAudio } from './audio.js';
import { disableOverlay } from './ui.js';

// Handle User Config File
let overlayNameMap = {
    "Settlements": "",
    "Landmarks": "",
    "Land Routes": "",
    "Sea Routes": "",
};

async function loadConfigFile() {
    await CONFIG_LOAD_PROMISE;
    try {
        if (CONFIG_SETTINGS) {
            const overlaySettings = CONFIG_SETTINGS["Overlays"];
            if (overlaySettings) {
                if (!overlaySettings["Settlements"]) {
                    disableOverlay('settlements-overlay');
                }

                if (!overlaySettings["Landmarks"]) {
                    disableOverlay('landmarks-overlay');
                }

                if (!overlaySettings["Land Routes"]) {
                    disableOverlay('land-routes-overlay');
                }

                if (!overlaySettings["Sea Routes"]) {
                    disableOverlay('sea-routes-overlay');
                }
            }
            else {
                console.error('Could not find Overlay Settings from configs file:');
            }

            if (OVERLAY_FILES) {
                Object.keys(overlayNameMap).forEach(key => {
                    if (OVERLAY_FILES[key]) {
                        overlayNameMap[key] = OVERLAY_FILES[key];
                    }
                });
            }
        }
    } catch (error) {
        console.error('Could not load config settings from configs file:', error);
    }
}

loadConfigFile();

// ==============================
// Map Overlays System
// ==============================

// Overlay State Management
const overlayStates = {
    'settlements': false,
    'landmarks': false,
    'land_routes': false,
    'sea_routes': false
};

const overlayImages = {
    'settlements': null,
    'landmarks': null,
    'land_routes': null,
    'sea_routes': null
};

let overlaysVisible = false; // Keep track of the overlays navbar visibility

export function toggleOverlays() {
    overlaysVisible = !overlaysVisible;
    const overlaysPanel = document.getElementById(OVERLAYS_PANEL);
    if (overlaysPanel) {
        overlaysPanel.style.display = overlaysVisible ? 'flex' : 'none';
    }
}

export function toggleOverlay(overlayName, drawWallpaperCallback) {
    overlayStates[overlayName] = !overlayStates[overlayName];
    const isEnabled = overlayStates[overlayName];
    const imagePath = OVERLAYS_PATH + overlayNameMap[overlayName];

    // Load overlay image if enabled
    if (isEnabled) {
        overlayImages[overlayName] = new Image();
        overlayImages[overlayName].onload = drawWallpaperCallback; // Redraw when loaded
        overlayImages[overlayName].src = imagePath;
    } else {
        overlayImages[overlayName] = null; // Remove the image when disabled
        drawWallpaperCallback(); // Redraw to clear the overlay
    }

    // Update item checkmark
    const overlayItem = Array.from(document.querySelectorAll('.overlay-list-item')).find(item =>
        item.querySelector('.overlay-list-item-text').textContent === overlayName
    );
    if (overlayItem) {
        const button = overlayItem.querySelector('.panel-checkmark');
        if (button) {
            if (isEnabled) {
                button.classList.add('checked');
            } else {
                button.classList.remove('checked');
            }
        }
    }

    createAndPlayAudio("effects/toggle_overlay.mp3", 0.7);
}

export function drawOverlays(ctx) {
    // Draw black filter if any overlay is enabled
    if (Object.values(overlayStates).some(enabled => enabled)) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    }

    // Draw overlays in order
    const overlayOrder = ['Settlements', 'Landmarks', 'Land Routes', 'Sea Routes'];
    overlayOrder.forEach(overlayName => {
        if (overlayStates[overlayName] && overlayImages[overlayName]) {
            ctx.drawImage(overlayImages[overlayName], 0, 0, window.innerWidth, window.innerHeight);
        }
    });
}