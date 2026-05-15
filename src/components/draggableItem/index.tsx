import { useRef } from 'react';
import { useDraggable } from '@dnd-kit/core';
import Draggable from '../draggable';
import type { Card } from '../../constants';

export type DraggableItemProps = {
  card: Card
  showResult: boolean
  hidden?: boolean
  selected?: boolean
  locked?: boolean
  onSelect?: (id: string) => void
}

const DRAG_THRESHOLD = 5 // pixels

const DraggableItem = ({ card, showResult, hidden, selected, locked, onSelect }: DraggableItemProps) => {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: card.id, disabled: showResult || hidden || locked
  });

  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStart.current || !onSelect) return

    const dx = Math.abs(e.clientX - pointerStart.current.x)
    const dy = Math.abs(e.clientY - pointerStart.current.y)

    if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
      onSelect(card.id)
    }

    pointerStart.current = null
  }

  return (
    <Draggable
      isDragging={isDragging}
      ref={setNodeRef}
      listeners={listeners}
      hidden={hidden}
      selected={selected}
      locked={locked}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >{card.content}</Draggable>
  );
}

export default DraggableItem
