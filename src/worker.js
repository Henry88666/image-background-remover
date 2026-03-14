// Cloudflare Worker - Image Background Remover API
// 使用 Remove.bg API 进行图片背景移除

export default {
  async fetch(request, env, ctx) {
    // CORS 配置
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 只接受 POST 请求
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { 
        status: 405,
        headers: corsHeaders 
      });
    }

    try {
      // 1. 解析上传的图片
      const formData = await request.formData();
      const imageFile = formData.get('image');

      if (!imageFile) {
        return new Response(JSON.stringify({ error: 'No image provided' }), { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      // 2. 验证文件类型
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(imageFile.type)) {
        return new Response(JSON.stringify({ error: 'Invalid file type. Only JPG and PNG are supported.' }), { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      // 3. 验证文件大小（10MB）
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (imageFile.size > maxSize) {
        return new Response(JSON.stringify({ error: 'File too large. Maximum size is 10MB.' }), { 
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      // 4. 读取图片数据
      const imageBuffer = await imageFile.arrayBuffer();

      // 5. 调用 Remove.bg API
      const removeBgForm = new FormData();
      removeBgForm.append('image_file', new Blob([imageBuffer]), 'image.png');
      removeBgForm.append('size', 'auto');

      const apiKey = env.REMOVE_BG_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      const removeBgResponse = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: {
          'X-Api-Key': apiKey,
        },
        body: removeBgForm,
      });

      if (!removeBgResponse.ok) {
        const errorText = await removeBgResponse.text();
        console.error('Remove.bg API error:', errorText);
        return new Response(JSON.stringify({ error: 'Background removal failed. Please try again.' }), { 
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        });
      }

      // 6. 获取处理后的图片
      const resultBlob = await removeBgResponse.blob();

      // 7. 返回结果
      return new Response(resultBlob, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'image/png',
          'Content-Disposition': 'attachment; filename="no-bg.png"',
        },
      });

    } catch (error) {
      console.error('Error processing image:', error);
      return new Response(JSON.stringify({ error: 'Internal server error' }), { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
  },
};
