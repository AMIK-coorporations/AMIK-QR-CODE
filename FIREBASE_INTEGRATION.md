# Firebase Integration for AMIK QR CODE

## Overview
This project has been integrated with Firebase Firestore to store QR code generation records and scan history. The integration provides cloud-based data persistence while maintaining local storage as a fallback.

## Firebase Configuration
- **Project ID**: amik-qr-code
- **Database**: Firestore
- **Collection**: `qrRecords`

## Features

### Data Storage
- QR code generation records are automatically saved to Firebase
- Scan history is tracked and stored in the cloud
- Local storage is maintained as a backup

### Data Structure
Each record in the `qrRecords` collection contains:
```javascript
{
  id: "firebase-document-id",
  firebaseId: "firebase-document-id", // For reference
  timestamp: "2024-01-01T00:00:00.000Z",
  content: "QR code content",
  type: "text|wifi|youtube|video",
  category: "Text/URL|WiFi|YouTube|Video",
  size: "300",
  actions: {
    downloaded: boolean,
    copied: boolean,
    scanned: boolean
  },
  scanCount: number,
  lastScanned: "2024-01-01T00:00:00.000Z",
  qrImage: "base64-image-data"
}
```

### Error Handling
- If Firebase is unavailable, the app falls back to localStorage
- All Firebase operations are wrapped in try-catch blocks
- Console logging for debugging

## Setup Instructions

1. **Firebase Project**: The Firebase project is already configured
2. **Security Rules**: Make sure Firestore security rules allow read/write access
3. **CORS**: The Firebase configuration is set up for web deployment

## Usage

### Automatic Features
- QR code generation automatically saves to Firebase
- QR code scanning automatically saves to Firebase
- Download and copy actions are tracked in Firebase
- Records are loaded from Firebase on app startup

### Manual Features
- View all records in the Records modal
- Delete records (removes from both Firebase and local storage)
- Copy content from records
- Regenerate QR codes from records

## Security Considerations
- Firebase API keys are exposed in client-side code (this is normal for web apps)
- Consider implementing user authentication for production use
- Firestore security rules should be configured appropriately

## Troubleshooting

### Firebase Not Loading
- Check browser console for errors
- Verify internet connection
- Check if Firebase project is active

### Data Not Syncing
- Check browser console for Firebase errors
- Verify Firestore security rules
- Check network connectivity

### Fallback Behavior
- If Firebase fails, data is saved to localStorage
- App continues to function normally
- Data can be recovered from localStorage

## Development Notes
- Firebase SDK version: 10.7.1
- Uses ES6 modules for Firebase imports
- Async/await pattern for all Firebase operations
- Graceful degradation to localStorage 