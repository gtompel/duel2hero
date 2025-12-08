"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogIn, UserPlus, RotateCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"

export function LoginForm() {
  const router = useRouter()
  const { login } = useAuth()
  const [isRegistering, setIsRegistering] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    setIsLoading(true)

    if (!username.trim()) {
      setError("Введите имя пользователя")
      setIsLoading(false)
      return
    }

    if (isResettingPassword) {
      // Сброс пароля
      try {
        // В реальной реализации здесь будет вызов API для сброса пароля
        // const response = await fetch('/api/auth/reset-password', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ username }),
        // });
        // 
        // if (!response.ok) {
        //   throw new Error('Password reset failed');
        // }
        
        // Для демонстрации просто показываем сообщение
        setSuccessMessage("Если пользователь существует, инструкции по сбросу пароля были отправлены на ваш email.")
      } catch (err) {
        setError("Ошибка при сбросе пароля")
      }
    } else if (isRegistering) {
      // Регистрация нового пользователя
      if (!password) {
        setError("Введите пароль")
        setIsLoading(false)
        return
      }

      if (password !== confirmPassword) {
        setError("Пароли не совпадают")
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        // После успешной регистрации сразу логиним пользователя
        const user = await login(username.trim(), password)
        if (user) {
          router.push("/")
          router.refresh()
        } else {
          setError("Ошибка входа после регистрации")
        }
      } catch (err) {
        setError("Ошибка при регистрации")
      }
    } else {
      // Вход существующего пользователя
      if (!password) {
        setError("Введите пароль")
        setIsLoading(false)
        return
      }

      const user = await login(username.trim(), password)
      if (user) {
        router.push("/")
        router.refresh()
      } else {
        setError("Неверное имя пользователя или пароль")
      }
    }

    setIsLoading(false)
  }

  const toggleMode = (mode: 'login' | 'register' | 'reset') => {
    setIsRegistering(mode === 'register')
    setIsResettingPassword(mode === 'reset')
    setError("")
    setSuccessMessage("")
  }

  return (
    <Card className="w-full max-w-md mx-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-xl md:text-2xl text-center">
          {isResettingPassword ? "Сброс пароля" : isRegistering ? "Регистрация" : "Вход в систему"}
        </CardTitle>
        <CardDescription className="text-center text-sm">
          {isResettingPassword 
            ? "Введите имя пользователя для сброса пароля" 
            : isRegistering 
            ? "Создайте новый аккаунт" 
            : "Введите учетные данные для входа"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm">
              Имя пользователя
            </Label>
            <Input
              id="username"
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="h-11"
            />
          </div>

          {!isResettingPassword && (
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm">
                {isRegistering ? "Пароль" : "Пароль"}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={isRegistering ? "Введите пароль" : "Введите пароль"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>
          )}

          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm">
                Подтвердите пароль
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Подтвердите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="h-11"
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}
          {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}

          <Button type="submit" className="w-full h-11" disabled={isLoading}>
            {isResettingPassword ? (
              <>
                <RotateCw className="mr-2 h-4 w-4" />
                {isLoading ? "Отправка..." : "Сбросить пароль"}
              </>
            ) : isRegistering ? (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                {isLoading ? "Вход..." : "Войти"}
              </>
            )}
          </Button>

          <div className="text-center space-y-2">
            {isResettingPassword ? (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal text-sm"
                onClick={() => toggleMode('login')}
              >
                Вспомнили пароль? Войти
              </Button>
            ) : isRegistering ? (
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto font-normal text-sm"
                onClick={() => toggleMode('login')}
              >
                Уже есть аккаунт? Войти
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-normal text-sm"
                  onClick={() => toggleMode('register')}
                >
                  Нет аккаунта? Зарегистрироваться
                </Button>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto font-normal text-sm block w-full"
                  onClick={() => toggleMode('reset')}
                >
                  Забыли пароль?
                </Button>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
