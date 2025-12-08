import { NextRequest, NextResponse } from "next/server"
import { getUserById } from "@/services/authService"

// GET /api/auth/user/[id] - получение пользователя по ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    const user = await getUserById(id)

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: user }, { status: 200 })
  } catch (error) {
    console.error("[API] Error getting user:", error)
    return NextResponse.json(
      { error: "Failed to get user" },
      { status: 500 }
    )
  }
}
