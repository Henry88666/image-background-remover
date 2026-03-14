import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // 解析上传的文件
    const formData = await request.formData()
    const imageFile = formData.get('image') as File

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG and PNG are supported.' },
        { status: 400 }
      )
    }

    // 验证文件大小（10MB）
    const maxSize = 10 * 1024 * 1024
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }

    // 读取图片数据
    const imageBuffer = await imageFile.arrayBuffer()

    // 调用 Remove.bg API
    const removeBgForm = new FormData()
    removeBgForm.append('image_file', new Blob([imageBuffer]), 'image.png')
    removeBgForm.append('size', 'auto')

    const apiKey = process.env.REMOVE_BG_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgForm,
    })

    if (!removeBgResponse.ok) {
      const errorText = await removeBgResponse.text()
      console.error('Remove.bg API error:', errorText)
      return NextResponse.json(
        { error: 'Background removal failed. Please try again.' },
        { status: 500 }
      )
    }

    // 获取处理后的图片
    const resultBlob = await removeBgResponse.blob()

    // 返回结果
    return new NextResponse(resultBlob, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="no-bg.png"',
      },
    })

  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
