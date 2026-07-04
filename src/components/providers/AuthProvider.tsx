"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, User } from "firebase/auth"
import { auth, rtdb } from "@/lib/firebase"
import { ref, get } from "firebase/database"
import { useRouter, usePathname } from "next/navigation"

interface UserData {
  uid: string
  email: string
  name: string
  gender: string
  phone: string
  role: "user" | "admin"
  createdAt: number
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser)
      
      if (currentUser) {
        // Fetch additional user data from Realtime Database
        try {
          const userRef = ref(rtdb, `users/${currentUser.uid}`)
          const snapshot = await get(userRef)
          if (snapshot.exists()) {
            setUserData(snapshot.val() as UserData)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Auth Guard Logic
  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname === "/login" || pathname === "/register"
      const isPublicPage = pathname === "/" // Removed /calculate-v2 from public pages

      if (!user && !isAuthPage && !isPublicPage) {
        // Redirect unauthenticated users to login if they try to access protected routes
        router.replace("/login")
      } else if (user && isAuthPage) {
        // Redirect authenticated users away from login/register pages
        router.replace("/dashboard") // Or wherever you want them to go after login
      }
    }
  }, [user, loading, pathname, router])

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
