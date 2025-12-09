import { NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/services/authService"
import jwt from 'jsonwebtoken'

// POST /api/auth/login - аутентификация пользователя
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const user = await authenticateUser(username, password)
    
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Генерируем JWT токен
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      "gto_jwt_secret_key",
      { expiresIn: '24h' }
    )

    // Устанавливаем токен в cookies
    const response = NextResponse.json(
      { data: user },
      { status: 200 }
    )
    
    response.cookies.set('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 часа
      path: '/',
    })

    return response
  } catch (error) {
    console.error("[API] Error authenticating user:", error)
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    )
  }
}
