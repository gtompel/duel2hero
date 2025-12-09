import { type NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from "uuid"
import { extractTextFromImage, parseProtocolText } from "@/services/imageProcessingService"

// POST /api/protocols/image - загрузка изображения протокола и извлечение данных
export async function POST(request: NextRequest) {
  try {
    // Получаем данные формы
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Файл не найден" }, { status: 400 })
    }

    // Генерируем уникальное имя файла
    const fileId = uuidv4()
    const fileExtension = file.name.split(".").pop()
    const fileName = `${fileId}.${fileExtension}`
    
    // Определяем путь для сохранения файла
    const filePath = join(process.cwd(), "public", "uploads", fileName)
    
    // Создаем директорию, если она не существует
    const fs = await import("fs")
    const path = await import("path")
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    
    // Сохраняем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)
    
    // Возвращаем URL файла
    const fileUrl = `/uploads/${fileName}`
    
    // Извлекаем текст из изображения
    const fullImageUrl = `${request.nextUrl.origin}${fileUrl}`
    const extractedText = await extractTextFromImage(fullImageUrl)
    
    // Парсим извлеченный текст для получения данных протокола
    const protocolData = parseProtocolText(extractedText)
    
    return NextResponse.json({
      url: fileUrl,
      text: extractedText,
      data: protocolData
    })
  } catch (error) {
    console.error("[v0] Error processing image:", error)
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 })
  }
}