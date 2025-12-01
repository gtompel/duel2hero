"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Plus, FileDown, Settings, LogOut, ArrowUpDown, Menu, Shield, Activity, Medal, Phone, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtocolForm } from "@/components/protocol-form"
import { ProtocolsList } from "@/components/protocols-list"
import { ProtocolView } from "@/components/protocol-view"
import { ProtocolsFilter, type FilterOptions } from "@/components/protocols-filter"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-provider"
import { getProtocols, createProtocol, updateProtocol, deleteProtocol } from "@/lib/storage"
import { exportProtocolsToCSV, exportSingleProtocolToCSV } from "@/lib/csv-export"
import { filterProtocols, sortProtocols } from "@/lib/filter-utils"
import type { Protocol } from "@/lib/types"
import type { ProtocolFormData } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Loader2 } from "lucide-react"

type ViewMode = "list" | "create" | "edit" | "view"
type SortBy = "date" | "testType" | "level"

function HomePageContent() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
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
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      loadProtocols()
    }
  }, [mounted, loadProtocols])
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

  const heroStats = [
    { value: "23 млн+", label: "участников", description: "уже участвуют в движении ГТО" },
    { value: "11 млн+", label: "знаков отличия", description: "оформлено по всей стране" },
    { value: "6-70", label: "лет", description: "охватывает возрастной диапазон нормативов" },
  ]

  const highlightCards = [
    {
      icon: Shield,
      title: "Национальный стандарт",
      text: "Комплекс испытаний под кураторством Министерства спорта РФ и ФДС",
    },
    {
      icon: Activity,
      title: "Сила и выносливость",
      text: "Спринт, выносливость, гимнастика и силовые дисциплины в единой системе",
    },
    {
      icon: Medal,
      title: "Золотой, серебряный, бронзовый",
      text: "Каждый участник стремится к знаку отличия и личному прогрессу",
    },
  ]

  const newsCards = [
    {
      date: "28.11.2025",
      title: "Комплекс ГТО – путь к здоровью и успеху",
      description: "Объявлены лауреаты Национальной спортивной премии 2025 года",
    },
    {
      date: "27.11.2025",
      title: "ГТО на Национальной спортивной премии",
      description: "Минспорт представит лучших наставников и участников комплекса",
    },
    {
      date: "17.11.2025",
      title: "Преимущества знака отличия",
      description: "Налоговые льготы, дополнительные баллы и стипендии для обладателей ГТО",
    },
  ]

  const benefitHighlights = [
    {
      title: "Налоговые льготы",
      description: "С 2025 года золотой знак даёт право на налоговый вычет и поощрения работодателей.",
    },
    {
      title: "Дополнительные баллы",
      description: "Вузы начисляют бонусы к ЕГЭ, а студенты получают повышенные стипендии за знак отличия.",
    },
    {
      title: "Инклюзивность",
      description: "Высокая доля участников с ОВЗ подчёркивает доступность комплекса для всех граждан.",
    },
  ]

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#050f24]/95 via-[#102852]/90 to-[#c7422f]/80 backdrop-blur supports-[backdrop-filter]:bg-background/70 shadow-lg">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="hidden sm:block text-[11px] uppercase tracking-[0.4em] text-white/60">
                Федеральная дирекция спортмероприятий
              </p>
              <h1 className="text-lg md:text-2xl font-semibold text-white">ГТО — узнай, на что ты способен</h1>
              <p className="text-xs md:text-sm text-white/70 truncate">
                {user?.username} ({user?.role === "admin" ? "Администратор" : "Пользователь"})
              </p>
            </div>

            <div className="hidden md:flex gap-2">
              {user?.role === "admin" && (
                <Button
                  variant="outline"
                  onClick={() => router.push("/admin")}
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Настройки
                </Button>
              )}
              <Button
                variant="outline"
                onClick={handleLogout}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Выход
              </Button>
            </div>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon" className="bg-white/15 border-white/20 text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 bg-[#050f24] text-white">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="space-y-1 pb-4 border-b border-white/15">
                    <p className="font-semibold">{user?.username}</p>
                    <p className="text-sm text-white/70">
                      {user?.role === "admin" ? "Администратор" : "Пользователь"}
                    </p>
                  </div>
                  {user?.role === "admin" && (
                    <Button
                      variant="outline"
                      onClick={() => router.push("/admin")}
                      className="justify-start bg-white/10 border-white/20 text-white"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Настройки
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="justify-start bg-transparent border-white/20 text-white"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Выход
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-6 md:py-12 space-y-8 md:space-y-10">
        {viewMode === "list" && (
          <div className="space-y-8 md:space-y-10">
            <section className="relative overflow-hidden rounded-[32px] p-6 md:p-10 text-white gto-hero">
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-center">
                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/70">готов к труду и обороне</p>
                    <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
                      Узнай, на что ты способен: выполни нормативы ГТО и получи знак отличия.
                    </h2>
                    <p className="text-base md:text-lg text-white/80 max-w-2xl">
                      Цифровая демо-платформа повторяет визуальный стиль gto.ru и показывает, как быстро занести
                      результаты, управлять справочниками и выгрузить отчёты.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="lg"
                      className="bg-white text-[#050f24] hover:bg-white/90 font-semibold px-8"
                      onClick={() => setViewMode("create")}
                    >
                      <Plus className="mr-2 h-5 w-5" />
                      Создать протокол
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10 px-8"
                      onClick={() => router.push("https://www.gto.ru/")}
                    >
                      Посмотреть нормативы
                    </Button>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                  {heroStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 text-center backdrop-blur">
                      <p className="text-2xl md:text-3xl font-semibold text-white">{stat.value}</p>
                      <p className="text-xs uppercase tracking-[0.3em] text-white/70">{stat.label}</p>
                      <p className="text-xs text-white/60 mt-2">{stat.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {highlightCards.map((card) => (
                <div key={card.title} className="gto-card rounded-2xl p-6 space-y-3">
                  <card.icon className="h-10 w-10 text-[var(--gto-gold)]" />
                  <p className="text-xl font-semibold text-white">{card.title}</p>
                  <p className="text-sm text-white/70">{card.text}</p>
                </div>
              ))}
            </section>

            <section className="grid gap-4 md:grid-cols-3">
              {benefitHighlights.map((benefit) => (
                <div key={benefit.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <div className="flex items-center gap-3 text-white">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">преимущество</p>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-white">{benefit.title}</p>
                  <p className="text-sm text-white/70">{benefit.description}</p>
                </div>
              ))}
            </section>

            <section className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">цифровые протоколы</p>
                  <h2 className="text-2xl font-semibold text-white">Все протоколы</h2>
                  {filteredAndSortedProtocols.length !== protocols.length && (
                    <p className="text-sm text-white/70">
                      {filteredAndSortedProtocols.length} из {protocols.length} записей после фильтрации
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none bg-white/5 border-white/15 text-white"
                      >
                        <ArrowUpDown className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Сортировка</span>
                        <span className="sm:hidden">Сорт.</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSortBy("date")}>По дате</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("testType")}>По виду испытания</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("level")}>По уровню</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {filteredAndSortedProtocols.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportProtocolsToCSV(filteredAndSortedProtocols)}
                      className="flex-1 sm:flex-none bg-white/5 border-white/15 text-white"
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
                    className="flex-1 sm:flex-none bg-[var(--gto-gold)] text-[#050f24]"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Создать протокол</span>
                    <span className="sm:hidden">Создать</span>
                  </Button>
                </div>
              </div>

              <ProtocolsFilter filters={filters} onFilterChange={setFilters} onReset={handleResetFilters} />

              <ProtocolsList
                protocols={filteredAndSortedProtocols}
                onView={handleViewProtocol}
                onEdit={handleEditClick}
                onDelete={handleDeleteProtocol}
              />
            </section>

            <section className="space-y-4">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/50">новости комплекса</p>
                  <h3 className="text-xl font-semibold text-white">Актуальные события</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/20 text-white hidden md:flex"
                  onClick={() => router.push("https://www.gto.ru/")}
                >
                  Перейти на gto.ru
                </Button>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {newsCards.map((news) => (
                  <div key={news.title} className="gto-card rounded-2xl p-6 space-y-3">
                    <p className="text-xs uppercase tracking-[0.4em] text-white/60">{news.date}</p>
                    <p className="text-lg font-semibold text-white">{news.title}</p>
                    <p className="text-sm text-white/70">{news.description}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-white/60">горячая линия</p>
                  <p className="text-2xl font-semibold text-white">8 800 222-22-51</p>
                  <p className="text-sm text-white/70">Круглосуточная поддержка участников комплекса ГТО</p>
                </div>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white bg-white/5 hover:bg-white/10"
                  asChild
                >
                  <a href="tel:88002222251">
                    <Phone className="mr-2 h-4 w-4" />
                    Позвонить
                  </a>
                </Button>
              </div>
            </section>
          </div>
        )}

        {viewMode === "create" && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-white">Создание протокола</h2>
            </div>
            <ProtocolForm onSubmit={handleCreateProtocol} onCancel={handleCancel} />
          </div>
        )}

        {viewMode === "edit" && selectedProtocol && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold text-white">Редактирование протокола</h2>
            </div>
            <ProtocolForm protocol={selectedProtocol} onSubmit={handleEditProtocol} onCancel={handleCancel} />
          </div>
        )}

        {viewMode === "view" && selectedProtocol && (
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-lg md:text-xl font-semibold text-white">Просмотр протокола</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportSingleProtocolToCSV(selectedProtocol)}
                  className="flex-1 sm:flex-none bg-white/5 border-white/15 text-white"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  Экспорт
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditClick(selectedProtocol)}
                  className="flex-1 sm:flex-none bg-white/5 border-white/15 text-white"
                >
                  Редактировать
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="flex-1 sm:flex-none bg-transparent border-white/15 text-white"
                >
                  Назад
                </Button>
              </div>
            </div>
            <ProtocolView protocol={selectedProtocol} />
          </div>
        )}
      </main>
    </div>
  )
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomePageContent />
    </ProtectedRoute>
  )
}
