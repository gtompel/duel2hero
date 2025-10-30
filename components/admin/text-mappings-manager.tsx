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
import { textToNumberMappingSchema, type TextToNumberMappingFormData } from "@/lib/validation"
import type { TextToNumberMapping } from "@/lib/types"
import { getTestTypes } from "@/lib/storage"

interface TextMappingsManagerProps {
  mappings: TextToNumberMapping[]
  onSave: (data: TextToNumberMappingFormData, id?: string) => void
  onDelete: (id: string) => void
}

export function TextMappingsManager({ mappings, onSave, onDelete }: TextMappingsManagerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [editingMapping, setEditingMapping] = useState<TextToNumberMapping | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const testTypes = getTestTypes()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TextToNumberMappingFormData>({
    resolver: zodResolver(textToNumberMappingSchema),
  })

  const openDialog = (mapping?: TextToNumberMapping) => {
    if (mapping) {
      setEditingMapping(mapping)
      setValue("textValue", mapping.textValue)
      setValue("numberValue", mapping.numberValue)
      setValue("testType", mapping.testType)
    } else {
      setEditingMapping(null)
      reset()
    }
    setIsDialogOpen(true)
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setEditingMapping(null)
    reset()
  }

  const onSubmitForm = (data: TextToNumberMappingFormData) => {
    onSave(data, editingMapping?.id)
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
              <CardTitle className="text-base md:text-lg">Маппинг текст → число</CardTitle>
              <CardDescription className="text-sm">
                Преобразование текстовых результатов в числовые значения
              </CardDescription>
            </div>
            <Button onClick={() => openDialog()} size="sm" className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Добавить маппинг
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Текстовое значение</TableHead>
                  <TableHead>Числовое значение</TableHead>
                  <TableHead>Вид испытания</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mappings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Нет маппингов
                    </TableCell>
                  </TableRow>
                ) : (
                  mappings.map((mapping) => (
                    <TableRow key={mapping.id}>
                      <TableCell className="font-medium">{mapping.textValue}</TableCell>
                      <TableCell>{mapping.numberValue}</TableCell>
                      <TableCell>{mapping.testType}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDialog(mapping)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(mapping.id)}>
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
            {mappings.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Нет маппингов</p>
            ) : (
              mappings.map((mapping) => (
                <Card key={mapping.id}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <p className="font-medium">
                            {mapping.textValue} → {mapping.numberValue}
                          </p>
                          <p className="text-sm text-muted-foreground">{mapping.testType}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={() => openDialog(mapping)} className="h-9 w-9 p-0">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDeleteDialog(mapping.id)}
                            className="h-9 w-9 p-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
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
            <DialogTitle>{editingMapping ? "Редактировать маппинг" : "Добавить маппинг"}</DialogTitle>
            <DialogDescription>Настройте преобразование текста в число</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="textValue">Текстовое значение</Label>
              <Input id="textValue" placeholder="отлично" {...register("textValue")} />
              {errors.textValue && <p className="text-sm text-destructive">{errors.textValue.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberValue">Числовое значение</Label>
              <Input
                id="numberValue"
                type="number"
                step="0.01"
                placeholder="5"
                {...register("numberValue", { valueAsNumber: true })}
              />
              {errors.numberValue && <p className="text-sm text-destructive">{errors.numberValue.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="testType">Вид испытания</Label>
              <Select value={watch("testType")} onValueChange={(value) => setValue("testType", value)}>
                <SelectTrigger id="testType">
                  <SelectValue placeholder="Выберите вид" />
                </SelectTrigger>
                <SelectContent>
                  {testTypes.map((type) => (
                    <SelectItem key={type.id} value={type.name}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.testType && <p className="text-sm text-destructive">{errors.testType.message}</p>}
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
            <AlertDialogTitle>Удалить маппинг?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Маппинг будет удален из системы.
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
