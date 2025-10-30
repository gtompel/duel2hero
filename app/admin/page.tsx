"use client"

import { useState, useEffect } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { TestTypesManager } from "@/components/admin/test-types-manager"
import { LevelsManager } from "@/components/admin/levels-manager"
import { SportTitlesManager } from "@/components/admin/sport-titles-manager"
import { TextMappingsManager } from "@/components/admin/text-mappings-manager"
import {
  getTestTypes,
  saveTestType,
  deleteTestType,
  getLevels,
  saveLevel,
  deleteLevel,
  getSportTitles,
  saveSportTitle,
  deleteSportTitle,
  getTextMappings,
  saveTextMapping,
  deleteTextMapping,
} from "@/lib/storage"
import type { TestType, Level, SportTitle, TextToNumberMapping } from "@/lib/types"
import type { TestTypeFormData, LevelFormData, SportTitleFormData, TextToNumberMappingFormData } from "@/lib/validation"
import { useRouter } from "next/navigation"

function AdminPageContent() {
  const router = useRouter()
  const [testTypes, setTestTypes] = useState<TestType[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [sportTitles, setSportTitles] = useState<SportTitle[]>([])
  const [textMappings, setTextMappings] = useState<TextToNumberMapping[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setTestTypes(getTestTypes())
    setLevels(getLevels())
    setSportTitles(getSportTitles())
    setTextMappings(getTextMappings())
  }

  const handleSaveTestType = (data: TestTypeFormData, id?: string) => {
    const type: TestType = {
      id: id || crypto.randomUUID(),
      ...data,
      createdAt: id
        ? testTypes.find((t) => t.id === id)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    }
    saveTestType(type)
    loadData()
  }

  const handleDeleteTestType = (id: string) => {
    deleteTestType(id)
    loadData()
  }

  const handleSaveLevel = (data: LevelFormData, id?: string) => {
    const level: Level = {
      id: id || crypto.randomUUID(),
      ...data,
      createdAt: id ? levels.find((l) => l.id === id)?.createdAt || new Date().toISOString() : new Date().toISOString(),
    }
    saveLevel(level)
    loadData()
  }

  const handleDeleteLevel = (id: string) => {
    deleteLevel(id)
    loadData()
  }

  const handleSaveSportTitle = (data: SportTitleFormData, id?: string) => {
    const title: SportTitle = {
      id: id || crypto.randomUUID(),
      ...data,
      createdAt: id
        ? sportTitles.find((t) => t.id === id)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    }
    saveSportTitle(title)
    loadData()
  }

  const handleDeleteSportTitle = (id: string) => {
    deleteSportTitle(id)
    loadData()
  }

  const handleSaveTextMapping = (data: TextToNumberMappingFormData, id?: string) => {
    const mapping: TextToNumberMapping = {
      id: id || crypto.randomUUID(),
      ...data,
      createdAt: id
        ? textMappings.find((m) => m.id === id)?.createdAt || new Date().toISOString()
        : new Date().toISOString(),
    }
    saveTextMapping(mapping)
    loadData()
  }

  const handleDeleteTextMapping = (id: string) => {
    deleteTextMapping(id)
    loadData()
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-3 md:gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="shrink-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Назад</span>
            </Button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold text-foreground truncate">Настройки справочников</h1>
              <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                Управление справочными данными системы
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <Tabs defaultValue="test-types" className="space-y-4 md:space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="test-types" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Виды испытаний</span>
              <span className="sm:hidden">Виды</span>
            </TabsTrigger>
            <TabsTrigger value="levels" className="text-xs sm:text-sm px-2 py-2">
              Уровни
            </TabsTrigger>
            <TabsTrigger value="sport-titles" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Звания</span>
              <span className="sm:hidden">Звания</span>
            </TabsTrigger>
            <TabsTrigger value="text-mappings" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Маппинг</span>
              <span className="sm:hidden">Мапп.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test-types">
            <TestTypesManager testTypes={testTypes} onSave={handleSaveTestType} onDelete={handleDeleteTestType} />
          </TabsContent>

          <TabsContent value="levels">
            <LevelsManager levels={levels} onSave={handleSaveLevel} onDelete={handleDeleteLevel} />
          </TabsContent>

          <TabsContent value="sport-titles">
            <SportTitlesManager
              sportTitles={sportTitles}
              onSave={handleSaveSportTitle}
              onDelete={handleDeleteSportTitle}
            />
          </TabsContent>

          <TabsContent value="text-mappings">
            <TextMappingsManager
              mappings={textMappings}
              onSave={handleSaveTextMapping}
              onDelete={handleDeleteTextMapping}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute requireAdmin>
      <AdminPageContent />
    </ProtectedRoute>
  )
}
