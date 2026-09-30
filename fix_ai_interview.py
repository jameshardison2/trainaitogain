import re

with open("ai-interview.html", "r") as f:
    content = f.read()

# Replace the bad init block with just try-catch or nothing if it fails
bad_init = """            let app;
            if (!getApps().length) {
                app = initializeApp({ projectId: "trainaitogain-50c19" });
            } else {
                app = getApp();
            }"""

good_init = """            let app;
            if (!getApps().length) {
                app = initializeApp({ 
                    apiKey: "AIzaSyD54pf1L7RK3uc4y8qK_gsY38BHzXJwb_A", 
                    authDomain: "trainaitogain-50c19.firebaseapp.com", 
                    projectId: "trainaitogain-50c19", 
                    storageBucket: "trainaitogain-50c19.firebasestorage.app", 
                    messagingSenderId: "637746276432", 
                    appId: "1:637746276432:web:1a7cfa65357b0bc3b90955"
                });
            } else {
                app = getApp();
            }"""

content = content.replace(bad_init, good_init)

with open("ai-interview.html", "w") as f:
    f.write(content)

print("Fixed ai-interview.html")
