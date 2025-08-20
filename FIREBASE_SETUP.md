# Firebase Project Setup Instructions

Your app is now connected to Firebase project: **test-5e23a**

## 🚨 IMPORTANT: Manual Setup Required

Since this is a new Firebase project, you need to manually configure it in the Firebase Console.

## Step 1: Configure Firestore Security Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **test-5e23a**
3. Navigate to **Firestore Database** > **Rules**
4. Copy and paste the following **DEVELOPMENT** rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // TEMPORARY DEVELOPMENT RULES - Very permissive for initial setup
    // TODO: Replace with production rules after setup is complete
    
    // Allow all authenticated users to read/write everything for now
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Allow public read access for certain collections
    match /plans/{document} {
      allow read: if true; // Public read for pricing page
    }
    
    match /settings/{document} {
      allow read: if true; // Public read for SEO settings
    }
    
    match /featured_signals/{document} {
      allow read: if true; // Public read for homepage
    }
    
    // NOTE: These rules are for development only!
    // In production, use the more restrictive rules from firestore.rules
  }
}
```

5. Click **Publish** to deploy the rules

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** authentication
3. Optionally enable **Google** and **Facebook** sign-in

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select your preferred location

## Step 4: Test the Setup

1. Visit `/debug` page in your app
2. Click **"Run Setup"** to initialize collections
3. Try registering a new account
4. Check if the Dashboard loads without errors

## Step 5: Production Rules (Later)

After initial setup is complete, replace with these production-ready rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }
    
    function isAdmin() {
      return request.auth != null && 
             exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Users collection
    match /users/{userId} {
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow read, update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Recommendations collection
    match /recommendations/{userId} {
      allow read, write: if isOwner(userId) || isAdmin();
      
      match /{document=**} {
        allow read, write: if isOwner(userId) || isAdmin();
      }
    }
    
    // Public collections
    match /plans/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /schools/{document} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    match /settings/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    match /featured_signals/{document} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Chat system
    match /chats/{chatId} {
      allow create: if isAuthenticated() && request.auth.uid == request.resource.data.userId;
      allow read, update, delete: if isAuthenticated() && 
                                   resource != null && 
                                   resource.data != null && 
                                   resource.data.userId != null && 
                                   request.auth.uid == resource.data.userId;
      allow read, write: if isAdmin();
      
      match /messages/{messageId} {
        allow create: if isAuthenticated() && 
                      exists(/databases/$(database)/documents/chats/$(chatId)) &&
                      get(/databases/$(database)/documents/chats/$(chatId)).data.userId == request.auth.uid;
        allow read, write: if isAuthenticated() && 
                           exists(/databases/$(database)/documents/chats/$(chatId)) &&
                           get(/databases/$(database)/documents/chats/$(chatId)).data.userId == request.auth.uid;
        allow read, write: if isAdmin();
      }
    }
    
    // Admin collections
    match /admin/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

## Troubleshooting

If you still get permission errors:

1. **Double-check rules are published** in Firebase Console
2. **Verify Firestore database is created** and in the same region
3. **Check Authentication is enabled** for Email/Password
4. **Try signing out and back in** to refresh tokens
5. **Visit `/debug` page** to run diagnostics

## Quick Fix Commands

If you have Firebase CLI installed locally:

```bash
# Install Firebase CLI (if not installed)
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project (select existing project: test-5e23a)
firebase init firestore

# Deploy rules
firebase deploy --only firestore:rules
```
