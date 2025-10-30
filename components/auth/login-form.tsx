"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (!username.trim()) {
      setError("Введите имя пользователя")
      setIsLoading(false)
      return
    }

    const user = login(username.trim())

    if (user) {
      router.push("/")
      router.refresh()
    } else {
      setError("Пользователь не найден")
    }

    setIsLoading(false)
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl md:text-2xl text-center">Вход в систему</CardTitle>
        <CardDescription className="text-center text-sm">Введите имя пользователя для входа</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm">
              Имя пользователя
            </Label>
            <Input
              id="username"
              placeholder="admin или user"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            <LogIn className="mr-2 h-4 w-4" />
            {isLoading ? "Вход..." : "Войти"}
          </Button>

          <div className="text-xs md:text-sm text-muted-foreground text-center space-y-1 pt-2">
            <p>Доступные пользователи:</p>
            <p>
              <strong>admin</strong> - администратор
            </p>
            <p>
              <strong>user</strong> - пользователь
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
