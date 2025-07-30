# AMIK QR CODE - Progressive Web App

## What This Is
This is your complete QR code generator app that works like a mobile app. It creates QR codes instantly and can be installed on phones, tablets, and computers.

## What It Does
- **Creates QR Codes**: Type any text or website link, and it instantly creates a QR code
- **Different Sizes**: Choose from small (200x200) to extra large (500x500) pixels
- **Download**: Save QR codes as PNG image files
- **Copy**: Copy QR codes to paste in other apps
- **Works Offline**: Once installed, works without internet
- **Install on Device**: Can be installed like a regular app

## Your Custom Features
- **Your Logo**: Uses your futuristic circular icon throughout the app
- **Your Colors**: Cyan/blue theme matching your brand
- **Your Name**: "AMIK QR CODE" branding everywhere
- **Modern Design**: Dark theme with glowing effects and animations

## Files Included
1. **index.html** - The main app page (what users see)
2. **style.css** - All the colors, fonts, and visual design
3. **script.js** - The app functionality (how it works)
4. **manifest.json** - Tells phones/computers this is an installable app
5. **sw.js** - Makes the app work offline
6. **qrcode.min.js** - The code that actually creates QR codes
7. **icon.svg** - Your circular logo in web format
8. **favicon.ico** - Your logo for browser tabs
9. **icon-192.png** - Your logo for phone home screens
10. **icon-512.png** - Your logo for app stores

## How to Use
1. Open the app in a web browser
2. Type any text in the text box
3. Watch the QR code appear instantly
4. Choose your preferred size
5. Click "Download PNG" to save it
6. Click "Copy to Clipboard" to copy it
7. Click "Install App" to add it to your device

## How to Put Online
1. Upload all files to your GitHub repository
2. Enable GitHub Pages in your repository settings
3. Your app will be live at: https://amik-coorporations.github.io/AMIK-QR-CODE/

## Technical Details (For Developers)
- Pure HTML, CSS, JavaScript (no frameworks)
- Progressive Web App (PWA) with Service Worker
- Offline-first architecture
- Real-time QR generation with 300ms debouncing
- Canvas-based QR rendering with API fallback
- Responsive design for all screen sizes
- Modern CSS animations and transitions
- Firebase Firestore integration for cloud storage
- Environment variables for secure configuration

## Environment Variables
The app uses environment variables for secure configuration. These are stored in the `.env` file:

```
# Firebase Configuration
FIREBASE_API_KEY=your-api-key
FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_STORAGE_BUCKET=your-project-id.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your-sender-id
FIREBASE_APP_ID=your-app-id
FIREBASE_MEASUREMENT_ID=your-measurement-id
```

These variables are loaded at runtime and used to configure the Firebase connection. If the `.env` file cannot be loaded, the app will fall back to default values.