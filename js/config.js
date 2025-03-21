// ==============================
// Configuration & Constants
// ==============================

//Config File Settings
export let CONFIG_SETTINGS;
export let MAP_TOOLTIPS;
export let MAP_FILES;
export let OVERLAY_FILES;
export let MIN_ZOOM_SCALE;
export let MAX_ZOOM_SCALE;
export let REGION_MUSIC_DATA;

// Tool Asset Paths
export const CANVAS_ID = "questifyreInteractiveMap";
export const TOOL_ASSET_PATH = "assets/tool/";
export const AUDIO_PATH = TOOL_ASSET_PATH + "audio/";
export const AMBIANCE_PATH = AUDIO_PATH + "ambiances/";
export const MUSIC_PATH = AUDIO_PATH + "music/";
export const IMAGES_PATH = TOOL_ASSET_PATH + "images/";
export const ICON_PATH = IMAGES_PATH + "icons/";
export const BUTTON_PATH = ICON_PATH + "buttons/";
export const SPRITE_PATH = IMAGES_PATH + "sprites/";

// User Asset Paths
export const USER_ASSET_PATH = "assets/user/";
export const MAPS_PATH = USER_ASSET_PATH + "maps/";
export const OVERLAYS_PATH = MAPS_PATH + "overlays/";
export const USER_AUDIO_PATH = USER_ASSET_PATH + "audio/";
export const REGION_PATH = USER_AUDIO_PATH + "regions/";

const USER_IMAGES_PATH = USER_ASSET_PATH + "images/";
const USER_SPRITE_PATH = USER_IMAGES_PATH + "sprites/";

// Audio configs
export const AMBIANCE_MAX_VOLUME = 0.3;
export const MUSIC_MAX_VOLUME = 0.2;

// Music Region Sound Configs
export const REGION_SOUND_DELAY = 5000;
export const CROSSFADE_DURATION = 1500;
export const OVERLAY_FADE_DURATION = 1000;

// Header configs
export const TYPING_SPEED = 150;
export const CHARACTER_FADE_DURATION = 500;
export const HEADER_STAY_DURATION = 2000;
export const CHARACTER_SPACING = "10px";

// UI Calculation configs
export const REFERENCE_WIDTH = 1920;
export const REFERENCE_HEIGHT = 1080;

// Weather states
export const WEATHER_SUNNY = 0;
export const WEATHER_OVERCAST = 1;
export const WEATHER_RAIN = 2;
export const WEATHER_STORM = 3;

// Weather configs
export const BASE_MAX_CLOUDS = 30;
export const WEATHER_CLOUD_MULTIPLIER = 5;
export const CLOUD_SPAWN_PROBABILITY = 0.02;
export const LIGHTNING_FLASH_PROBABILITY = 0.3;

// Day/Night states
export const DAY = 0;
export const DUSK = 1;
export const NIGHT = 2;

// DOM Element IDs
export const AMBIANCE_SLIDER_ID = "ambianceSlider";
export const MUSIC_SLIDER_ID = "musicSlider";
export const TOGGLE_GRID_BUTTON_ID = "toggleGridButton";
export const WEATHER_BUTTON_ID = "weatherButton";
export const DAY_NIGHT_BUTTON_ID = "dayNightButton";
export const SOUND_PANEL_ID = "soundPanel";
export const HEADER_TEXT_ID = "headerText";
export const HEADER_OVERLAY_ID = "header-overlay";
export const OVERLAYS_BUTTON_ID = "overlaysButton";
export const OVERLAYS_NAV_BAR_HEADER_ID = "overlays-nav-bar-header";
export const OVERLAYS_NAV_BAR_ID = "overlays-nav-bar";
export const LOADING_SCREEN_ID = "loading-screen";

// Cloud sprite paths
const CLOUDS_PATH = SPRITE_PATH + "clouds/";
const defaultCloudSpritePaths = [
    CLOUDS_PATH + "cloud_1.png",
    CLOUDS_PATH + "cloud_2.png",
    CLOUDS_PATH + "cloud_3.png",
    CLOUDS_PATH + "cloud_4.png",
    CLOUDS_PATH + "cloud_5.png"
];

export let CLOUD_SPRITE_PATHS = [...defaultCloudSpritePaths];

// Weather icon paths
export const WEATHER_ICONS = [
    BUTTON_PATH + "weather_0.png",
    BUTTON_PATH + "weather_1.png",
    BUTTON_PATH + "weather_2.png",
    BUTTON_PATH + "weather_3.png"
];

// Day/Night overlay properties
export const OVERLAY_PROPERTIES = [
    { color: "#000000", alpha: 0 }, // Day
    { color: "#a65c53", alpha: 0.3 }, // Dusk
    { color: "#161631", alpha: 0.6 } // Night
];

// Weather audio sources
const WEATHER_PATH = AUDIO_PATH + "weather/";
export const WEATHER_AUDIO_SOURCES = [
    null, // Sunny
    null, // Overcast (no sound)
    WEATHER_PATH + "rain.mp3", // Rain
    WEATHER_PATH + "storm.mp3" // Storm
];

// Load user configs
const configLoadPromise = loadConfig();

async function loadConfig() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            console.error('Failed to load config.json');
            return;
        }

        const config = await response.json();
        if (config) {
            if (config["Settings"]) {
                CONFIG_SETTINGS = config["Settings"];

                if (CONFIG_SETTINGS["Zoom"]) {
                    let zoom = CONFIG_SETTINGS["Zoom"];
                    MIN_ZOOM_SCALE = zoom["Min"];
                    MAX_ZOOM_SCALE = zoom["Max"];
                }
                else {
                    console.error('No Zoom Settings found inside config.json file!');
                }
            }
            else {
                console.error('No Settings found inside config.json file!');
            }

            if (config["Maps"]) {
                MAP_FILES = config["Maps"];
            }
            else {
                console.error('No Map Files found inside config.json file!');
            }

            if (config["Overlays"]) {
                OVERLAY_FILES = config["Overlays"];
            }
            else {
                console.error('Could not find Overlay Files from configs file');
            }

            if (config["Region Music"]) {
                REGION_MUSIC_DATA = config["Region Music"];
            }
            else {
                console.error('Could not find Region Music Files from configs file');
            }

            if (config["Map Tooltips"]) {
                MAP_TOOLTIPS = config["Map Tooltips"];
            }
            else {
                console.error('Could not find Map Tooltips Files from configs file');
            }

            if (config['Cloud Sprites'] && Array.isArray(config['Cloud Sprites']) && config['Cloud Sprites'].length > 0) {
                CLOUD_SPRITE_PATHS = config['Cloud Sprites'].map(sprite => USER_SPRITE_PATH + "clouds/" + sprite);
            } else {
                console.log('No valid Cloud Sprites found in config.json, using default.');
            }
        }
    } catch (error) {
        console.error('Error loading config.json:', error);
    }
}

export { configLoadPromise as CONFIG_LOAD_PROMISE };