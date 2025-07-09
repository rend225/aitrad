# Firebase Authentication Setup Guide

## Enable Authentication Providers

To use the social login features, you need to enable the authentication providers in your Firebase console:

### 1. Go to Firebase Console
1. Open your Firebase project
2. Navigate to **Authentication** → **Sign-in method**

### 2. Enable Email/Password (Already enabled)
- This should already be enabled from your initial setup

### 3. Enable Google Sign-In
1. Click on **Google** in the providers list
2. Toggle **Enable**
3. Set your **Project support email**
4. Click **Save**

### 4. Enable Facebook Sign-In
1. Click on **Facebook** in the providers list
2. Toggle **Enable**
3. You'll need to create a Facebook App:
   - Go to [Facebook Developers](https://developers.facebook.com/)
   - Create a new app
   - Add Facebook Login product
   - Get your **App ID** and **App Secret**
   - Add OAuth redirect URI: `https://your-project-id.firebaseapp.com/__/auth/handler`
4. Paste the Facebook **App ID** and **App Secret** in Firebase
5. Click **Save**

## Important Notes

### For Development (localhost)
- Google: Works out of the box
- Facebook: May require additional setup for localhost

### For Production
- Make sure to update all callback URLs to your production domain
- Update homepage URLs in all OAuth apps
- Test each provider thoroughly

### Security Considerations
- Keep all API keys and secrets secure
- Never commit OAuth secrets to version control
- Use environment variables for sensitive data
- Regularly rotate API keys and secrets

## Testing the Integration

1. Start your development server: `npm run dev`
2. Go to the login or register page
3. Try each social login button
4. Check that user data is properly saved to Firestore
5. Verify that users can access protected routes after social login

## Troubleshooting

### Common Issues:
1. **Popup blocked**: Users need to allow popups in their browser
2. **OAuth app not approved**: Some providers require app review for production
3. **Callback URL mismatch**: Double-check all callback URLs match exactly
4. **API limits**: Some providers have rate limits for OAuth requests

### Error Handling:
The app includes comprehensive error handling for:
- Popup closed by user
- Account exists with different credentials
- Network errors
- Provider-specific errors