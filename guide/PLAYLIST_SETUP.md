# 🎵 Commute Playlist Setup Guide

## Overview
This system allows users to collaboratively search and submit songs to your YouTube playlist. You can review submissions and approve them to be added to your actual YouTube playlist.

## 🔧 Setup Instructions

### 1. YouTube API Configuration

#### Enable YouTube Data API v3:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your existing project (the one with your Google Maps API)
3. Enable **YouTube Data API v3** in the API Library
4. Your existing API key will now work with YouTube API

#### Get YouTube Playlist ID:
1. Go to your YouTube playlist
2. Copy the playlist ID from the URL: `https://www.youtube.com/playlist?list=PLxxxxxxxxx`
3. The playlist ID is the part after `list=`

### 2. Update Configuration

Edit `config.production.js` and replace the placeholder values:

```javascript
// YouTube Playlist Configuration
YOUTUBE: {
  PLAYLIST_ID: 'YOUR_ACTUAL_PLAYLIST_ID', // Replace with your actual playlist ID
  CHANNEL_ID: 'YOUR_CHANNEL_ID'           // Replace with your channel ID
},

// Admin configuration
ADMIN: {
  EMAIL: 'your-admin-email@domain.com', // Replace with your admin email
  ROLES: ['admin', 'moderator']
}
```

**Note**: The YouTube API key is already configured to use your existing Google Maps API key.

### 3. Google Apps Script Setup

#### Deploy Playlist.gs:
1. Go to [Google Apps Script](https://script.google.com/)
2. Create a new project
3. Copy the content from `Playlist.gs`
4. Deploy as web app:
   - Execute as: "Me"
   - Who has access: "Anyone"
5. Copy the deployment URL

#### Create Config Sheet (Optional):
In your Google Sheets, create a sheet named "Config" with these columns:
```
A1: YOUTUBE_PLAYLIST_ID  
B1: YOUR_PLAYLIST_ID_VALUE

A2: YOUTUBE_CHANNEL_ID
B2: YOUR_CHANNEL_ID_VALUE
```

**Note**: If you don't create the Config sheet, the system will use the values from `config.production.js`.

### 4. Update Script URLs (Optional)

If you want to use a separate script for playlist management, update the script URL in `config.production.js`:

```javascript
GOOGLE_APPS_SCRIPT: {
  // ... other URLs ...
  PLAYLIST: 'YOUR_DEPLOYED_SCRIPT_URL'
}
```

**Note**: Currently using the same script as your main operations.

## 🚀 How It Works

### For Users:
1. Navigate to "My Rides" page
2. Click "🔍 Search & Submit Songs"
3. Enter your name and search for a song
4. Click "Add to Playlist" on desired songs
5. Songs are submitted for admin review

### For Admin:
1. Log in with admin email
2. View pending submissions in the admin section
3. Click "Approve" to add songs to YouTube playlist
4. Songs are automatically added to your YouTube playlist

### Features:
- ✅ User authentication required
- ✅ Song search via YouTube API (using your existing API key)
- ✅ User tracking and submission history
- ✅ Admin approval workflow
- ✅ Automatic YouTube playlist integration
- ✅ Daily playlist generation
- ✅ Modern, responsive UI

## 🔒 Security Notes

1. **API Key**: Using your existing Google API key (already restricted to your domain)
2. **Admin Access**: Only the configured admin email can approve songs
3. **User Authentication**: All users must be logged in to submit songs

## 📱 Mobile Responsive

The interface is fully responsive and works on:
- Desktop browsers
- Mobile devices
- Tablets

## 🎨 Customization

### Colors and Styling:
The system uses your existing color scheme:
- Primary: `#1B263B`
- Secondary: `#415A77`
- Accent: `#E0E1DD`

### Adding Features:
- Modify `Playlist.gs` for backend changes
- Update `CommutePlaylist.html` for frontend changes
- Add new routes in the Google Apps Script

## 🐛 Troubleshooting

### Common Issues:

1. **"YouTube API Error"**
   - Ensure YouTube Data API v3 is enabled in Google Cloud Console
   - Check that your API key has YouTube permissions
   - Verify API key restrictions include your domain

2. **"Script URL Error"**
   - Verify Google Apps Script is deployed
   - Check deployment permissions
   - Update script URL in config if using separate script

3. **"No songs found"**
   - Check search terms
   - Verify API key has search permissions
   - Check browser console for errors

4. **"Admin section not showing"**
   - Verify admin email in config
   - Check user is logged in with admin email
   - Clear browser cache

### Debug Mode:
Add `console.log()` statements in the JavaScript files to debug issues.

## 📞 Support

For issues or questions:
1. Check browser console for errors
2. Verify all configuration values
3. Test API endpoints individually
4. Check Google Apps Script logs

## 🔄 Updates

To update the system:
1. Replace files with new versions
2. Update configuration if needed
3. Test functionality
4. Deploy changes

---

**Note**: This system integrates with your existing ride-sharing application and uses the same authentication and styling patterns. It also uses your existing Google API key for YouTube functionality. 