rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
             (request.auth.token.email == "ramonalduey@gmail.com" || 
              request.auth.uid == "VB4dzPmCjaSySSzqSHp5VbDHDZw2");
    }

    // Specific collection rules
    match /churches/{churchId} {
      allow read, write: if isAuthenticated();
    }

    match /meetings/{meetingId} {
      allow read, write: if isAuthenticated();
    }

    match /groupConfigs/{configId} {
      allow read, write: if isAuthenticated();
    }

    match /settings/{settingId} {
      allow read, write: if isAuthenticated();
    }

    // Global admin access
    match /{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
