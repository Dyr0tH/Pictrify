import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { supabase } from '@/utils/supabase/supabase-client'

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const style = formData.get('style') as string
    const userId = formData.get('userId') as string

    if (!imageFile || !style || !userId) {
      return NextResponse.json(
        { error: 'Image, style, and user ID are required' },
        { status: 400 }
      )
    }

    // Check user's credits
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('credits')
      .eq('id', userId)
      .single()

    if (userError) {
      return NextResponse.json(
        { error: 'Failed to fetch user credits' },
        { status: 500 }
      )
    }

    if (!userData || userData.credits < 2) {
      return NextResponse.json(
        { error: 'Insufficient credits. Please purchase more credits to continue.' },
        { status: 403 }
      )
    }

    // Convert the image to base64
    const buffer = await imageFile.arrayBuffer()
    const base64Image = Buffer.from(buffer).toString('base64')
    
    // First analyze the image with GPT-4 Vision to generate a detailed description
    const visionResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: `Analyze this image and create a detailed description for transforming it into ${style} style. Focus on the key elements, composition, subject matter, colors, and overall feel.` },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${imageFile.type};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 500
    });
    
    const imageDescription = visionResponse.choices[0]?.message?.content || `An image in ${style} style`;

    // Use DALL-E 3 for image generation with the detailed description
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${imageDescription}. Transform this scene into authentic ${style} style. Make it look high quality and maintain the original composition and key elements while applying the artistic style.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "vivid"
    })

    if (!response.data[0]?.url) {
      throw new Error('Failed to generate transformed image')
    }

    // Deduct credits after successful transformation
    const { error: updateError } = await supabase
      .from('users')
      .update({ credits: userData.credits - 2 })
      .eq('id', userId)

    if (updateError) {
      console.error('Error updating credits:', updateError)
      return NextResponse.json(
        { error: 'Failed to update credits' },
        { status: 500 }
      )
    }

    // Create a response that includes a script to dispatch the refresh event
    const imageUrl = response.data[0].url
    const remainingCredits = userData.credits - 2
    
    return NextResponse.json({
      imageUrl,
      remainingCredits,
      success: true
    })
  } catch (error: any) {
    console.error('Error transforming image:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to transform image' },
      { status: 500 }
    )
  }
} 