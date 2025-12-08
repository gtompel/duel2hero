import { type NextRequest, NextResponse } from "next/server"
import { createUser, userExists } from "@/services/authService"
import { Prisma } from "@prisma/client"

// POST /api/auth/register - регистрация нового пользователя
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    // Проверяем, существует ли пользователь с таким именем
    const exists = await userExists(username)
    if (exists) {
      return NextResponse.json({ error: "User with this username already exists" }, { status: 409 })
    }

    // Создаем нового пользователя
    const user = await createUser(username, password, "user")

    return NextResponse.json({ data: user }, { status: 201 })
  } catch (error) {
    console.error("[API] Error registering user:", error)
    
    // Обработка ошибки уникального ограничения Prisma (на случай race condition)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "User with this username already exists" },
        { status: 409 }
      )
    }
    
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 })
  }
}