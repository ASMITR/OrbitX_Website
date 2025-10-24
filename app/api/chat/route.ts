import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Try Gemini AI first
    if (process.env.GEMINI_API_KEY) {
      try {
        console.log('Attempting Gemini AI request...')
        const model = genAI.getGenerativeModel({ 
          model: 'gemini-pro',
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
        
        // Build context from conversation history
        let contextPrompt = `You are OrbitX AI Assistant for OrbitX space science club at ZCOER, Pune.

OrbitX Info:
- Mission: "Exploring Beyond Horizons"
- Location: ZCOER, Pune, Maharashtra
- Email: orbitx@zcoer.edu.in
- 6 Teams: Design & Innovation, Technical, Management & Operations, Public Outreach, Documentation, Social Media & Editing
- Focus: Space technology, astronomy, research, student collaboration

`

        // Add recent conversation context
        if (conversationHistory && conversationHistory.length > 0) {
          contextPrompt += "Recent conversation:\n"
          conversationHistory.slice(-4).forEach((msg: any) => {
            contextPrompt += `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}\n`
          })
          contextPrompt += "\n"
        }

        contextPrompt += `Current question: ${message.trim()}\n\nProvide a helpful, unique response about OrbitX or space science. Vary your responses and be engaging. Use emojis appropriately.`

        const result = await model.generateContent(contextPrompt)
        const response = await result.response
        const text = response.text()
        
        if (text && text.trim()) {
          console.log('Gemini AI response successful')
          return NextResponse.json({ response: text.trim() })
        }
      } catch (geminiError: any) {
        console.error('Gemini AI error:', geminiError.message || geminiError)
        
        // Check for rate limit error
        if (geminiError.message?.includes('quota') || geminiError.message?.includes('rate')) {
          return NextResponse.json({ 
            response: '⏰ I\'m getting too many requests right now. Please wait a moment and try again! In the meantime, feel free to explore our website or contact us at orbitx@zcoer.edu.in' 
          })
        }
      }
    } else {
      console.log('No Gemini API key found')
    }



    // Fallback to rule-based response with randomization
    const fallbackResponse = generateFallbackResponse(message.trim(), conversationHistory)
    return NextResponse.json({ response: fallbackResponse })
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // Always return a helpful fallback response
    const fallbackResponse = generateFallbackResponse(message.trim(), conversationHistory)
    return NextResponse.json({ response: fallbackResponse })
  }
}

function generateFallbackResponse(message: string, conversationHistory?: any[]): string {
  const lowerMessage = message.toLowerCase()
  
  // Greetings with variations
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    const greetings = [
      '🚀 Hello! I\'m OrbitX AI Assistant. I can help you learn about our space science & astronomy club, teams, projects, events, and how to join us. What would you like to know?',
      '🌌 Hi there! Welcome to OrbitX! I\'m here to help you explore our space science club. Ask me about our teams, projects, or how to join us!',
      '✨ Hey! Great to meet you! I\'m the OrbitX AI Assistant. Ready to learn about space exploration and our amazing club? What interests you most?'
    ]
    return greetings[Math.floor(Math.random() * greetings.length)]
  }
  
  // Teams information
  if (lowerMessage.includes('team') || lowerMessage.includes('member')) {
    return '👥 OrbitX has 6 specialized teams:\n\n1. **Design & Innovation** - Creative problem-solving and space technology design\n2. **Technical Team** - Electronics, software development, system integration\n3. **Management & Operations** - Project management and operational efficiency\n4. **Public Outreach** - Community engagement and educational programs\n5. **Documentation** - Technical documentation and knowledge management\n6. **Social Media & Editing** - Digital presence and content creation\n\nWhich team interests you most?'
  }
  
  // Contact and location
  if (lowerMessage.includes('contact') || lowerMessage.includes('email') || lowerMessage.includes('reach')) {
    return '📧 **Contact OrbitX:**\n\n• Email: orbitx@zcoer.edu.in\n• Location: ZCOER (Zeal College of Engineering & Research), Pune, Maharashtra\n• Website: You\'re already here! 🌟\n\nFeel free to reach out for any questions about joining or collaborating with us!'
  }
  
  // Mission and about
  if (lowerMessage.includes('mission') || lowerMessage.includes('about') || lowerMessage.includes('what is')) {
    return '🌌 **About OrbitX:**\n\nMission: "Exploring Beyond Horizons"\n\nWe\'re a dynamic student organization at ZCOER, Pune, dedicated to space science, astronomy, and cutting-edge space technology. We foster innovation, collaboration, and learning in the fascinating world of space exploration.\n\nJoin us in reaching for the stars! ✨'
  }
  
  // How to join
  if (lowerMessage.includes('join') || lowerMessage.includes('become') || lowerMessage.includes('member')) {
    return '🎯 **Ready to Join OrbitX?**\n\n1. Visit our website and explore our teams\n2. Contact us at orbitx@zcoer.edu.in\n3. Attend our events and workshops\n4. Choose a team that matches your interests\n5. Start your space exploration journey!\n\nWe welcome students passionate about space, technology, and innovation. No prior experience required - just curiosity and enthusiasm! 🚀'
  }
  
  // Projects and activities
  if (lowerMessage.includes('project') || lowerMessage.includes('activity') || lowerMessage.includes('event')) {
    return '🛰️ **OrbitX Projects & Activities:**\n\n• Space technology research and development\n• Astronomy observations and workshops\n• Rocket and satellite design projects\n• Educational outreach programs\n• Technical documentation and knowledge sharing\n• Community engagement events\n\nCheck our Events and Projects pages for current activities and upcoming workshops!'
  }
  
  // Space and astronomy topics
  if (lowerMessage.includes('space') || lowerMessage.includes('astronomy') || lowerMessage.includes('rocket') || lowerMessage.includes('satellite')) {
    return '🌟 **Space & Astronomy at OrbitX:**\n\nWe explore fascinating topics including:\n• Rocket propulsion and design\n• Satellite technology and communications\n• Planetary science and exploration\n• Astrophysics and cosmology\n• Space missions and discoveries\n• Emerging space technologies\n\nWhat specific space topic interests you most? I\'d love to help you learn more!'
  }
  
  // Location specific
  if (lowerMessage.includes('pune') || lowerMessage.includes('zcoer') || lowerMessage.includes('college')) {
    return '🏫 **OrbitX at ZCOER:**\n\nWe\'re proudly based at Zeal College of Engineering & Research (ZCOER) in Pune, Maharashtra. Our college provides excellent facilities and support for our space science initiatives.\n\nPune\'s growing tech ecosystem makes it an ideal location for space technology research and innovation!'
  }
  
  // Help and general
  if (lowerMessage.includes('help') || lowerMessage.includes('info') || lowerMessage.includes('tell me')) {
    return '💫 **I can help you with:**\n\n• Information about OrbitX teams and activities\n• How to join our space science club\n• Our mission and vision\n• Contact details and location\n• Current projects and events\n• Space science and astronomy topics\n• **Latest news and updates** (try "latest space news")\n\nJust ask me anything about OrbitX or space exploration! 🚀'
  }
  
  // Default response
  return '🌌 Thanks for your interest in OrbitX! We\'re a space science & astronomy club at ZCOER, Pune with the mission "Exploring Beyond Horizons".\n\n✨ **Quick Info:**\n• 6 specialized teams\n• Focus on space technology & exploration\n• Email: orbitx@zcoer.edu.in\n• Open to all passionate students\n\nWhat would you like to know more about? Ask me about our teams, projects, or how to join! 🚀'
}