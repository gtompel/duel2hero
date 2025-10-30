"use client"

import { useState } from "react"
import { Plus, Pencil, Trash2, Award } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { testTypeSchema, type TestTypeFormData } from "@/lib/validation"
import type { TestType } from "@/lib/types"

interface TestTypesManagerProps {
  testTypes: TestType[]
  onSave: (data: TestTypeFormData, id?: string) => void
  onDelete: (id: string) => void
}

export function TestTypesManager({ testTypes, onSave, onDelete }: TestTypesManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<TestType | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TestTypeFormData>({
    resolver: zodResolver(testTypeSchema),
    defaultValues: {
      name: "",
      description: "",
      badge: "bronze",
    },
  })

  const openDialog = (type?: TestType) => {
    if (type) {
      setEditingType(type)
      reset({
        name: type.name,
        description: type.description,
        badge: type.badge,
      })
    } else {
      setEditingType(null)
      reset({
        name: "",
        description: "",
        badge: "bronze",
      })
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingType(null)
    reset()
  }

  const onSubmit = (data: TestTypeFormData) => {
    onSave(data, editingType?.id)
    closeDialog()
  }

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId)
      setDeleteId(null)
    }
  }

  const getBadgeVariant = (badge: string) => {
    switch (badge) {
      case "gold":
        return "default"
      case "silver":
        return "secondary"
      case "bronze":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Виды испытаний</CardTitle>
              <CardDescription>Управление типами знаков отличия ГТО</CardDescription>
            </div>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Добавить вид
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Знак</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.name}</TableCell>
                    <TableCell>{type.description}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(type.badge)}>
                        <Award className="mr-1 h-3 w-3" />
                        {type.badge === "gold" ? "Золото" : type.badge === "silver" ? "Серебро" : "Бронза"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={() => openDialog(type)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteId(type.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingType ? "Редактировать вид" : "Добавить вид"}</DialogTitle>
            <DialogDescription>Заполните информацию о виде испытания</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название</Label>
              <Input id="name" placeholder="Золотой знак" {...register("name")} />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Описание</Label>
              <Input id="description" placeholder="Высокий уровень подготовки" {...register("description")} />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="badge">Знак отличия</Label>
              <Select value={watch("badge")} onValueChange={(value) => setValue("badge", value as any)}>
                <SelectTrigger id="badge">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bronze">Бронза</SelectItem>
                  <SelectItem value="silver">Серебро</SelectItem>
                  <SelectItem value="gold">Золото</SelectItem>
                </SelectContent>
              </Select>
              {errors.badge && <p className="text-sm text-destructive">{errors.badge.message}</p>}
            </div>

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={closeDialog}>
                Отмена
              </Button>
              <Button type="submit">Сохранить</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить вид испытания?</AlertDialogTitle>
            <AlertDialogDescription>Это действие нельзя отменить.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
