# Google Search API Setup Guide

## Step 1: Get Google Search API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the **Custom Search JSON API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

## Step 2: Create Custom Search Engine

1. Go to [Google Custom Search](https://cse.google.com/cse/)
2. Click **Add** to create new search engine
3. Enter `*.com` in "Sites to search" (for searching entire web)
4. Click **Create**
5. Copy your **Search Engine ID**

## Step 3: Update Environment Variables

Add to your `.env.local` file:
```
GOOGLE_SEARCH_API_KEY="your_api_key_here"
GOOGLE_SEARCH_ENGINE_ID="your_search_engine_id_here"
```

## Step 4: Test the Feature

Try these commands in your chatbot:
- "latest space news"
- "recent NASA discoveries"
- "current SpaceX updates"
- "today's astronomy news"

## Features Added:

✅ **Real-time Google Search** - Fetches live data from Google
✅ **Smart Keyword Detection** - Automatically detects when to search
✅ **Formatted Results** - Clean, readable search results
✅ **Error Handling** - Falls back gracefully if search fails
✅ **No Quota Issues** - Uses Google's generous free tier

## Search Triggers:
The chatbot will automatically search Google when users ask about:
- "latest" information
- "current" updates  
- "recent" news
- "today's" events
- "now" happening
- "update" on topics