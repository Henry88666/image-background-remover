'use client'

import { useState, useCallback, useRef } from 'react'
import { Upload, Download, Loader2, Sparkles, AlertCircle, RefreshCw, Zap } from 'lucide-react'

export default function Home() {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [processTime, setProcessTime] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(file.type)) {
      setError('不支持的文件格式，请上传 JPG 或 PNG 图片')
      return
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      setError('文件过大，请上传小于 10MB 的图片')
      return
    }

    const originalUrl = URL.createObjectURL(file)
    setOriginalImage(originalUrl)
    setError(null)
    setIsLoading(true)
    setResultImage(null)
    setProcessTime(null)

    const startTime = Date.now()

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '处理失败，请重试')
      }

      if (data.image) {
        setResultImage(data.image)
        setProcessTime(Date.now() - startTime)
      } else {
        throw new Error('处理失败，请重试')
      }
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : '网络错误，请检查连接后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = () => {
    if (resultImage) {
      const a = document.createElement('a')
      a.href = resultImage
      a.download = `removed-bg-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleReset = () => {
    setOriginalImage(null)
    setResultImage(null)
    setError(null)
    setIsLoading(false)
    setProcessTime(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <main className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-200">AI-Powered</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
            Background <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Remover</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md mx-auto">
            智能识别，一键抠图。支持 PNG、JPG 格式，最大 10MB
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-3xl">
          {/* Upload Area */}
          {!originalImage && !isLoading && (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative overflow-hidden
                border-2 border-dashed rounded-2xl p-12 sm:p-16 text-center cursor-pointer
                transition-all duration-300
                ${isDragging 
                  ? 'border-purple-500 bg-purple-500/20 scale-[1.02]' 
                  : 'border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40'
                }
              `}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 hover:opacity-100 transition-opacity"></div>
              
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <p className="text-xl text-white mb-2 font-medium">
                  点击或拖拽图片上传
                </p>
                <p className="text-slate-400">
                  支持 JPG、PNG 格式，最大 10MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-30"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
              </div>
              <p className="text-white text-lg mb-2">AI 正在智能抠图中...</p>
              <p className="text-slate-400 text-sm">请稍候，只需几秒钟</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-red-300 mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                重新上传
              </button>
            </div>
          )}

          {/* Result */}
          {originalImage && resultImage && !isLoading && (
            <div className="space-y-6">
              {/* Process Time Badge */}
              {processTime && (
                <div className="flex justify-center">
                  <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-green-500/30">
                    <Zap className="w-4 h-4 text-green-400" />
                    <span className="text-green-300 text-sm">处理完成，耗时 {(processTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-center mb-3">
                    <span className="text-slate-400 text-sm">原图</span>
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-2">
                    <img
                      src={originalImage}
                      alt="原图"
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>

                {/* Result */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                  <div className="text-center mb-3">
                    <span className="text-purple-400 text-sm font-medium">抠图结果</span>
                  </div>
                  <div 
                    className="rounded-xl p-2"
                    style={{
                      backgroundImage: `
                        linear-gradient(45deg, #1e293b 25%, transparent 25%),
                        linear-gradient(-45deg, #1e293b 25%, transparent 25%),
                        linear-gradient(45deg, transparent 75%, #1e293b 75%),
                        linear-gradient(-45deg, transparent 75%, #1e293b 75%)
                      `,
                      backgroundSize: '16px 16px',
                      backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px'
                    }}
                  >
                    <img
                      src={resultImage}
                      alt="去除背景后"
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={handleDownload}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-purple-500/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                下载透明背景图片
              </button>

              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="w-full py-3 border border-white/20 text-white/70 rounded-2xl font-medium hover:bg-white/10 hover:text-white transition-colors"
              >
                处理另一张图片
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-slate-500 text-sm mt-12">
          Powered by Remove.bg • Built with Next.js
        </p>
      </main>
    </div>
  )
}
