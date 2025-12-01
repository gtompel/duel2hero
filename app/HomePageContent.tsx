"use client"
import { useState, useEffect, useMemo, useCallback } from "react"
import { Plus, FileDown, Settings, LogOut, ArrowUpDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtocolForm } from "@/components/protocol-form"
import { ProtocolsList } from "@/components/protocols-list"
import { ProtocolView } from "@/components/protocol-view"
import { ProtocolsFilter, type FilterOptions } from "@/components/protocols-filter"
import { useAuth } from "@/components/auth/auth-provider"
import { getProtocols, createProtocol, updateProtocol, deleteProtocol } from "@/lib/storage"
import { exportProtocolsToCSV } from "@/lib/csv-export"
import { filterProtocols, sortProtocols } from "@/lib/filter-utils"
import type { Protocol } from "@/lib/types"
import type { ProtocolFormData } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type ViewMode = "list" | "create" | "edit" | "view"
type SortBy = "date" | "testType" | "level"

export function HomePageContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const [sortBy, setSortBy] = useState<SortBy>("date")
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    testType: "",
    level: "",
    dateFromDay: "",
    dateFromMonth: "",
    dateFromYear: "",
    dateToDay: "",
    dateToMonth: "",
    dateToYear: "",
  })

  const loadProtocols = useCallback(() => {
    setProtocols(getProtocols())
  }, [])

  useEffect(() => {
    loadProtocols()
  }, [loadProtocols])

  const filteredAndSortedProtocols = useMemo(() => {
    const filtered = filterProtocols(protocols, filters)
    return sortProtocols(filtered, sortBy)
  }, [protocols, filters, sortBy])

  const handleCreateProtocol = (data: ProtocolFormData) => {
    createProtocol(data)
    loadProtocols()
    setViewMode("list")
  }

  const handleEditProtocol = (data: ProtocolFormData) => {
    if (!selectedProtocol) return
    updateProtocol(selectedProtocol.id, data)
    loadProtocols()
    setViewMode("list")
    setSelectedProtocol(null)
  }

  const handleDeleteProtocol = (id: string) => {
    deleteProtocol(id)
    loadProtocols()
  }

  const handleViewProtocol = (protocol: Protocol) => {
    setSelectedProtocol(protocol)
    setViewMode("view")
  }

  const handleEditClick = (protocol: Protocol) => {
    setSelectedProtocol(protocol)
    setViewMode("edit")
  }

  const handleCancel = () => {
    setViewMode("list")
    setSelectedProtocol(null)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      testType: "",
      level: "",
      dateFromDay: "",
      dateFromMonth: "",
      dateFromYear: "",
      dateToDay: "",
      dateToMonth: "",
      dateToYear: "",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Протоколы ГТО</h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {user?.username} ({user?.role === "admin" ? "Админ" : "Пользователь"})
              </p>
            </div>
            <div className="hidden md:flex gap-2">
              {user?.role === "admin" && (
                <Button variant="outline" onClick={() => router.push("/admin")}>
                  <Settings className="mr-2 h-4 w-4" /> Настройки
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Выход
              </Button>
            </div>
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="space-y-1 pb-4 border-b">
                    <p className="font-semibold">{user?.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {user?.role === "admin" ? "Администратор" : "Пользователь"}
                    </p>
                  </div>
                  {user?.role === "admin" && (
                    <Button
                      variant="outline"
                      onClick={() => router.push("/admin")}
                      className="justify-start"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Настройки
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout} className="justify-start bg-transparent">
                    <LogOut className="mr-2 h-4 w-4" />
                    Выход
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {viewMode === "list" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg md:text-xl font-semibold">
                Все протоколы
                {filteredAndSortedProtocols.length !== protocols.length && (
                  <span className="text-muted-foreground ml-2 text-sm">
                    ({filteredAndSortedProtocols.length} из {protocols.length})
                  </span>
                )}
              </h2>
              <div className="flex flex-wrap gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                      <ArrowUpDown className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Сортировка</span>
                      <span className="sm:hidden">Сорт.</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSortBy("date")}>По дате</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("testType")}>
                      По виду испытания
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("level")}>По уровню</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {filteredAndSortedProtocols.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportProtocolsToCSV(filteredAndSortedProtocols)}
                    className="flex-1 sm:flex-none"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">
                      Экспорт {filteredAndSortedProtocols.length !== protocols.length ? "отфильтрованных" : "всех"}
                    </span>
                    <span className="sm:hidden">Экспорт</span>
                  </Button>
                )}
                <Button
                  onClick={() => setViewMode("create")}
                  size="sm"
                  className="flex-1 sm:flex-none"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Создать протокол</span>
                  <span className="sm:hidden">Создать</span>
                </Button>
              </div>
            </div>
            <ProtocolsFilter
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
            <ProtocolsList
              protocols={filteredAndSortedProtocols}
              onView={handleViewProtocol}
              onEdit={handleEditClick}
              onDelete={handleDeleteProtocol}
            />
          </div>
        )}
        {viewMode === "create" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">Создание протокола</h2>
            </div>
            <ProtocolForm onSubmit={handleCreateProtocol} onCancel={handleCancel} />
          </div>
        )}
        {viewMode === "edit" && selectedProtocol && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">Редактирование протокола</h2>
            </div>
            <ProtocolForm
              protocol={selectedProtocol}
              onSubmit={handleEditProtocol}
              onCancel={handleCancel}
            />
          </div>
        )}
        {viewMode === "view" && selectedProtocol && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">Просмотр протокола</h2>
            </div>
            <ProtocolView protocol={selectedProtocol} />
            <Button variant="outline" onClick={handleCancel}>
              Назад
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}