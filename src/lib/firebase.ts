import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Parse the base64 encoded JSON config from environment variable
const getFirebaseConfig = () => {
  try {
    const encodedConfig = process.env.NEXT_PUBLIC_FIREBASE_CONFIG
    if (!encodedConfig) {
      console.warn("Firebase config is missing in environment variables")
      return {}
    }

    // Decode base64 and parse JSON
    const decodedConfig = Buffer.from(encodedConfig, "base64").toString("utf-8")
    return JSON.parse(decodedConfig)
  } catch (error) {
    console.error("Failed to parse Firebase config:", error)
    return {}
  }
}

const firebaseConfig = getFirebaseConfig()

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { app, auth, db, storage }
