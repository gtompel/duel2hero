import { type NextRequest, NextResponse } from "next/server"
import { getUserByUsername, createPasswordResetToken, deleteExpiredTokens } from "@/services/authService"

// POST /api/auth/reset-password - запрос на сброс пароля
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username } = body

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Удаляем просроченные токены
    await deleteExpiredTokens()

    // Проверяем, существует ли пользователь с таким именем
    const user = await getUserByUsername(username)
    
    // В целях безопасности не раскрываем, существует ли пользователь
    // Всегда возвращаем успешный результат
    if (!user) {
      return NextResponse.json(
        { message: "If user exists, password reset instructions have been sent" },
        { status: 200 }
      )
    }

    // Генерируем токен сброса пароля
    const resetToken = await createPasswordResetToken(user.id)

    // В реальной реализации здесь будет отправка email с токеном
    // Для демонстрации возвращаем токен в ответе
    // В production токен должен отправляться только по email!
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    
    // TODO: Отправить email с resetUrl
    // await sendPasswordResetEmail(user.username, resetUrl)

    // Для безопасности в production не возвращаем токен
    // Но для демо/разработки можем вернуть его для удобства тестирования
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        {
          message: "Password reset instructions have been sent",
          // Только для разработки!
          token: resetToken,
          resetUrl,
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { message: "If user exists, password reset instructions have been sent" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[API] Error resetting password:", error)
    return NextResponse.json({ error: "Failed to reset password" }, { status: 500 })
  }
}