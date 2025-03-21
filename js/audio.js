import {
    AUDIO_PATH,
    AMBIANCE_PATH,
    AMBIANCE_SLIDER_ID,
    AMBIANCE_MAX_VOLUME as configAmbianceMaxVolume,
    CROSSFADE_DURATION,
    MUSIC_PATH,
    MUSIC_SLIDER_ID,
    MUSIC_MAX_VOLUME as configMusicMaxVolume,
    REGION_PATH,
    REFERENCE_WIDTH,
    REFERENCE_HEIGHT,
    REGION_MUSIC_DATA
} from './config.js';

// ==============================
// Audio Configuration
// ==============================

// -- Audio Settings --
let AMBIANCE_MAX_VOLUME = configAmbianceMaxVolume;
let MUSIC_MAX_VOLUME = configMusicMaxVolume;

// -- Audio Players --
const ambianceAudio = new Audio(AMBIANCE_PATH + "wind_ambience.mp3");
ambianceAudio.loop = true;
ambianceAudio.volume = AMBIANCE_MAX_VOLUME;
playAudio(ambianceAudio);

let musicAudio = new Audio(MUSIC_PATH + "intro_theme.mp3");
musicAudio.volume = MUSIC_MAX_VOLUME;
playAudio(musicAudio);

export let weatherAudio = new Audio();
weatherAudio.volume = AMBIANCE_MAX_VOLUME;

// ----------
// Region Music
// ----------
let activeSoundRegion = null;
let isCrossfading = false;

// Attach slider event listeners for audio volume
document.getElementById(AMBIANCE_SLIDER_ID).addEventListener("input", e => {
    AMBIANCE_MAX_VOLUME = parseFloat(e.target.value);
    ambianceAudio.volume = AMBIANCE_MAX_VOLUME;
});
document.getElementById(MUSIC_SLIDER_ID).addEventListener("input", e => {
    MUSIC_MAX_VOLUME = parseFloat(e.target.value);
    musicAudio.volume = MUSIC_MAX_VOLUME;
});

export function updateRegionSound(scale, offsetX, offsetY) {
    if (!REGION_MUSIC_DATA) return;

    const currentWidth = window.innerWidth;
    const currentHeight = window.innerHeight;

    // Calculate the center of the view on the stretched/scaled map
    const xOnStretched = (currentWidth / 2 - offsetX) / scale;
    const yOnStretched = (currentHeight / 2 - offsetY) / scale;

    // Normalize the map center coordinates to the reference resolution
    const normalizedX = (xOnStretched / currentWidth) * REFERENCE_WIDTH;
    const normalizedY = (yOnStretched / currentHeight) * REFERENCE_HEIGHT;

    const mapCenter = {
        x: normalizedX,
        y: normalizedY
    };

    const regionFound = REGION_MUSIC_DATA.find(region =>
        mapCenter.x >= region["area"]["x"]["min"] && mapCenter.x <= region["area"]["x"]["max"] &&
        mapCenter.y >= region["area"]["y"]["min"] && mapCenter.y <= region["area"]["y"]["max"]
    );

    if (regionFound) {
        if (activeSoundRegion !== regionFound) {
            crossfadeTo(regionFound);
        }
    } else if (activeSoundRegion !== null) {
        crossfadeOut();
    }
}

function crossfadeTo(newRegion) {
    if (isCrossfading) return;
    isCrossfading = true;

    const newAudio = new Audio(REGION_PATH + newRegion["sound path"]);
    newAudio.loop = true;
    newAudio.volume = 0;
    playAudio(newAudio);

    const startTime = performance.now();
    const oldMusicAudio = musicAudio;

    const step = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / CROSSFADE_DURATION, 1);

        if (!oldMusicAudio.paused && oldMusicAudio !== newAudio) {
            oldMusicAudio.volume = MUSIC_MAX_VOLUME * (1 - progress);
        }
        newAudio.volume = MUSIC_MAX_VOLUME * progress;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            if (!oldMusicAudio.paused && oldMusicAudio !== newAudio) {
                oldMusicAudio.pause();
                oldMusicAudio.currentTime = 0;
            }
            musicAudio = newAudio;
            activeSoundRegion = newRegion;
            isCrossfading = false;
        }
    };

    requestAnimationFrame(step);
}

function crossfadeOut() {
    if (isCrossfading) return;
    isCrossfading = true;

    const startTime = performance.now();
    const currentMusicAudio = musicAudio;

    const step = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / CROSSFADE_DURATION, 1);

        if (!currentMusicAudio.paused) {
            currentMusicAudio.volume = MUSIC_MAX_VOLUME * (1 - progress);
        }

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            currentMusicAudio.pause();
            currentMusicAudio.currentTime = 0;
            activeSoundRegion = null;
            isCrossfading = false;
        }
    };

    requestAnimationFrame(step);
}

function playAudio(audio) {
    if (audio) {
        audio.play().catch(e => console.log("Autoplay blocked:", e));
    }
    else {
        console.error("No audio found!");
    }
}

export function createAndPlayAudio(path, volume) {
    const audio = new Audio(AUDIO_PATH + path);
    audio.volume = volume;
    playAudio(audio);
}