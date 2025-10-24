import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null

export async function POST(request: NextRequest) {
  let query = ''
  
  try {
    const body = await request.json()
    query = body.query
    
    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    if (!openai) {
      throw new Error('OpenAI not configured')
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant for OrbitX, a space science and astronomy club. Provide accurate, concise answers about space, science, technology, and general knowledge. Keep responses under 200 words and be informative yet conversational."
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: 300,
      temperature: 0.7,
    })

    const answer = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.'
    return NextResponse.json({ answer })
  } catch (error) {
    console.error('OpenAI API error:', error)
    
    // Fallback to basic responses if OpenAI fails
    const fallbackAnswer = `I'm having trouble accessing my knowledge base right now. For questions about "${query}", I recommend checking reliable sources or trying again later.`
    return NextResponse.json({ answer: fallbackAnswer })
  }
}