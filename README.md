# Questifyre's Interactive Map  
**Unleash Your World, Breath by Pixel**

![Questifyre Banner](https://github.com/user-attachments/assets/924c88f0-e292-4ade-a171-da951e6bf22a)

**🌍 Live Sample Preview:** [questifyre.github.io/interactive-map](https://questifyre.github.io/interactive-map/)

---

## 🚩 Table of Contents  
- [Overview](#overview)  
- [Features](#features)  
- [Quick Start](#quick-start)  
- [Configuration Guide](#configuration-guide)  
  - [Setup & Installation](#setup--installation)  
  - [Editing `config.json`](#editing-configjson)  
- [Hosting Your Map](#hosting-your-map)  
- [Support & Future Plans](#support--future-plans)  

---

## Overview  
Step into the heart of your tabletop realm with the **Questifyre Interactive Map** - a dynamic canvas where lore, atmosphere, and strategy collide. Crafted for Game Masters and players who crave immersion, this tool transforms static maps into living worlds.

---

## Features  
- **⚙️ Extensive Customization**: Tailor map features, controls, and visuals to suit your campaign.  
- **🗺️ Fluid Map Control**: Pan, zoom, and scale seamlessly for exploration or strategy.  
- **⏱️ Atmospheric Customization**: Shift time of day and weather (rain, storms, overcast) to match your narrative.  
- **🎧 Adaptive Soundscapes**: Dynamic ambient sounds and region-specific music.  
- **💡 Interactive Lore Hints**: Hover-activated tooltips reveal hidden secrets.  
- **📐 Toggleable Grids**: Switch between exploration and tactical combat modes.  
- **🔍 Informative Overlays**: Highlight settlements, landmarks, and routes for planning.  

---

## Quick Start
1. Download the project.  
2. Replace the sample files in `assets/user` with your own.  
3. Tweak `config.json` to match your assets and preferences.  
4. Host locally or deploy via GitHub Pages!  

**Need help?** Check the included `config_sample.json` and `assets/user` examples!  

--- 

## Configuration Guide  

### Setup & Installation  
1. **Download the Project**:  
   - Clone this repository or download the ZIP file.  
2. **Prepare Assets**:  
   - Place your maps, overlays, sprites and audio files in the `assets/user` folder:  
     ```
     assets/user/  
     ├── audio/                 # Music/SFX files  
     ├── images/                # Image and sprite files
     ├── maps/                  # Map images (grid/gridless versions...)  
     └──── maps/overlays        # Overlay images (settlements, landmarks, routes...)  
     ```  
   - **Important**: File paths in `config.json` **must** match the filenames and extensions in these folders.  

---

### Editing `config.json`  
Customize the map’s behavior by modifying the `config.json` file.  

#### Basic Settings  
```json  
"Settings": {  
    "Enable Grid Toggle": true,  
    "Enable Reset Zoom": true,  
    "Enable Day Time Toggle": true,  
    "Enable Sound Panel": true,  
    "Welcome Header": "Welcome to My Campaign!",  
    "Zoom": {  
        "Min": 0.8,  
        "Max": 5  
    }  
}  
```  

#### Map & Overlay Paths  
```json  
"Maps": {  
    "Grid": "map_grid.jpg",  
    "Gridless": "map_gridless.jpg"  
},  
"Overlays": {  
    "Settlements": "overlay_settlements.png",  
    "Landmarks": "overlay_landmarks.png"  
}  
```  
- **Example**: If your map is `assets/user/maps/fantasy_map.jpg`, set `"Grid": "fantasy_map.jpg"`.  

#### Interactive Elements  
- **Map Tooltips**: Add lore hints triggered by mouse hover.  
- **Region Music**: Assign music to specific map areas.  
```json  
"Map Tooltips": [  
    {  
        "name": "Oaklen (Village)",  
        "description": "A hub for travelers...",  
        "area": { "x": { "min": 100, "max": 200 }, "y": { "min": 50, "max": 150 } }  
    }  
],  
"Region Music": [  
    {  
        "sound path": "forest_theme.mp3",  
        "area": { "x": { "min": 300, "max": 400 }, "y": { "min": 200, "max": 300 } }  
    }  
]  
```  

#### Coordinate Tracking  
Enable `"TEST-TrackMousePosition": true` to log mouse coordinates in the browser console. Use this to fine-tune tooltip and music regions!  

---

### Hosting Your Map  
1. **Local Testing**:  
   - Open `index.html` in a browser. Use a local server (e.g., Local Host, VS Code’s Live Server) to avoid CORS issues.  
2. **Host Online**:  
   - **GitHub Pages**: Fork this repo, enable GitHub Pages in your repo settings, and select the `main` branch.  
   - Your map will be live at `https://[your-username].github.io/Questifyre-Interactive-Map/`.  

---

## Support & Future Plans  
Love this project? Support its development on [Ko-fi](https://ko-fi.com/questifyer)! With enough support, I’ll build a **free platform** for creating, editing, and hosting interactive maps - no coding required!  

Crafted with 🔥 by ***Bryan Gomes Saraiva*** | [Report Issues](https://github.com/your-repo/issues)
