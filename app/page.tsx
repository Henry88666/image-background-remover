'use client'

import { useState, useCallback } from 'react'
import { Upload, Download, Loader2, ImageIcon, AlertCircle } from 'lucide-react'

export default function Home() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        processImage(file)
      } else {
        setError('请上传图片文件（JPG 或 PNG）')
      }
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImage(file)
    }
  }, [])

  const processImage = async (file: File) => {
    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('不支持的文件格式，请上传 JPG 或 PNG 图片')
      return
    }

    // 验证文件大小
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      setError('文件过大，请上传小于 10MB 的图片')
      return
    }

    // 显示原图预览
    const originalUrl = URL.createObjectURL(file)
    setOriginalImage(originalUrl)
    setError(null)
    setIsLoading(true)
    setResultImage(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      // 调用 API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/remove-bg'
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || '处理失败，请重试')
      }

      // 获取结果图片
      const blob = await response.blob()
      const resultUrl = URL.createObjectURL(blob)
      
      setResultImage(resultUrl)
      setResultBlob(blob)
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : '网络错误，请检查连接后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (resultImage && resultBlob) {
      const a = document.createElement('a')
      a.href = resultImage
      a.download = `no-bg-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleReset = () => {
    setOriginalImage(null)
    setResultImage(null)
    setResultBlob(null)
    setError(null)
    setIsLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 sm:p-8 lg:p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            🎨 AI 图片背景移除
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            上传图片，一键去除背景
          </p>
        </div>

        {/* Upload Area */}
        {!originalImage && !isLoading && (
          <div
            onClick={() => document.getElementById('fileInput')?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
              border-3 border-dashed rounded-xl p-12 sm:p-16 text-center cursor-pointer
              transition-all duration-300 ease-in-out
              ${isDragging 
                ? 'border-purple-600 bg-purple-100 scale-[1.02]' 
                : 'border-primary-500 bg-primary-50 hover:bg-primary-100 hover:border-secondary-500'
              }
            `}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-primary-500" />
            <p className="text-lg text-gray-800 mb-2 font-medium">
              点击或拖拽图片到此处
            </p>
            <p className="text-sm text-gray-500">
              支持 JPG、PNG 格式，最大 10MB
            </p>
            <input
              type="file"
              id="fileInput"
              accept="image/jpeg,image/png,image/jpg"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary-500 animate-spin" />
            <p className="text-gray-600">AI 正在处理中，请稍候...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-center">
            <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              重新上传
            </button>
          </div>
        )}

        {/* Result */}
        {originalImage && resultImage && !isLoading && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="text-center">
                <div className="bg-gray-100 rounded-xl p-4 mb-2">
                  <img
                    src={originalImage}
                    alt="原图"
                    className="max-w-full max-h-80 mx-auto rounded-lg shadow-md"
                  />
                </div>
                <p className="text-gray-600 font-medium">原图</p>
              </div>

              {/* Result */}
              <div className="text-center">
                <div 
                  className="rounded-xl p-4 mb-2"
                  style={{
                    backgroundImage: `
                      linear-gradient(45deg, #ccc 25%, transparent 25%),
                      linear-gradient(-45deg, #ccc 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, #ccc 75%),
                      linear-gradient(-45deg, transparent 75%, #ccc 75%)
                    `,
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                  }}
                >
                  <img
                    src={resultImage}
                    alt="去除背景后"
                    className="max-w-full max-h-80 mx-auto rounded-lg shadow-md"
                  />
                </div>
                <p className="text-gray-600 font-medium">去除背景后</p>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl font-semibold text-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              下载透明背景图片
            </button>

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-medium hover:border-gray-400 hover:text-gray-800 transition-colors"
            >
              处理另一张图片
            </button>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          Powered by Remove.bg API | Built with Next.js & Tailwind CSS
        </p>
      </div>
    </main>
  )
}
