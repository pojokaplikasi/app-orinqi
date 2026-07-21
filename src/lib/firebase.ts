import { getApp, getApps, initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

// Parse the base64 encoded JSON config
const getFirebaseConfig = () => {
  try {
    // Hardcoded base64 config as requested
    const encodedConfig =
      "eyJhcGlLZXkiOiJBSXphU3lCMW11MXBhdVBPZkhvWGYwb2Y2b2g1Rk94OGpMYzZlNk0iLCJhdXRoRG9tYWluIjoib3JpbnFpLTZkYWY0LmZpcmViYXNlYXBwLmNvbSIsImRhdGFiYXNlVVJMIjoiaHR0cHM6Ly9vcmlucWktNmRhZjQtZGVmYXVsdC1ydGRiLmFzaWEtc291dGhlYXN0MS5maXJlYmFzZWRhdGFiYXNlLmFwcCIsInByb2plY3RJZCI6Im9yaW5xaS02ZGFmNCIsInN0b3JhZ2VCdWNrZXQiOiJvcmlucWktNmRhZjQuZmlyZWJhc2VzdG9yYWdlLmFwcCIsIm1lc3NhZ2luZ1NlbmRlcklkIjoiOTI0ODkwMjE2NjY3IiwiYXBwSWQiOiIxOjkyNDg5MDIxNjY2Nzp3ZWI6YTY2NDE5ZTBiNWE2ZGZlYWMxYjRmZSIsIm1lYXN1cmVtZW50SWQiOiJHLUtSQ0wwTVg5UEUifQ=="

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
const rtdb = getDatabase(app)

export { app, auth, db, storage, rtdb }
