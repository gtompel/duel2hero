"use client"

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Upload, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  onImageProcessed: (data: any) => void
  onImageUpload: (url: string) => void
}

export function ImageUpload({ onImageProcessed, onImageUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Проверяем, что файл является изображением
    if (!file.type.startsWith('image/')) {
      toast.error('Пожалуйста, выберите изображение')
      return
    }

    // Создаем превью изображения
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    // Отправляем файл на сервер
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/protocols/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const result = await response.json()
      
      // Передаем URL изображения родительскому компоненту
      onImageUpload(result.url)
      
      // Если удалось извлечь данные, передаем их родительскому компоненту
      if (result.data) {
        onImageProcessed(result.data)
      }
      
      toast.success('Изображение успешно загружено')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error('Ошибка при загрузке изображения')
    } finally {
      setIsUploading(false)
    }
  }, [onImageProcessed, onImageUpload])

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(file)
      fileInputRef.current.files = dataTransfer.files
      handleFileChange({ target: { files: dataTransfer.files } } as any)
    }
  }

  return (
    <Card className="gto-card border border-white/10">
      <CardHeader>
        <CardTitle className="text-base md:text-lg text-white">Загрузка изображения протокола</CardTitle>
        <CardDescription className="text-sm text-white/70">
          Загрузите фотографию протокола для автоматического извлечения данных
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition-colors"
          onClick={handleButtonClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <Input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
          
          {previewUrl ? (
            <div className="space-y-3">
              <div className="relative mx-auto w-full max-w-xs aspect-auto">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-lg object-contain max-h-64"
                  unoptimized
                />
              </div>
              <p className="text-sm text-white/70">Нажмите, чтобы выбрать другое изображение</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                <Upload className="w-6 h-6 text-white/70" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-medium">Перетащите изображение сюда или нажмите для выбора</p>
                <p className="text-sm text-white/70">Поддерживаются форматы JPG, PNG, WEBP</p>
              </div>
            </div>
          )}
        </div>
        
        {(isUploading || isProcessing) && (
          <div className="flex items-center justify-center gap-2 text-white/70">
            <Loader2 className="w-4 h-4 animate-spin" />
            {isUploading ? 'Загрузка изображения...' : 'Обработка изображения...'}
          </div>
        )}
        
        <div className="flex justify-center">
          <Button 
            onClick={handleButtonClick} 
            disabled={isUploading || isProcessing}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Выбрать изображение
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}