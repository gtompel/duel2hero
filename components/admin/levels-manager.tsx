"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { levelSchema, type LevelFormData } from "@/lib/validation"
import type { Level } from "@/lib/types"

interface LevelsManagerProps {
  levels: Level[]
  onSave: (data: LevelFormData, id?: string) => void
  onDelete: (id: string) => void
}

export function LevelsManager({ levels, onSave, onDelete }: LevelsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingLevel, setEditingLevel] = useState<Level | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LevelFormData>({
    resolver: zodResolver(levelSchema),
  })

  const openDialog = (level?: Level) => {
    if (level) {
      setEditingLevel(level)
      setValue("name", level.name)
      setValue("code", level.code as any)
    } else {
      setEditingLevel(null)
      reset()
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingLevel(null)
    reset()
  }

  const onSubmitForm = (data: LevelFormData) => {
    onSave(data, editingLevel?.id)
    closeDialog()
  }

  const openDeleteDialog = (id: string) => {
    setDeletingId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (deletingId) {
      onDelete(deletingId)
      setIsDeleteDialogOpen(false)
      setDeletingId(null)
    }
  }

  const getLevelBadge = (code: string) => {
    const badges = {
      bronze: { label: "Бронза", class: "bg-amber-700 text-white" },
      silver: { label: "Серебро", class: "bg-gray-400 text-white" },
      gold: { label: "Золото", class: "bg-yellow-500 text-white" },
    }
    return badges[code as keyof typeof badges] || { label: code, class: "bg-muted" }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base md:text-lg">Уровни выполнения</CardTitle>
              <CardDescription className="text-sm">Управление уровнями выполнения нормативов</CardDescription>
            </div>
            <Button onClick={() => openDialog()} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Добавить уровень
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Код</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {levels.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      Нет уровней
                    </TableCell>
                  </TableRow>
                ) : (
                  levels.map((level) => {
                    const badge = getLevelBadge(level.code)
                    return (
                      <TableRow key={level.id}>
                        <TableCell className="font-medium">{level.name}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.class}`}
                          >
                            {badge.label}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openDialog(level)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(level.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {levels.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Нет уровней</p>
            ) : (
              levels.map((level) => {
                const badge = getLevelBadge(level.code)
                return (
                  <Card key={level.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{level.name}</p>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${badge.class}`}
                            >
                              {badge.label}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openDialog(level)} className="h-9 w-9 p-0">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDeleteDialog(level.id)}
                              className="h-9 w-9 p-0"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingLevel ? "Редактировать уровень" : "Добавить уровень"}</DialogTitle>
            <DialogDescription>Заполните информацию об уровне выполнения</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" placeholder="Бронзовый знак" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Код</Label>
              <Select value={watch("code")} onValueChange={(value) => setValue("code", value as any)}>
                <SelectTrigger id="code">
                  <SelectValue placeholder="Выберите код" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">bronze (Бронза)</SelectItem>
                  <SelectItem value="silver">silver (Серебро)</SelectItem>
                  <SelectItem value="gold">gold (Золото)</SelectItem>
                </SelectContent>
              </Select>
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить уровень?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Уровень будет удален из системы.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
