"use client"

import { useState } from "react"
import { FileText, Eye, Pencil, Trash2, Download, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Protocol } from "@/lib/types"
import { exportSingleProtocolToCSV } from "@/lib/csv-export"
import { getLevels } from "@/lib/storage"

interface ProtocolsListProps {
  protocols: Protocol[]
  onView: (protocol: Protocol) => void
  onEdit: (protocol: Protocol) => void
  onDelete: (id: string) => void
}

export function ProtocolsList({ protocols, onView, onEdit, onDelete }: ProtocolsListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const levels = getLevels()

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const formatDate = (protocol: Protocol) => {
    return `${protocol.dateDay.toString().padStart(2, "0")}.${protocol.dateMonth.toString().padStart(2, "0")}.${protocol.dateYear}`
  }

  const getLevelBadge = (code: string) => {
    const badges = {
      bronze: { label: "Бронза", class: "bg-amber-700 text-white" },
      silver: { label: "Серебро", class: "bg-gray-400 text-white" },
      gold: { label: "Золото", class: "bg-yellow-500 text-white" },
    }
    return badges[code as keyof typeof badges] || { label: code, class: "bg-muted" }
  }

  if (protocols.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-4" />
          <h3 className="text-base md:text-lg font-semibold mb-2">Нет протоколов</h3>
          <p className="text-sm text-muted-foreground text-center">Создайте первый протокол для начала работы</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base md:text-lg">Список протоколов</CardTitle>
          <CardDescription className="text-sm">Всего протоколов: {protocols.length}</CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {/* Desktop table view */}
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Дата</TableHead>
                  <TableHead>Вид испытания</TableHead>
                  <TableHead>Результат</TableHead>
                  <TableHead>Уровень</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {protocols.map((protocol) => {
                  const badge = getLevelBadge(protocol.level)
                  return (
                    <TableRow key={protocol.id}>
                      <TableCell className="font-medium">{formatDate(protocol)}</TableCell>
                      <TableCell>{protocol.testType}</TableCell>
                      <TableCell>{protocol.resultValue}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.class}`}
                        >
                          {badge.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="ghost" size="sm" onClick={() => onView(protocol)} title="Просмотр">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => onEdit(protocol)} title="Редактировать">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => exportSingleProtocolToCSV(protocol)}
                            title="Экспорт в CSV"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setDeleteId(protocol.id)} title="Удалить">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile card view */}
          <div className="md:hidden space-y-3 p-3">
            {protocols.map((protocol) => {
              const badge = getLevelBadge(protocol.level)
              return (
                <Card key={protocol.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm mb-1">{formatDate(protocol)}</p>
                        <p className="text-sm text-muted-foreground truncate">{protocol.testType}</p>
                      </div>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${badge.class}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground mb-3">Результат: {protocol.resultValue}</p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onView(protocol)} className="flex-1">
                        <Eye className="mr-2 h-4 w-4" />
                        Просмотр
                      </Button>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="px-3 bg-transparent">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(protocol)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => exportSingleProtocolToCSV(protocol)}>
                            <Download className="mr-2 h-4 w-4" />
                            Экспорт
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeleteId(protocol.id)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent className="max-w-[90vw] sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить протокол?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Протокол будет удален безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
