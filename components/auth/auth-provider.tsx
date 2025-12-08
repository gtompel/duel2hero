"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { User } from "@/lib/types"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<User | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadCurrentUser = useCallback(async () => {
    // Проверяем наличие токена в localStorage
    const token = localStorage.getItem("authToken")
    if (token) {
      try {
        // В реальной реализации здесь будет декодирование JWT токена
        // и получение ID пользователя из токена
        // const decoded = jwt.decode(token);
        // const userId = decoded.userId;
        
        // Пока используем упрощенную реализацию с хранением ID пользователя
        const userId = localStorage.getItem("userId")
        if (userId) {
          try {
            const response = await fetch(`/api/auth/user/${userId}`)
            if (response.ok) {
              const result = await response.json()
              if (result.data) {
                setUser(result.data)
              } else {
                // Если пользователь не найден, удаляем токен
                localStorage.removeItem("authToken")
                localStorage.removeItem("userId")
              }
            } else {
              // Если ошибка, удаляем токен
              localStorage.removeItem("authToken")
              localStorage.removeItem("userId")
            }
          } catch (error) {
            console.error("Error fetching user:", error)
            localStorage.removeItem("authToken")
            localStorage.removeItem("userId")
          }
        }
      } catch (e) {
        console.error("Error loading current user", e)
        // При ошибке удаляем токен
        localStorage.removeItem("authToken")
        localStorage.removeItem("userId")
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
          // В реальной реализации здесь будет генерация JWT токена
          // const token = generateToken(authenticatedUser.id);
          // localStorage.setItem("authToken", token);
          localStorage.setItem("userId", authenticatedUser.id)
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
    // Удаляем токен и ID пользователя из localStorage
    localStorage.removeItem("authToken")
    localStorage.removeItem("userId")
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
