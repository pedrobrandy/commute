# Security Setup Guide

## 🔐 Important Security Information

This project contains sensitive API keys and credentials that need to be handled securely.

## 📁 Configuration Files

### ✅ Safe to Commit (Public)
- `config.example.js` - Template with placeholder values
- `config.production.js` - Contains restricted API keys (safe for public deployment)

### ❌ Never Commit (Private)
- `.env` files
- `config.local.js`
- `config.development.js`
- `config.secret.js`
- Any files with actual credentials

## 🔑 API Keys and Credentials

### Current Configuration
All sensitive credentials are now centralized in `config.production.js`:

- **Twilio Credentials**: Account SID, Auth Token, Phone Number
- **Google API Keys**: Maps, YouTube, OAuth Client ID
- **Google Apps Script URLs**: All script deployment URLs

### Security Measures

1. **Domain Restrictions**: All API keys are restricted to specific domains
2. **Public Deployment**: `config.production.js` is safe for GitHub Pages deployment
3. **Centralized Management**: All credentials in one place for easy management

## 🚀 Deployment Instructions

### For GitHub Pages (Public)
1. Use `config.production.js` as is (already configured)
2. All API keys have domain restrictions
3. Safe for public repositories

### For Local Development
1. Copy `config.example.js` to `config.local.js`
2. Fill in your local development credentials
3. Add `config.local.js` to `.gitignore`
4. Update HTML files to load `config.local.js` instead of `config.production.js`

### For Production Servers
1. Use environment variables when possible
2. Store credentials in secure environment variables
3. Never commit actual credentials to version control

## 🔧 File Updates Made

### Updated Files
- `api-utils.js` - Removed hardcoded Twilio credentials
- `twilio-config.js` - Now references main config
- `config.production.js` - Centralized all credentials
- `config.example.js` - Updated template
- `.gitignore` - Added security exclusions

### Security Improvements
1. ✅ Removed hardcoded credentials from source files
2. ✅ Centralized all sensitive data in one config file
3. ✅ Added proper `.gitignore` exclusions
4. ✅ Created example configuration template
5. ✅ Added security documentation

## ⚠️ Important Notes

1. **Never commit real credentials** to version control
2. **Use domain restrictions** on all API keys
3. **Rotate credentials regularly** for security
4. **Monitor API usage** for unauthorized access
5. **Use environment variables** in production when possible

## 🔍 Verification

To verify your setup is secure:

1. Check that no hardcoded credentials exist in source files
2. Ensure `.gitignore` excludes sensitive files
3. Verify API keys have proper domain restrictions
4. Test that the application works with the new configuration

## 📞 Support

If you need help with security setup or credential management, refer to the individual service documentation:

- [Twilio Security Best Practices](https://www.twilio.com/docs/security)
- [Google Cloud Security](https://cloud.google.com/security)
- [GitHub Pages Security](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https) 