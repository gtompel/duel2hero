import { type NextRequest, NextResponse } from "next/server"
import {
  getPasswordResetToken,
  updateUserPassword,
  markTokenAsUsed,
  deleteExpiredTokens,
} from "@/services/authService"

// POST /api/auth/reset-password/confirm - подтверждение сброса пароля по токену
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token, newPassword } = body

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      )
    }

    // Удаляем просроченные токены
    await deleteExpiredTokens()

    // Получаем токен из базы данных
    const resetToken = await getPasswordResetToken(token)

    if (!resetToken) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      )
    }

    // Проверяем, не использован ли токен
    if (resetToken.used) {
      return NextResponse.json(
        { error: "This reset token has already been used" },
        { status: 400 }
      )
    }

    // Проверяем срок действия токена
    if (resetToken.expiresAt < new Date()) {
      return NextResponse.json(
        { error: "This reset token has expired" },
        { status: 400 }
      )
    }

    // Обновляем пароль пользователя
    await updateUserPassword(resetToken.userId, newPassword)

    // Помечаем токен как использованный
    await markTokenAsUsed(token)

    return NextResponse.json(
      { message: "Password has been successfully reset" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[API] Error confirming password reset:", error)
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    )
  }
}
