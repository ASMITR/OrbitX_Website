'use client'

import { useState, useEffect, useMemo } from 'react'
import { Member } from '@/lib/types'

interface VirtualizedGridProps {
  items: Member[]
  renderItem: (item: Member, index: number) => React.ReactNode
  itemHeight: number
  containerHeight: number
  itemsPerRow: number
}

export default function VirtualizedGrid({
  items,
  renderItem,
  itemHeight,
  containerHeight,
  itemsPerRow
}: VirtualizedGridProps) {
  const [scrollTop, setScrollTop] = useState(0)

  const totalRows = Math.ceil(items.length / itemsPerRow)
  const rowHeight = itemHeight
  
  const visibleStartRow = Math.floor(scrollTop / rowHeight)
  const visibleEndRow = Math.min(
    visibleStartRow + Math.ceil(containerHeight / rowHeight) + 1,
    totalRows
  )

  const visibleItems = useMemo(() => {
    const startIndex = visibleStartRow * itemsPerRow
    const endIndex = Math.min(visibleEndRow * itemsPerRow, items.length)
    return items.slice(startIndex, endIndex).map((item, index) => ({
      item,
      index: startIndex + index,
      row: Math.floor((startIndex + index) / itemsPerRow)
    }))
  }, [items, visibleStartRow, visibleEndRow, itemsPerRow])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }

  return (
    <div
      style={{ height: containerHeight, overflow: 'auto' }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalRows * rowHeight, position: 'relative' }}>
        {visibleItems.map(({ item, index, row }) => (
          <div
            key={item.id || index}
            style={{
              position: 'absolute',
              top: row * rowHeight,
              left: (index % itemsPerRow) * (100 / itemsPerRow) + '%',
              width: 100 / itemsPerRow + '%',
              height: itemHeight
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  )
}