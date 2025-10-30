// Local storage management for GTO protocols

import type { Protocol, TestType, Level, SportTitle, TextToNumberMapping, AuditLog, User } from "./types"

function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback для старых сред
  return "id-" + Math.random().toString(36).substr(2, 9);
}

const STORAGE_KEYS = {
  PROTOCOLS: "gto_protocols",
  TEST_TYPES: "gto_test_types",
  LEVELS: "gto_levels",
  SPORT_TITLES: "gto_sport_titles",
  TEXT_MAPPINGS: "gto_text_mappings",
  AUDIT_LOGS: "gto_audit_logs",
  USERS: "gto_users",
  CURRENT_USER: "gto_current_user",
} as const

// Generic storage functions
function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue

  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error)
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error(`Error saving ${key} to storage:`, error)
  }
}

// Protocol operations
export function getProtocols(): Protocol[] {
  return getFromStorage<Protocol[]>(STORAGE_KEYS.PROTOCOLS, [])
}

export function getProtocol(id: string): Protocol | null {
  const protocols = getProtocols()
  return protocols.find((p) => p.id === id) || null
}

export function createProtocol(data: Omit<Protocol, "id" | "createdAt" | "updatedAt">): Protocol {
  const protocol: Protocol = {
    ...data,
    id: generateId(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const protocols = getProtocols()
  protocols.push(protocol)
  saveToStorage(STORAGE_KEYS.PROTOCOLS, protocols)

  // Log action
  logAction("CREATE", "Protocol", protocol.id, JSON.stringify(data))

  return protocol
}

export function updateProtocol(id: string, data: Omit<Protocol, "id" | "createdAt" | "updatedAt">): Protocol | null {
  const protocols = getProtocols()
  const index = protocols.findIndex((p) => p.id === id)

  if (index === -1) return null

  const updatedProtocol: Protocol = {
    ...data,
    id,
    createdAt: protocols[index].createdAt,
    updatedAt: new Date().toISOString(),
  }

  protocols[index] = updatedProtocol
  saveToStorage(STORAGE_KEYS.PROTOCOLS, protocols)

  // Log action
  logAction("UPDATE", "Protocol", id, JSON.stringify(data))

  return updatedProtocol
}

export function deleteProtocol(id: string): boolean {
  const protocols = getProtocols()
  const filtered = protocols.filter((p) => p.id !== id)

  if (filtered.length === protocols.length) return false

  saveToStorage(STORAGE_KEYS.PROTOCOLS, filtered)

  // Log action
  logAction("DELETE", "Protocol", id)

  return true
}

// Test types operations
export function getTestTypes(): TestType[] {
  const defaultTypes: TestType[] = [
    {
      id: "1",
      name: "Бег 30 м",
      description: "Спринтерский бег на короткую дистанцию",
      createdAt: new Date().toISOString(),
    },
    { id: "2", name: "Бег 100 м", description: "Спринтерский бег", createdAt: new Date().toISOString() },
    { id: "3", name: "Бег 1000 м", description: "Бег на выносливость", createdAt: new Date().toISOString() },
    { id: "4", name: "Подтягивание", description: "Силовое упражнение", createdAt: new Date().toISOString() },
    { id: "5", name: "Отжимания", description: "Силовое упражнение", createdAt: new Date().toISOString() },
    { id: "6", name: "Прыжок в длину", description: "Прыжковое упражнение", createdAt: new Date().toISOString() },
  ]

  return getFromStorage<TestType[]>(STORAGE_KEYS.TEST_TYPES, defaultTypes)
}

export function saveTestType(type: TestType): void {
  const types = getTestTypes()
  const index = types.findIndex((t) => t.id === type.id)

  if (index >= 0) {
    types[index] = type
  } else {
    types.push(type)
  }

  saveToStorage(STORAGE_KEYS.TEST_TYPES, types)
}

export function deleteTestType(id: string): void {
  const types = getTestTypes().filter((t) => t.id !== id)
  saveToStorage(STORAGE_KEYS.TEST_TYPES, types)
}

// Levels operations
export function getLevels(): Level[] {
  const defaultLevels: Level[] = [
    { id: "1", name: "Бронзовый знак", code: "bronze", createdAt: new Date().toISOString() },
    { id: "2", name: "Серебряный знак", code: "silver", createdAt: new Date().toISOString() },
    { id: "3", name: "Золотой знак", code: "gold", createdAt: new Date().toISOString() },
  ]

  return getFromStorage<Level[]>(STORAGE_KEYS.LEVELS, defaultLevels)
}

export function saveLevel(level: Level): void {
  const levels = getLevels()
  const index = levels.findIndex((l) => l.id === level.id)

  if (index >= 0) {
    levels[index] = level
  } else {
    levels.push(level)
  }

  saveToStorage(STORAGE_KEYS.LEVELS, levels)
}

export function deleteLevel(id: string): void {
  const levels = getLevels().filter((l) => l.id !== id)
  saveToStorage(STORAGE_KEYS.LEVELS, levels)
}

// Sport Titles operations
export function getSportTitles(): SportTitle[] {
  const defaultTitles: SportTitle[] = [
    { id: "1", name: "Мастер спорта", createdAt: new Date().toISOString() },
    { id: "2", name: "Кандидат в мастера спорта", createdAt: new Date().toISOString() },
    { id: "3", name: "I разряд", createdAt: new Date().toISOString() },
    { id: "4", name: "II разряд", createdAt: new Date().toISOString() },
    { id: "5", name: "III разряд", createdAt: new Date().toISOString() },
  ]

  return getFromStorage<SportTitle[]>(STORAGE_KEYS.SPORT_TITLES, defaultTitles)
}

export function saveSportTitle(title: SportTitle): void {
  const titles = getSportTitles()
  const index = titles.findIndex((t) => t.id === title.id)

  if (index >= 0) {
    titles[index] = title
  } else {
    titles.push(title)
  }

  saveToStorage(STORAGE_KEYS.SPORT_TITLES, titles)
}

export function deleteSportTitle(id: string): void {
  const titles = getSportTitles().filter((t) => t.id !== id)
  saveToStorage(STORAGE_KEYS.SPORT_TITLES, titles)
}

// Text to Number Mapping operations
export function getTextMappings(): TextToNumberMapping[] {
  const defaultMappings: TextToNumberMapping[] = [
    { id: "1", textValue: "отлично", numberValue: 5, testType: "Бег 100 м", createdAt: new Date().toISOString() },
    { id: "2", textValue: "хорошо", numberValue: 4, testType: "Бег 100 м", createdAt: new Date().toISOString() },
    {
      id: "3",
      textValue: "удовлетворительно",
      numberValue: 3,
      testType: "Бег 100 м",
      createdAt: new Date().toISOString(),
    },
  ]

  return getFromStorage<TextToNumberMapping[]>(STORAGE_KEYS.TEXT_MAPPINGS, defaultMappings)
}

export function saveTextMapping(mapping: TextToNumberMapping): void {
  const mappings = getTextMappings()
  const index = mappings.findIndex((m) => m.id === mapping.id)

  if (index >= 0) {
    mappings[index] = mapping
  } else {
    mappings.push(mapping)
  }

  saveToStorage(STORAGE_KEYS.TEXT_MAPPINGS, mappings)
}

export function deleteTextMapping(id: string): void {
  const mappings = getTextMappings().filter((m) => m.id !== id)
  saveToStorage(STORAGE_KEYS.TEXT_MAPPINGS, mappings)
}

export function convertTextToNumber(textValue: string, testType: string): number | null {
  const mappings = getTextMappings()
  const mapping = mappings.find((m) => m.textValue.toLowerCase() === textValue.toLowerCase() && m.testType === testType)
  return mapping ? mapping.numberValue : null
}

// Audit Log operations
export function getAuditLogs(): AuditLog[] {
  return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, [])
}

function logAction(action: "CREATE" | "UPDATE" | "DELETE", entity: string, entityId: string, details?: string): void {
  const user = getCurrentUser()
  if (!user) return

  const log: AuditLog = {
    id: generateId(),
    action,
    entity,
    entityId,
    userId: user.id,
    details,
    createdAt: new Date().toISOString(),
  }

  const logs = getAuditLogs()
  logs.push(log)
  saveToStorage(STORAGE_KEYS.AUDIT_LOGS, logs)
}

// User operations
export function getUsers(): User[] {
  const defaultUsers: User[] = [
    { id: "1", username: "admin", role: "admin" },
    { id: "2", username: "user", role: "user" },
  ]

  return getFromStorage<User[]>(STORAGE_KEYS.USERS, defaultUsers)
}

export function getCurrentUser(): User | null {
  return getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null)
}

export function setCurrentUser(user: User | null): void {
  saveToStorage(STORAGE_KEYS.CURRENT_USER, user)
}

export function login(username: string): User | null {
  const users = getUsers()
  const user = users.find((u) => u.username === username)

  if (user) {
    setCurrentUser(user)
    return user
  }

  return null
}

export function logout(): void {
  setCurrentUser(null)
}
