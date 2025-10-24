import { NextResponse } from 'next/server'
import { getEvents, addEvent } from '@/lib/db'

export async function GET() {
  try {
    const events = await getEvents()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const eventData = await request.json()
    const result = await addEvent(eventData)
    return NextResponse.json({ id: result.id, ...eventData })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 })
  }
}