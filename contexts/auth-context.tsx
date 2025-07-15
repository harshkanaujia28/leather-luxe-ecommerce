"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"
import type { User } from "@/types"
import { authenticateUser } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ user: User }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const user = authenticateUser(email, password)
      if (!user) throw new Error("Invalid email or password")
      setUser(user)
      return { user }
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
