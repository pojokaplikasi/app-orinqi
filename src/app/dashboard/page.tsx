"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "@/components/providers/AuthProvider"
import { auth, rtdb } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { ref, get, remove } from "firebase/database"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface HistoryRecord {
  id: string
  name: string
  date: string
  time: string | null
  timezone: string
  gender: number
  unknownTime: boolean
  createdAt: number
  userName?: string // Added to show who created it (for admin view)
  userEmail?: string // Added to show who created it (for admin view)
}

export default function DashboardPage() {
  const { user, userData, loading } = useAuth()
  const router = useRouter()
  const [history, setHistory] = useState<HistoryRecord[]>([])
  const [filteredHistory, setFilteredHistory] = useState<HistoryRecord[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      if (user && userData) {
        try {
          let historyArray: HistoryRecord[] = []

          if (userData.role === "admin") {
            // Admin: Fetch all users' history
            const usersRef = ref(rtdb, `users`)
            const snapshot = await get(usersRef)
            
            if (snapshot.exists()) {
              const allUsersData = snapshot.val()
              
              // Loop through all users
              Object.keys(allUsersData).forEach(uid => {
                const singleUserData = allUsersData[uid]
                const userHistory = singleUserData.history
                
                if (userHistory) {
                  // Loop through history of this specific user
                  Object.keys(userHistory).forEach(historyId => {
                    historyArray.push({
                      id: historyId,
                      ...userHistory[historyId],
                      userName: singleUserData.name,
                      userEmail: singleUserData.email
                    })
                  })
                }
              })
            }
          } else {
            // Normal User: Fetch only their own history
            const historyRef = ref(rtdb, `users/${user.uid}/history`)
            const snapshot = await get(historyRef)
            
            if (snapshot.exists()) {
              const data = snapshot.val()
              historyArray = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
              }))
            }
          }
          
          // Sort by createdAt descending (newest first)
          historyArray.sort((a, b) => b.createdAt - a.createdAt)
          setHistory(historyArray)
          setFilteredHistory(historyArray)
        } catch (error) {
          console.error("Error fetching history:", error)
        } finally {
          setHistoryLoading(false)
        }
      }
    }

    if (!loading && userData) {
      fetchHistory()
    }
  }, [user, userData, loading])

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredHistory(history)
      return
    }

    const lowerQuery = searchQuery.toLowerCase()
    const filtered = history.filter(record => 
      record.name.toLowerCase().includes(lowerQuery) ||
      record.date.includes(lowerQuery) ||
      (record.userName && record.userName.toLowerCase().includes(lowerQuery)) ||
      (record.userEmail && record.userEmail.toLowerCase().includes(lowerQuery))
    )
    setFilteredHistory(filtered)
  }, [searchQuery, history])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleDeleteHistory = async (id: string) => {
    if (!user) return
    
    if (window.confirm("Are you sure you want to delete this chart history?")) {
      try {
        const recordRef = ref(rtdb, `users/${user.uid}/history/${id}`)
        await remove(recordRef)
        
        // Update local state to remove the deleted item
        setHistory(prev => prev.filter(record => record.id !== id))
        setFilteredHistory(prev => prev.filter(record => record.id !== id))
      } catch (error) {
        console.error("Error deleting history:", error)
        alert("Failed to delete history. Please try again.")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Navbar / Header */}
      <nav className="mx-auto mb-8 flex max-w-5xl items-center justify-between rounded-2xl border border-border/50 bg-card/30 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-sm">
            <span className="font-['STKaiti','KaiTi',serif] text-sm font-bold">命</span>
          </div>
          <span className="text-lg font-bold tracking-tight">Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/calculate-v2">
            <Button className="rounded-full bg-gradient-to-r from-primary to-[#F97316] px-6 shadow-[0_8px_20px_rgba(233,75,75,0.2)] transition-colors hover:shadow-[0_12px_25px_rgba(233,75,75,0.3)]">
              New Calculation
            </Button>
          </Link>
          <Button variant="outline" className="rounded-full" onClick={handleLogout}>
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl space-y-6">
        {/* Top Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card (Liquid Glass) */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-card/80 to-card/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-[#F97316]/10 blur-2xl"></div>
            
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[#F97316] text-xl font-bold text-white shadow-lg">
                  {userData?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{userData?.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{userData?.email}</p>
                </div>
              </div>

              {userData ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between rounded-lg bg-background/40 px-4 py-2.5 backdrop-blur-sm">
                    <span className="text-muted-foreground">Phone</span>
                    <span className="font-medium">{userData.phone}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-background/40 px-4 py-2.5 backdrop-blur-sm">
                    <span className="text-muted-foreground">Gender</span>
                    <span className="font-medium capitalize">{userData.gender}</span>
                  </div>
                  <div className="flex justify-between rounded-lg bg-background/40 px-4 py-2.5 backdrop-blur-sm">
                    <span className="text-muted-foreground">Role</span>
                    <span className="font-medium capitalize">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${userData.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {userData.role}
                      </span>
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Card (Liquid Glass) */}
          <div className="relative overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br from-card/80 to-card/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-2xl">
            <div className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-[#F97316]/10 blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
            
            <div className="relative z-10 flex h-full flex-col">
              <h2 className="mb-2 text-lg font-semibold text-muted-foreground">Total Calculations</h2>
              
              <div className="flex flex-1 items-center justify-center">
                {historyLoading ? (
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="bg-gradient-to-br from-primary to-[#F97316] bg-clip-text text-7xl font-bold text-transparent drop-shadow-sm">
                      {history.length}
                    </span>
                    <span className="mt-2 text-sm font-medium text-muted-foreground">Charts Generated</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-hidden rounded-[24px] border border-border/50 bg-card/50 shadow-sm backdrop-blur-sm">
          <div className="flex flex-col gap-4 border-b border-border/50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">Calculation History</h2>
            <div className="relative w-full sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full rounded-full border border-input bg-background pl-9 pr-4 text-sm text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-3 font-medium">Chart Name</th>
                  {userData?.role === "admin" && (
                    <th className="px-6 py-3 font-medium">Created By</th>
                  )}
                  <th className="px-6 py-3 font-medium">Birth Date</th>
                  <th className="px-6 py-3 font-medium">Time</th>
                  <th className="px-6 py-3 font-medium">Gender</th>
                  <th className="px-6 py-3 font-medium">Calculated On</th>
                  <th className="px-6 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {historyLoading ? (
                  <tr>
                    <td colSpan={userData?.role === "admin" ? 7 : 6} className="px-6 py-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        Loading history...
                      </div>
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={userData?.role === "admin" ? 7 : 6} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        <p>{searchQuery ? "No matching calculations found." : "No calculations yet."}</p>
                        {!searchQuery && (
                          <Link href="/calculate-v2">
                            <Button variant="link" className="text-primary">Create your first chart</Button>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((record) => (
                    <tr key={record.id} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4 font-medium text-foreground">{record.name}</td>
                      {userData?.role === "admin" && (
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{record.userName || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">{record.userEmail || "No email"}</span>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">{record.date}</td>
                      <td className="px-6 py-4">
                        {record.unknownTime ? (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">Unknown</span>
                        ) : (
                          record.time
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {record.gender === 1 ? (
                          <span className="flex items-center gap-1 text-blue-500"><span className="text-xs">♂</span> Male</span>
                        ) : (
                          <span className="flex items-center gap-1 text-pink-500"><span className="text-xs">♀</span> Female</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(record.createdAt).toLocaleDateString('en-US', { 
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                            onClick={() => {
                              const params = new URLSearchParams({
                                name: record.name,
                                date: record.date,
                                time: record.time || "",
                                timezone: record.timezone,
                                gender: record.gender.toString(),
                                unknownTime: record.unknownTime.toString()
                              })
                              window.open(`/calculate-v2?${params.toString()}`, '_blank')
                            }}
                          >
                            View Chart
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDeleteHistory(record.id)}
                            title="Delete Chart"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
