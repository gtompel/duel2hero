"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Protocol } from "@/lib/types"
import { getLevels } from "@/lib/storage"
import type { Level } from "@/lib/types"

interface ProtocolViewProps {
  protocol: Protocol
}

export function ProtocolView({ protocol }: ProtocolViewProps) {
  const [levels, setLevels] = useState<Level[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLevels(getLevels())
  }, [])

  // Форматирование даты одинаково на сервере и клиенте
  const formattedDate = `${protocol.dateDay.toString().padStart(2, "0")}.${protocol.dateMonth.toString().padStart(2, "0")}.${protocol.dateYear}`
  
  // Форматирование даты создания протокола
  const formatDateTime = (dateString: string) => {
    if (!mounted) return dateString
    const date = new Date(dateString)
    return date.toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatDate = (dateString: string) => {
    if (!mounted) return dateString
    const date = new Date(dateString)
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const levelName = levels.find((l) => l.code === protocol.level)?.name || protocol.level

  const getLevelBadge = (code: string) => {
    const badges = {
      bronze: { label: "Бронза", class: "bg-amber-700 text-white" },
      silver: { label: "Серебро", class: "bg-gray-400 text-white" },
      gold: { label: "Золото", class: "bg-yellow-500 text-white" },
    }
    return badges[code as keyof typeof badges] || { label: code, class: "bg-muted" }
  }

  const badge = getLevelBadge(protocol.level)

  return (
    <div className="space-y-6">
      <Card className="gto-card border border-white/10">
        <CardHeader>
          <CardTitle className="text-base md:text-lg text-white">Информация о протоколе</CardTitle>
          <CardDescription className="text-sm text-white/70">
            Создан: {formatDateTime(protocol.createdAt)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-sm text-white/60">Вид испытания</p>
              <p className="font-medium text-white">{protocol.testType}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Дата выполнения</p>
              <p className="font-medium text-white">{formattedDate}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Результат</p>
              <p className="font-medium text-white">{protocol.resultValue}</p>
            </div>
            <div>
              <p className="text-sm text-white/60">Уровень выполнения</p>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.class}`}
              >
                {levelName}
              </span>
            </div>
            {protocol.sportTitle && (
              <>
                <div>
                  <p className="text-sm text-white/60">Спортивное звание</p>
                  <p className="font-medium text-white">{protocol.sportTitle}</p>
                </div>
                <div className="sm:col-span-2 lg:col-span-1">
                  <p className="text-sm text-white/60">Срок действия</p>
                  <p className="font-medium text-white">
                    {protocol.sportTitleFrom && protocol.sportTitleTo
                      ? `${formatDate(protocol.sportTitleFrom)} - ${formatDate(protocol.sportTitleTo)}`
                      : "Не указан"}
                  </p>
                </div>
              </>
            )}
          </div>
          
          {protocol.imageUrl && (
            <div className="space-y-2">
              <p className="text-sm text-white/60">Изображение протокола</p>
              <div className="relative rounded-lg overflow-hidden border border-white/10 aspect-auto">
                <Image
                  src={protocol.imageUrl}
                  alt="Изображение протокола"
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-96 object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
