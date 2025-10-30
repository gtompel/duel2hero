import { type NextRequest, NextResponse } from "next/server"
import { protocolSchema } from "@/lib/validation"
import { getProtocols, createProtocol, getCurrentUser } from "@/lib/storage"
import type { ProtocolFilters } from "@/lib/types"

// GET /api/protocols - получить список протоколов с фильтрацией и пагинацией
export async function GET(request: NextRequest) {
  try {
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

    let protocols = getProtocols()

    // Apply filters
    if (filters.testType) {
      protocols = protocols.filter((p) => p.testType === filters.testType)
    }
    if (filters.level) {
      protocols = protocols.filter((p) => p.level === filters.level)
    }
    if (filters.dateFrom) {
      protocols = protocols.filter((p) => {
        const protocolDate = new Date(p.dateYear, p.dateMonth - 1, p.dateDay)
        const fromDate = new Date(filters.dateFrom!.year, filters.dateFrom!.month - 1, filters.dateFrom!.day)
        return protocolDate >= fromDate
      })
    }
    if (filters.dateTo) {
      protocols = protocols.filter((p) => {
        const protocolDate = new Date(p.dateYear, p.dateMonth - 1, p.dateDay)
        const toDate = new Date(filters.dateTo!.year, filters.dateTo!.month - 1, filters.dateTo!.day)
        return protocolDate <= toDate
      })
    }

    // Pagination
    const page = filters.page || 1
    const limit = filters.limit || 10
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProtocols = protocols.slice(startIndex, endIndex)

    return NextResponse.json({
      data: paginatedProtocols,
      pagination: {
        page,
        limit,
        total: protocols.length,
        totalPages: Math.ceil(protocols.length / limit),
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching protocols:", error)
    return NextResponse.json({ error: "Failed to fetch protocols" }, { status: 500 })
  }
}

// POST /api/protocols - создать новый протокол
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

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
    const protocol = createProtocol(sanitizedData)

    return NextResponse.json({ data: protocol }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating protocol:", error)
    return NextResponse.json({ error: "Failed to create protocol" }, { status: 500 })
  }
}
