import { NextResponse } from 'next/server'
import OpenAI, { toFile } from 'openai'
import { supabase } from '@/utils/supabase/supabase-client'

// Initialize OpenAI with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 50000, // Set timeout to 50 seconds to stay within Vercel limits
  maxRetries: 3,   // Add retries for reliability
})

export const maxDuration = 60; // Adjust to the maximum allowed for Hobby plan (60 seconds)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    const style = formData.get('style') as string
    const userId = formData.get('userId') as string
    const userPrompt = formData.get('userPrompt') as string || "N/A"

    if (!imageFile || !style || !userId) {
      return NextResponse.json(
        { error: 'Image, style, and user ID are required' },
        { status: 400 }
      )
    }

    // Check file size - Vercel has a 4.5MB limit on Hobby plan
    const fileSizeMB = imageFile.size / (1024 * 1024);
    if (fileSizeMB > 4) {
      return NextResponse.json(
        { error: `Image size (${fileSizeMB.toFixed(2)}MB) exceeds the 4MB limit. Please upload a smaller image.` },
        { status: 413 }
      )
    }

    // Check OpenAI API key is set
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server Seems busy !!' },
        { status: 500 }
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

    // Convert the uploaded file to an OpenAI-compatible format
    let openAIFile;
    try {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      openAIFile = await toFile(buffer, imageFile.name, { type: imageFile.type });
    } catch (fileError: any) {
      console.error('File conversion error:', fileError);
      return NextResponse.json(
        { error: 'Failed to process the uploaded image: ' + (fileError.message || 'Unknown file error') },
        { status: 500 }
      )
    }

    // Use the new gpt-image-1 model for image transformation
    let response;
    try {
      const promptText = `Transform this image into ${style} style. Some additional params to use if applicable else ignore - ${userPrompt}`;
      
      response = await openai.images.edit({
        model: "gpt-image-1",
        image: openAIFile,
        prompt: promptText,
      });
      
      if (!response.data?.[0]) {
        throw new Error('No image data returned from API');
      }
    } catch (imageEditError: any) {
      console.error('Image transformation error:', imageEditError);
      return NextResponse.json(
        { error: 'Failed to transform image: ' + (imageEditError.message || 'Unknown API error') },
        { status: 500 }
      )
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

    // Create a response that includes necessary data
    const imageUrl = response.data[0].url || ''; // Get URL (b64_json is also available if needed)
    const remainingCredits = userData.credits - 2;
    
    return NextResponse.json({
      imageUrl,
      remainingCredits,
      success: true
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error: any) {
    console.error('Error transforming image:', error)
    
    // Determine more specific error message
    let errorMessage = 'Failed to transform image';
    
    if (error.timeout || error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      errorMessage = 'The request timed out. Please try again with a smaller image.';
    } else if (error.message && typeof error.message === 'string') {
      errorMessage = error.message.substring(0, 200); // Limit error message length
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    return NextResponse.json(
      { error: errorMessage },
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json'
        }
      }
    )
  }
} 