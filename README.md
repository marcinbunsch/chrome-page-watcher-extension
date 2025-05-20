# Chrome Page Watcher Extension

A Chrome extension that watches for specific text on web pages and notifies you when it appears.

## Features

- Watch for specific text on any webpage
- Real-time monitoring with 1-second intervals
- Browser notifications when text is found
- Visual indicator when watching is active
- Start/Stop functionality

## Development Setup

1. Install dependencies:
```bash
pnpm install
```

2. Build the extension:
```bash
pnpm build
```

3. Load the extension in Chrome:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select the `dist` directory

## Development

To start the development server:
```bash
pnpm dev
```

## Building

To build the extension:
```bash
pnpm build
```

The built extension will be in the `dist` directory.

## Usage

1. Click the extension icon in Chrome
2. Enter the text you want to watch for
3. Click "Start" to begin watching
4. The extension will notify you when the text appears on the page
5. Click "Stop" to stop watching

Important - do not switch tabs - if you need to, open a new window. This needs to be in the foreground.

## Technologies Used

- React
- TypeScript
- Vite
- Tailwind CSS
- Chrome Extension APIs 