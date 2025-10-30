"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"
import { getCurrentUser } from "@/lib/storage"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (user) {
      router.push("/")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Протоколы ГТО</h1>
          <p className="text-muted-foreground">Система ведения протоколов сдачи норм</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
