import { NextRequest, NextResponse } from "next/server"
import { authenticateUser } from "@/services/authService"

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

    return NextResponse.json({ data: user }, { status: 200 })
  } catch (error) {
    console.error("[API] Error authenticating user:", error)
    return NextResponse.json(
      { error: "Failed to authenticate user" },
      { status: 500 }
    )
  }
}
