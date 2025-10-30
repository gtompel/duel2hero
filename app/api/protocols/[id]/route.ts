import { type NextRequest, NextResponse } from "next/server"
import { protocolSchema } from "@/lib/validation"
import { getProtocol, updateProtocol, deleteProtocol, getCurrentUser } from "@/lib/storage"

// GET /api/protocols/[id] - получить один протокол
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const protocol = getProtocol(id)

    if (!protocol) {
      return NextResponse.json({ error: "Protocol not found" }, { status: 404 })
    }

    return NextResponse.json({ data: protocol })
  } catch (error) {
    console.error("[v0] Error fetching protocol:", error)
    return NextResponse.json({ error: "Failed to fetch protocol" }, { status: 500 })
  }
}

// PUT /api/protocols/[id] - обновить протокол
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Validate with Zod
    const validationResult = protocolSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json({ error: "Validation failed", details: validationResult.error.errors }, { status: 400 })
    }

    // Sanitize input
    const sanitizedData = {
      ...validationResult.data,
      testType: validationResult.data.testType.trim(),
      sportTitle: validationResult.data.sportTitle?.trim(),
    }

    // Update protocol
    const protocol = updateProtocol(id, sanitizedData)

    if (!protocol) {
      return NextResponse.json({ error: "Protocol not found" }, { status: 404 })
    }

    return NextResponse.json({ data: protocol })
  } catch (error) {
    console.error("[v0] Error updating protocol:", error)
    return NextResponse.json({ error: "Failed to update protocol" }, { status: 500 })
  }
}

// DELETE /api/protocols/[id] - удалить протокол
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const success = deleteProtocol(id)

    if (!success) {
      return NextResponse.json({ error: "Protocol not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Protocol deleted successfully" })
  } catch (error) {
    console.error("[v0] Error deleting protocol:", error)
    return NextResponse.json({ error: "Failed to delete protocol" }, { status: 500 })
  }
}
