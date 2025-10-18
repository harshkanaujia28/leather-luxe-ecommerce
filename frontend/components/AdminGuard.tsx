"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: React.ReactNode
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) return
    if (user.role !== "admin") {
      router.push("/") // Non-admin redirect
    }
  }, [user, router])

  if (!user || user.role !== "admin") return null
  return <>{children}</>
}
