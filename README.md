# Commute - Ride Sharing Application

A modern web application for ride sharing and commute management with integrated music playlists and real-time notifications.

## 🚀 Quick Start

### Prerequisites
- Modern web browser
- Local web server (for development)
- Twilio account (for SMS notifications)
- Google Cloud Platform account (for Maps and YouTube APIs)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/pedrobrandy/commute.git
   cd commute
   ```

2. **Set up configuration**
   - Copy `src/config/config.example.js` to `src/config/config.local.js`
   - Update `config.local.js` with your real API keys and secrets
   - The `config.local.js` file is automatically ignored by Git

3. **Start development server**
   ```bash
   # Using Python (if available)
   python -m http.server 8000

   # Using Node.js (if available)
   npx http-server

   # Or open src/views/index.html directly in your browser
   ```

4. **Access the application**
   - Open `http://localhost:8000/src/views/index.html` in your browser
   - Or navigate to the appropriate HTML file directly

## 📁 Project Structure

```
commute/
├── src/
│   ├── assets/          # Static assets
│   ├── components/      # Reusable components
│   ├── config/          # Configuration files
│   │   ├── config.example.js      # Example configuration
│   │   ├── config.production.js   # Production config (public)
│   │   └── config.local.js        # Local config (ignored by Git)
│   ├── scripts/         # JavaScript files
│   ├── styles/          # CSS files
│   └── views/           # HTML pages
├── public/
│   └── image/           # Images and media
├── test/                # Test files
├── guide/               # Documentation
└── README.md
```

## ⚙️ Configuration

### Local Development
Create `src/config/config.local.js` with your real credentials:

```javascript
const CONFIG = {
  TWILIO: {
    ACCOUNT_SID: 'your_twilio_account_sid',
    AUTH_TOKEN: 'your_twilio_auth_token',
    PHONE_NUMBER: '+1234567890'
  },
  GOOGLE_OAUTH: {
    CLIENT_ID: 'your_google_oauth_client_id',
    CLIENT_SECRET: 'your_google_oauth_client_secret'
  },
  YOUTUBE: {
    API_KEY: 'your_youtube_api_key'
  },
  GOOGLE_MAPS_API_KEY: 'your_google_maps_api_key',
  GOOGLE_APPS_SCRIPT: {
    MAIN: 'your_google_apps_script_url',
    SHARED_RIDE: 'your_shared_ride_script_url',
    SUMMARY: 'your_summary_script_url'
  }
};
```

### Production Deployment
The `config.production.js` file contains placeholder values for public deployment. For production:

1. Use environment variables in your hosting platform
2. Or replace the placeholder values with restricted API keys
3. Never commit real secrets to the repository

## 🔧 Features

- **Ride Sharing**: Book shared rides with other commuters
- **Personal Rides**: Reserve private rides for yourself
- **Music Integration**: Collaborative YouTube playlists
- **SMS Notifications**: Real-time updates via Twilio
- **Google Maps Integration**: Route planning and navigation
- **User Authentication**: Phone number verification
- **Responsive Design**: Works on desktop and mobile

## 📱 Pages

- **Home**: `src/views/index.html` - Main application interface
- **Login**: `src/views/Login.html` - User authentication
- **Register**: `src/views/register.html` - User registration
- **Shared Ride**: `src/views/Shared Ride.html` - Book shared rides
- **Personal Ride**: `src/views/Personal Ride.html` - Book private rides
- **My Rides**: `src/views/My Rides.html` - View ride history
- **Playlist**: `src/views/CommutePlaylist.html` - Music management
- **Q&A**: `src/views/qa.html` - Help and support

## 🛠️ Development

### File Structure Changes
All HTML files have been updated with correct relative paths:
- Scripts: `../scripts/filename.js`
- Styles: `../styles/filename.css`
- Images: `../../public/image/filename.png`
- Config: `../config/config.production.js`

### Adding New Features
1. Place HTML files in `src/views/`
2. Place JavaScript files in `src/scripts/`
3. Place CSS files in `src/styles/`
4. Place images in `public/image/`
5. Update paths in HTML files accordingly

## 🔒 Security

- Sensitive configuration is stored in `config.local.js` (ignored by Git)
- Production config uses placeholder values
- API keys should be restricted to specific domains
- SMS verification prevents unauthorized access

## 📚 Documentation

See the `guide/` directory for detailed setup instructions:
- `guide/SECURITY.md` - Security best practices
- `guide/TWILIO_SETUP.md` - Twilio configuration
- `guide/QUICK_START.md` - Quick setup guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the `guide/` directory for documentation
- Review the Q&A page in the application
- Open an issue on GitHub

---

**Note**: This application requires proper API keys and credentials to function. Make sure to set up all required services before testing.
