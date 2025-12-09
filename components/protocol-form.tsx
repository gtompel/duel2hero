"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { protocolSchema, type ProtocolFormData } from "@/lib/validation"
import { getTestTypes, getLevels, getSportTitles, convertTextToNumber } from "@/lib/storage"
import type { Protocol } from "@/lib/types"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const ImageUpload = dynamic(() => import("@/components/image-upload").then(m => m.ImageUpload), {
  ssr: false,
})

interface ProtocolFormProps {
  protocol?: Protocol
  onSubmit: (data: ProtocolFormData) => void
  onCancel?: () => void
}

export function ProtocolForm({ protocol, onSubmit, onCancel }: ProtocolFormProps) {
  const [testTypes, setTestTypes] = useState(getTestTypes())
  const [levels, setLevels] = useState(getLevels())
  const [sportTitles, setSportTitles] = useState(getSportTitles())
  const [resultInput, setResultInput] = useState("")
  const [imageUrl, setImageUrl] = useState(protocol?.imageUrl || "")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Перезагружаем данные после монтирования для актуальности
    setTestTypes(getTestTypes())
    setLevels(getLevels())
    setSportTitles(getSportTitles())
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProtocolFormData>({
    resolver: zodResolver(protocolSchema),
    defaultValues: protocol
      ? {
          testType: protocol.testType,
          dateDay: protocol.dateDay,
          dateMonth: protocol.dateMonth,
          dateYear: protocol.dateYear,
          resultValue: protocol.resultValue,
          level: protocol.level as "bronze" | "silver" | "gold",
          sportTitle: protocol.sportTitle,
          sportTitleFrom: protocol.sportTitleFrom,
          sportTitleTo: protocol.sportTitleTo,
        }
      : {
          testType: "",
          dateDay: new Date().getDate(),
          dateMonth: new Date().getMonth() + 1,
          dateYear: new Date().getFullYear(),
          resultValue: 0,
          level: "bronze",
          sportTitle: "",
          sportTitleFrom: "",
          sportTitleTo: "",
        },
  })

  const handleResultChange = (value: string) => {
    setResultInput(value)
    const numValue = Number.parseFloat(value)
    if (!Number.isNaN(numValue)) {
      setValue("resultValue", numValue)
    } else {
      // Try to convert text to number using mapping
      const testType = watch("testType")
      const converted = convertTextToNumber(value, testType)
      if (converted !== null) {
        setValue("resultValue", converted)
      }
    }
  }

  const handleImageProcessed = (data: Partial<ProtocolFormData>) => {
    // Обновляем поля формы данными, извлеченными из изображения
    if (data.testType) setValue("testType", data.testType)
    if (data.dateDay) setValue("dateDay", data.dateDay)
    if (data.dateMonth) setValue("dateMonth", data.dateMonth)
    if (data.dateYear) setValue("dateYear", data.dateYear)
    if (data.resultValue) setValue("resultValue", data.resultValue)
    if (data.level) setValue("level", data.level as any)
    if (data.sportTitle) setValue("sportTitle", data.sportTitle)
    if (data.sportTitleFrom) setValue("sportTitleFrom", data.sportTitleFrom)
    if (data.sportTitleTo) setValue("sportTitleTo", data.sportTitleTo)
  }

  const handleImageUpload = (url: string) => {
    // Сохраняем URL изображения
    setImageUrl(url)
    setValue("imageUrl", url)
  }

  // Generate day options (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
  // Generate month options (1-12)
  const monthOptions = [
    { value: 1, label: "Январь" },
    { value: 2, label: "Февраль" },
    { value: 3, label: "Март" },
    { value: 4, label: "Апрель" },
    { value: 5, label: "Май" },
    { value: 6, label: "Июнь" },
    { value: 7, label: "Июль" },
    { value: 8, label: "Август" },
    { value: 9, label: "Сентябрь" },
    { value: 10, label: "Октябрь" },
    { value: 11, label: "Ноябрь" },
    { value: 12, label: "Декабрь" },
  ]
  // Generate year options (current year ± 5 years)
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <Card className="gto-card border border-white/10">
        <CardHeader>
          <CardTitle className="text-base md:text-lg text-white">Информация о протоколе</CardTitle>
          <CardDescription className="text-sm text-white/70">Заполните данные о выполнении норматива ГТО</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload onImageProcessed={handleImageProcessed} onImageUpload={handleImageUpload} />
          
          <div className="space-y-2">
            <Label htmlFor="testType" className="text-sm text-white/80">
              Вид испытания <span className="text-destructive">*</span>
            </Label>
            <Select value={watch("testType")} onValueChange={(value) => setValue("testType", value)}>
              <SelectTrigger id="testType" className="h-11 bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Выберите вид испытания" />
              </SelectTrigger>
              <SelectContent className="bg-[#0b1b3a] text-white border border-white/10">
                {testTypes.map((type) => (
                  <SelectItem key={type.id} value={type.name}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.testType && <p className="text-sm text-destructive">{errors.testType.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-sm text-white/80">
              Дата выполнения <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="space-y-2">
                <Select
                  value={watch("dateDay")?.toString()}
                  onValueChange={(value) => setValue("dateDay", Number.parseInt(value))}
                >
                  <SelectTrigger className="h-11 bg-white/5 border-white/15 text-white">
                    <SelectValue placeholder="День" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b1b3a] text-white border border-white/10">
                    {dayOptions.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dateDay && <p className="text-xs text-destructive">{errors.dateDay.message}</p>}
              </div>

              <div className="space-y-2">
                <Select
                  value={watch("dateMonth")?.toString()}
                  onValueChange={(value) => setValue("dateMonth", Number.parseInt(value))}
                >
                  <SelectTrigger className="h-11 bg-white/5 border-white/15 text-white">
                    <SelectValue placeholder="Месяц" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b1b3a] text-white border border-white/10">
                    {monthOptions.map((month) => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dateMonth && <p className="text-xs text-destructive">{errors.dateMonth.message}</p>}
              </div>

              <div className="space-y-2">
                <Select
                  value={watch("dateYear")?.toString()}
                  onValueChange={(value) => setValue("dateYear", Number.parseInt(value))}
                >
                  <SelectTrigger className="h-11 bg-white/5 border-white/15 text-white">
                    <SelectValue placeholder="Год" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0b1b3a] text-white border border-white/10">
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.dateYear && <p className="text-xs text-destructive">{errors.dateYear.message}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultValue" className="text-sm text-white/80">
              Результат выполнения <span className="text-destructive">*</span>
            </Label>
            <Input
              id="resultValue"
              type="text"
              placeholder="Введите числовое значение или текст (например: 12.5 или 'отлично')"
              value={resultInput ?? watch("resultValue")?.toString() ?? ""}
              onChange={(e) => handleResultChange(e.target.value)}
              className="h-11 bg-white/5 border-white/15 text-white placeholder:text-white/40"
            />
            <p className="text-xs text-white/60">
              Можно ввести число или текст (будет преобразовано по настроенному маппингу)
            </p>
            {errors.resultValue && <p className="text-sm text-destructive">{errors.resultValue.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-sm text-white/80">
              Уровень выполнения <span className="text-destructive">*</span>
            </Label>
            <Select value={watch("level")} onValueChange={(value) => setValue("level", value as any)}>
              <SelectTrigger id="level" className="h-11 bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Выберите уровень" />
              </SelectTrigger>
              <SelectContent className="bg-[#0b1b3a] text-white border border-white/10">
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.code}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.level && <p className="text-sm text-destructive">{errors.level.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="sportTitle" className="text-sm text-white/80">
              Спортивное звание/разряд (опционально)
            </Label>
            <Select value={watch("sportTitle") || ""} onValueChange={(value) => setValue("sportTitle", value)}>
              <SelectTrigger id="sportTitle" className="h-11 bg-white/5 border-white/15 text-white">
                <SelectValue placeholder="Не указано" />
              </SelectTrigger>
              <SelectContent className="bg-[#0b1b3a] text-white border border-white/10">
                {sportTitles.map((title) => (
                  <SelectItem key={title.id} value={title.name}>
                    {title.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.sportTitle && <p className="text-sm text-destructive">{errors.sportTitle.message}</p>}
          </div>

          {watch("sportTitle") && watch("sportTitle") !== "" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sportTitleFrom" className="text-sm text-white/80">
                  Срок действия с <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sportTitleFrom"
                  type="date"
                  {...register("sportTitleFrom")}
                  className="h-11 bg-white/5 border-white/15 text-white"
                />
                {errors.sportTitleFrom && <p className="text-sm text-destructive">{errors.sportTitleFrom.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sportTitleTo" className="text-sm text-white/80">
                  Срок действия до <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="sportTitleTo"
                  type="date"
                  {...register("sportTitleTo")}
                  className="h-11 bg-white/5 border-white/15 text-white"
                />
                {errors.sportTitleTo && <p className="text-sm text-destructive">{errors.sportTitleTo.message}</p>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3 sm:justify-end sticky bottom-0 bg-background/80 py-3 border-t border-white/10 sm:border-0 sm:static -mx-3 px-3 sm:mx-0 sm:px-0 backdrop-blur">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="w-full sm:w-auto order-2 sm:order-1 bg-transparent border-white/20 text-white"
          >
            Отмена
          </Button>
        )}
        <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2 bg-(--gto-gold) text-[#050f24] hover:bg-(--gto-gold-light)">
          <Save className="mr-2 h-4 w-4" />
          Сохранить протокол
        </Button>
      </div>
    </form>
  )
}
