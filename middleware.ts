import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Список защищенных путей
const protectedPaths = [
  '/admin',
  '/api/protocols',
  '/api/test-types',
  '/api/levels',
  '/api/sport-titles',
  '/api/text-mappings',
]

// Список публичных путей
const publicPaths = [
  '/login',
  '/api/auth',
]

// Секрет для проверки JWT токенов
const JWT_SECRET = "gto_jwt_secret_key"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Проверяем, является ли путь публичным
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))
  
  // Проверяем, является ли путь защищенным
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  // Если это публичный путь, пропускаем проверку
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Если это защищенный путь, проверяем аутентификацию
  if (isProtectedPath) {
    // Проверяем наличие токена в cookies
    const token = request.cookies.get('authToken')
    
    if (!token) {
      // Перенаправляем на страницу входа
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    
    // Проверка валидности токена
    try {
      jwt.verify(token.value, JWT_SECRET)
      // Токен валиден, продолжаем выполнение
    } catch (error) {
      // Токен недействителен, перенаправляем на страницу входа
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

// Настройка путей, к которым применяется middleware
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/protocols/:path*',
    '/api/test-types/:path*',
    '/api/levels/:path*',
    '/api/sport-titles/:path*',
    '/api/text-mappings/:path*',
  ],
}