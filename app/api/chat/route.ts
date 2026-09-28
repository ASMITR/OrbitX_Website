import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel(
          { model: 'gemini-2.5-flash' }
        )

        let contextPrompt = `You are OrbitX AI Assistant for OrbitX space science club at ZCOER, Pune.

OrbitX Info:
- Mission: "Exploring Beyond Horizons"
- Location: ZCOER, Pune, Maharashtra
- Email: orbitx@zcoer.edu.in
- 6 Teams: Design & Innovation, Technical, Management & Operations, Public Outreach, Documentation, Social Media & Editing
- Focus: Space technology, astronomy, research, student collaboration

`
        if (conversationHistory && conversationHistory.length > 0) {
          contextPrompt += 'Recent conversation:\n'
          conversationHistory.slice(-4).forEach((msg: any) => {
            contextPrompt += `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}\n`
          })
          contextPrompt += '\n'
        }

        contextPrompt += `Current question: ${message.trim()}\n\nProvide a helpful, concise response about OrbitX or space science. Use emojis appropriately.`

        const result = await model.generateContent(contextPrompt)
        const text = result.response.text()

        if (text?.trim()) {
          return NextResponse.json({ response: text.trim() })
        }
      } catch (geminiError: any) {
        console.error('Gemini AI error:', geminiError.message || geminiError)
        if (geminiError.message?.includes('quota') || geminiError.message?.includes('rate')) {
          return NextResponse.json({
            response: '⏰ Too many requests right now. Please wait a moment and try again! You can also reach us at orbitx@zcoer.edu.in'
          })
        }
      }
    } else {
      console.log('No Gemini API key found')
    }

    return NextResponse.json({ response: generateFallbackResponse(message.trim(), conversationHistory) })
  } catch (error: any) {
    console.error('Chat API error:', error)
    return NextResponse.json({ response: generateFallbackResponse('help') })
  }
}

function generateFallbackResponse(message: string, conversationHistory?: any[]): string {
  const m = message.toLowerCase()

  if (m.includes('hello') || m.includes('hi') || m.includes('hey')) {
    const greetings = [
      '🚀 Hello! I\'m OrbitX AI Assistant. Ask me about our space science club, teams, projects, or how to join!',
      '🌌 Hi there! Welcome to OrbitX! What would you like to know about our space science club?',
      '✨ Hey! I\'m the OrbitX AI Assistant. Ask me anything about space exploration or our club!'
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }

  if (m.includes('team') || m.includes('member')) {
    return '👥 OrbitX has 6 specialized teams:\n\n1. Design & Innovation\n2. Technical Team\n3. Management & Operations\n4. Public Outreach\n5. Documentation\n6. Social Media & Editing\n\nWhich team interests you most?'
  }

  if (m.includes('contact') || m.includes('email') || m.includes('reach')) {
    return '📧 Contact OrbitX:\n\n• Email: orbitx@zcoer.edu.in\n• Location: ZCOER, Pune, Maharashtra\n• Website: You\'re already here! 🌟'
  }

  if (m.includes('mission') || m.includes('about') || m.includes('what is')) {
    return '🌌 OrbitX is a student space science & astronomy club at ZCOER, Pune.\n\nMission: "Exploring Beyond Horizons"\n\nWe focus on space technology, astronomy, and student collaboration. Join us in reaching for the stars! ✨'
  }

  if (m.includes('join') || m.includes('become')) {
    return '🎯 To join OrbitX:\n\n1. Explore our teams on the website\n2. Contact us at orbitx@zcoer.edu.in\n3. Attend our events and workshops\n4. Choose a team that matches your interests\n\nNo prior experience required — just curiosity! 🚀'
  }

  if (m.includes('project') || m.includes('activity') || m.includes('event')) {
    return '🛰️ OrbitX Activities:\n\n• Space technology research\n• Astronomy observations & workshops\n• Rocket and satellite design\n• Educational outreach programs\n• Community engagement events\n\nCheck our Events and Projects pages for more!'
  }

  if (m.includes('space') || m.includes('astronomy') || m.includes('rocket') || m.includes('satellite')) {
    return '🌟 At OrbitX we explore:\n\n• Rocket propulsion and design\n• Satellite technology\n• Planetary science\n• Astrophysics and cosmology\n• Emerging space technologies\n\nWhat specific topic interests you?'
  }

  return '🌌 I\'m OrbitX AI! I can help with:\n\n• OrbitX teams and activities\n• How to join the club\n• Events and projects\n• Space science topics\n• Contact information\n\nWhat would you like to know? 🚀'
}
