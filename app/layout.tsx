import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 图片背景移除',
  description: '上传图片，一键去除背景',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  )
}
