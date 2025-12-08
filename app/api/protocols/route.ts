import { type NextRequest, NextResponse } from "next/server"
import { protocolSchema } from "@/lib/validation"
import { getProtocols, createProtocol } from "@/services/protocolService"
import { authenticateUser } from "@/services/authService"
import type { ProtocolFilters } from "@/lib/types"
import { logUserAction } from "@/services/auditLogService"

// GET /api/protocols - получить список протоколов с фильтрацией и пагинацией
export async function GET(request: NextRequest) {
  try {
    // В реальной реализации здесь будет проверка токена из cookies
    // const token = request.cookies.get('authToken')?.value
    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    // 
    // let userId: string | null = null
    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    //   userId = (decoded as { userId: string }).userId
    // } catch (error) {
    //   return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    // }

    const searchParams = request.nextUrl.searchParams

    // Parse filters
    const filters: ProtocolFilters = {
      testType: searchParams.get("testType") || undefined,
      level: searchParams.get("level") || undefined,
      page: Number.parseInt(searchParams.get("page") || "1"),
      limit: Number.parseInt(searchParams.get("limit") || "10"),
    }

    // Parse date range
    if (searchParams.get("dateFromDay")) {
      filters.dateFrom = {
        day: Number.parseInt(searchParams.get("dateFromDay")!),
        month: Number.parseInt(searchParams.get("dateFromMonth")!),
        year: Number.parseInt(searchParams.get("dateFromYear")!),
      }
    }
    if (searchParams.get("dateToDay")) {
      filters.dateTo = {
        day: Number.parseInt(searchParams.get("dateToDay")!),
        month: Number.parseInt(searchParams.get("dateToMonth")!),
        year: Number.parseInt(searchParams.get("dateToYear")!),
      }
    }

    // Get protocols from database
    const result = await getProtocols(filters)

    // Логируем действие просмотра списка протоколов
    // if (userId) {
    //   await logUserAction(userId, "READ", "Protocol", "list")
    // }

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Error fetching protocols:", error)
    return NextResponse.json({ error: "Failed to fetch protocols" }, { status: 500 })
  }
}

// POST /api/protocols - создать новый протокол
export async function POST(request: NextRequest) {
  try {
    // В реальной реализации здесь будет проверка токена из cookies
    // const token = request.cookies.get('authToken')?.value
    // if (!token) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }
    // 
    // let userId: string | null = null
    // try {
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    //   userId = (decoded as { userId: string }).userId
    // } catch (error) {
    //   return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    // }

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

    // Create protocol
    const protocol = await createProtocol(sanitizedData)

    // Log action
    // if (userId) {
    //   await logUserAction(userId, "CREATE", "Protocol", protocol.id, JSON.stringify(sanitizedData))
    // }

    return NextResponse.json({ data: protocol }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating protocol:", error)
    return NextResponse.json({ error: "Failed to create protocol" }, { status: 500 })
  }
}
