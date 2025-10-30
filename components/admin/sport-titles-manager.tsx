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
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sportTitleSchema, type SportTitleFormData } from "@/lib/validation"
import type { SportTitle } from "@/lib/types"

interface SportTitlesManagerProps {
  sportTitles: SportTitle[]
  onSave: (data: SportTitleFormData, id?: string) => void
  onDelete: (id: string) => void
}

export function SportTitlesManager({ sportTitles, onSave, onDelete }: SportTitlesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingTitle, setEditingTitle] = useState<SportTitle | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SportTitleFormData>({
    resolver: zodResolver(sportTitleSchema),
  })

  const openDialog = (title?: SportTitle) => {
    if (title) {
      setEditingTitle(title)
      reset({ name: title.name })
    } else {
      setEditingTitle(null)
      reset()
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingTitle(null)
    reset()
  }

  const onSubmitForm = (data: SportTitleFormData) => {
    onSave(data, editingTitle?.id)
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

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-base md:text-lg">Спортивные звания</CardTitle>
              <CardDescription className="text-sm">Управление спортивными званиями и разрядами</CardDescription>
            </div>
            <Button onClick={() => openDialog()} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Добавить звание
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sportTitles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      Нет званий
                    </TableCell>
                  </TableRow>
                ) : (
                  sportTitles.map((title) => (
                    <TableRow key={title.id}>
                      <TableCell className="font-medium">{title.name}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDialog(title)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(title.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="md:hidden space-y-3">
            {sportTitles.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Нет званий</p>
            ) : (
              sportTitles.map((title) => (
                <Card key={title.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{title.name}</p>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openDialog(title)} className="h-9 w-9 p-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteDialog(title.id)}
                          className="h-9 w-9 p-0"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTitle ? "Редактировать звание" : "Добавить звание"}</DialogTitle>
            <DialogDescription>Заполните информацию о спортивном звании</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" placeholder="Мастер спорта" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
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
            <AlertDialogTitle>Удалить звание?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Звание будет удалено из системы.
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
