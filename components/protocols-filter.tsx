"use client"

import { useState } from "react"
import { Search, X, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getTestTypes, getLevels } from "@/lib/storage"

export interface FilterOptions {
  searchQuery: string
  testType: string
  level: string
  dateFromDay: string
  dateFromMonth: string
  dateFromYear: string
  dateToDay: string
  dateToMonth: string
  dateToYear: string
}

interface ProtocolsFilterProps {
  filters: FilterOptions
  onFilterChange: (filters: FilterOptions) => void
  onReset: () => void
}

export function ProtocolsFilter({ filters, onFilterChange, onReset }: ProtocolsFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const testTypes = getTestTypes()
  const levels = getLevels()

  const handleChange = (key: keyof FilterOptions, value: string) => {
    onFilterChange({ ...filters, [key]: value })
  }

  const hasActiveFilters =
    filters.searchQuery ||
    filters.testType ||
    filters.level ||
    filters.dateFromDay ||
    filters.dateFromMonth ||
    filters.dateFromYear ||
    filters.dateToDay ||
    filters.dateToMonth ||
    filters.dateToYear

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)
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
  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i)

  return (
    <Card>
      <CardContent className="pt-4 md:pt-6">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                value={filters.searchQuery}
                onChange={(e) => handleChange("searchQuery", e.target.value)}
                className="pl-9 h-11"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)} className="flex-1 sm:flex-none h-11">
                <Filter className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{isExpanded ? "Скрыть фильтры" : "Показать фильтры"}</span>
                <span className="sm:hidden">{isExpanded ? "Скрыть" : "Фильтры"}</span>
              </Button>
              {hasActiveFilters && (
                <Button variant="ghost" onClick={onReset} className="h-11">
                  <X className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Сбросить</span>
                </Button>
              )}
            </div>
          </div>

          {isExpanded && (
            <div className="grid gap-4 sm:grid-cols-2 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="testType" className="text-sm">
                  Вид испытания
                </Label>
                <Select value={filters.testType} onValueChange={(value) => handleChange("testType", value)}>
                  <SelectTrigger id="testType" className="h-11">
                    <SelectValue placeholder="Все виды" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все виды</SelectItem>
                    {testTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level" className="text-sm">
                  Уровень выполнения
                </Label>
                <Select value={filters.level} onValueChange={(value) => handleChange("level", value)}>
                  <SelectTrigger id="level" className="h-11">
                    <SelectValue placeholder="Все уровни" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.code}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm">Дата от</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={filters.dateFromDay || "0"} // Updated default value to be non-empty
                    onValueChange={(value) => handleChange("dateFromDay", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="День" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Любой</SelectItem>
                      {dayOptions.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.dateFromMonth || "0"} // Updated default value to be non-empty
                    onValueChange={(value) => handleChange("dateFromMonth", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Месяц" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Любой</SelectItem>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.dateFromYear || "0"} // Updated default value to be non-empty
                    onValueChange={(value) => handleChange("dateFromYear", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Год" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Любой</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label className="text-sm">Дата до</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={filters.dateToDay || "0"} // Updated default value to be non-empty
                    onValueChange={(value) => handleChange("dateToDay", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="День" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Любой</SelectItem>
                      {dayOptions.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.dateToMonth || "0"} // Updated default value to be non-empty
                    onValueChange={(value) => handleChange("dateToMonth", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Месяц" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Любой</SelectItem>
                      {monthOptions.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.dateToYear || "0"} // Updated default value to be non-empty
                    onValueChange={(value) => handleChange("dateToYear", value)}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Год" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Любой</SelectItem>
                      {yearOptions.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
