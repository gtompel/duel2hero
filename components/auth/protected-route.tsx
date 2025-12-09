"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "./auth-provider"
import { Loader2 } from "lucide-react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading) {
      if (!user) {
        router.push("/login")
      } else if (requireAdmin && user.role !== "admin") {
        router.push("/")
      }
    }
  }, [user, isLoading, requireAdmin, router, mounted])

  // Всегда возвращаем одинаковую структуру до завершения проверки
  // Это предотвращает гидратационные ошибки
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || (requireAdmin && user.role !== "admin")) {
    // Возвращаем пустой div вместо null для консистентности
    return <div className="min-h-screen bg-background" />
  }

  return <>{children}</>
}