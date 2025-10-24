interface SearchResult {
  title: string
  snippet: string
  pageid: number
}

export async function searchGoogle(query: string): Promise<SearchResult[]> {
  try {
    const searchQuery = encodeURIComponent(query)
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&format=json&origin=*&srlimit=3`
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.query?.search || []
    
  } catch (error) {
    console.error('Wikipedia Search error:', error)
    return []
  }
}

export function formatSearchResults(results: SearchResult[], query: string): string {
  if (results.length === 0) {
    return `🔍 I couldn't find information about "${query}". Let me help you with OrbitX information instead!`
  }

  let formattedResponse = `📚 **Information about "${query}" from Wikipedia:**\n\n`
  
  results.forEach((result, index) => {
    formattedResponse += `**${index + 1}. ${result.title}**\n`
    formattedResponse += `${result.snippet.replace(/<[^>]*>/g, '')}\n`
    formattedResponse += `🔗 https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}\n\n`
  })
  
  formattedResponse += `💡 *This information is from Wikipedia - the free encyclopedia.*`
  
  return formattedResponse
}