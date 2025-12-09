"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User } from "@/lib/types"
import jwt from 'jsonwebtoken'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Секрет для подписи JWT токенов (в реальном приложении должен храниться на сервере)
const JWT_SECRET = "gto_jwt_secret_key"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCurrentUser = useCallback(async () => {
    // Проверяем, что код выполняется на клиенте
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        // Декодируем JWT токен
        const decoded: any = jwt.decode(token)
        if (decoded && decoded.userId) {
          try {
            const response = await fetch(`/api/auth/user/${decoded.userId}`)
            if (response.ok) {
              const result = await response.json()
              if (result.data) {
                setUser(result.data)
              } else {
                // Если пользователь не найден, удаляем токен
                localStorage.removeItem("authToken")
              }
            } else {
              // Если ошибка, удаляем токен
              localStorage.removeItem("authToken")
            }
          } catch (error) {
            console.error("Error fetching user:", error)
            localStorage.removeItem("authToken")
          }
        }
      } catch (e) {
        console.error("Error decoding token", e)
        // При ошибке удаляем токен
        localStorage.removeItem("authToken")
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadCurrentUser()
  }, [loadCurrentUser])

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (response.ok) {
        const result = await response.json()
        const authenticatedUser = result.data
        if (authenticatedUser) {
          setUser(authenticatedUser)
          // Генерируем и сохраняем JWT токен
          if (typeof window !== 'undefined') {
            const token = jwt.sign(
              { userId: authenticatedUser.id, username: authenticatedUser.username },
              JWT_SECRET,
              { expiresIn: '24h' }
            )
            localStorage.setItem("authToken", token)
          }
          return authenticatedUser
        }
      }
      return null
    } catch (error) {
      console.error("Error logging in:", error)
      return null
    }
  }

  const logout = () => {
    setUser(null)
    // Удаляем токен из localStorage только на клиенте
    if (typeof window !== 'undefined') {
      localStorage.removeItem("authToken")
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
