# Project Structure

## New Organization

The project has been reorganized for better maintainability:

```
asmuiahmad.github.io/
├── index.html              # Root redirect (redirects to /html/)
├── html/
│   └── index.html          # Main page (with ../assets/ relative paths)
├── components/
│   └── music-player.html   # Music player component (loaded dynamically)
├── assets/
│   ├── css/
│   ├── js/
│   │   ├── component-loader.js    # New: loads HTML components
│   │   ├── music-player.js        # Handles music player functionality
│   │   └── ...
│   ├── img/
│   └── audio/
└── README.md
```

## Key Changes

### 1. **Moved index.html to html folder**
   - Main page is now at `html/index.html`
   - Root `index.html` redirects to `/html/`
   - All asset paths updated to use `../assets/` relative paths

### 2. **Separated Music Player Component**
   - HTML markup moved from `index.html` to `components/music-player.html`
   - Can now be edited independently without touching main HTML
   - Dynamically loaded via `component-loader.js`

### 3. **New component-loader.js**
   - Loads HTML components dynamically at runtime
   - Updated to work with the new folder structure
   - Loads music player from `../components/music-player.html`

## Live Server Usage

To run with Live Server:

1. **Option 1: Serve from root (default)**
   - Start Live Server from the root directory
   - It will automatically redirect to `/html/`

2. **Option 2: Serve from html folder**
   - Start Live Server from the `html/` folder
   - Navigate directly to the main page

## Asset Paths

All paths in `html/index.html` use relative paths:
- `../assets/css/main.css`
- `../assets/js/functions-min.js`
- `../components/music-player.html` (loaded via component-loader.js)

This ensures compatibility with both root and folder-based Live Server configurations.

## Development Notes

- Edit `html/index.html` for main page structure
- Edit `components/music-player.html` for music player markup
- Edit `assets/js/music-player.js` for music player functionality
- Edit `assets/js/component-loader.js` to change how components are loaded
