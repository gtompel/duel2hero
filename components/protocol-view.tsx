"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Protocol } from "@/lib/types"
import { getLevels } from "@/lib/storage"

interface ProtocolViewProps {
  protocol: Protocol
}

export function ProtocolView({ protocol }: ProtocolViewProps) {
  const levels = getLevels()

  const formattedDate = `${protocol.dateDay.toString().padStart(2, "0")}.${protocol.dateMonth.toString().padStart(2, "0")}.${protocol.dateYear}`

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
            Создан: {new Date(protocol.createdAt).toLocaleString("ru-RU")}
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
                      ? `${new Date(protocol.sportTitleFrom).toLocaleDateString("ru-RU")} - ${new Date(protocol.sportTitleTo).toLocaleDateString("ru-RU")}`
                      : "Не указан"}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
