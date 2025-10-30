// CSV export functionality

import type { Protocol } from "./types"

export function exportProtocolsToCSV(protocols: Protocol[]): void {
  if (protocols.length === 0) {
    alert("Нет данных для экспорта")
    return
  }

  // Prepare CSV headers
  const headers = [
    "ID",
    "Вид испытания",
    "Дата (День)",
    "Дата (Месяц)",
    "Дата (Год)",
    "Полная дата",
    "Результат",
    "Уровень выполнения",
    "Спортивное звание",
    "Звание действует с",
    "Звание действует до",
    "Дата создания",
    "Дата обновления",
  ]

  // Prepare CSV rows
  const rows: string[][] = protocols.map((protocol) => {
    const fullDate = `${protocol.dateDay.toString().padStart(2, "0")}.${protocol.dateMonth.toString().padStart(2, "0")}.${protocol.dateYear}`

    return [
      protocol.id,
      protocol.testType,
      protocol.dateDay.toString(),
      protocol.dateMonth.toString(),
      protocol.dateYear.toString(),
      fullDate,
      protocol.resultValue.toString(),
      protocol.level,
      protocol.sportTitle || "",
      protocol.sportTitleFrom || "",
      protocol.sportTitleTo || "",
      new Date(protocol.createdAt).toLocaleString("ru-RU"),
      new Date(protocol.updatedAt).toLocaleString("ru-RU"),
    ]
  })

  // Convert to CSV string
  const csvContent = [headers.join(","), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(","))].join("\n")

  // Create and download file
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `gto-protocols-${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportSingleProtocolToCSV(protocol: Protocol): void {
  exportProtocolsToCSV([protocol])
}
