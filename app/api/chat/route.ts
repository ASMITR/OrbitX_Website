import { NextRequest, NextResponse } from 'next/server'
import { searchGoogle, formatSearchResults } from '@/lib/googleSearch'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message } = body

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Try Python chatbot model first
    try {
      const pythonResponse = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message.trim() }),
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })

      if (pythonResponse.ok) {
        const data = await pythonResponse.json()
        if (data.response) {
          return NextResponse.json({ response: data.response })
        }
      }
    } catch (pythonError) {
      console.log('Python chatbot unavailable, using fallback')
    }

    // Check if user is asking for current/latest information
    const searchKeywords = ['latest', 'current', 'recent', 'news', 'today', 'now', 'update']
    const shouldSearch = searchKeywords.some(keyword => message.toLowerCase().includes(keyword))
    
    if (shouldSearch) {
      try {
        const searchQuery = message.replace(/latest|current|recent|news|today|now|update/gi, '').trim()
        const searchResults = await searchGoogle(searchQuery)
        const formattedResults = formatSearchResults(searchResults, searchQuery)
        return NextResponse.json({ response: formattedResults })
      } catch (searchError) {
        console.log('Google Search failed, using fallback')
      }
    }

    // Fallback to rule-based response
    const fallbackResponse = generateFallbackResponse(message.trim())
    return NextResponse.json({ response: fallbackResponse })
  } catch (error: any) {
    console.error('Chat API error:', error)
    
    // Always return a helpful fallback response
    const fallbackResponse = generateFallbackResponse('help')
    return NextResponse.json({ response: fallbackResponse })
  }
}

function generateFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase()
  
  // Greetings
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return '🚀 Hello! I\'m OrbitX AI Assistant. I can help you learn about our space science & astronomy club, teams, projects, events, and how to join us. What would you like to know?'
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