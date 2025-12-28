import { useDraggable } from '@dnd-kit/core';
import Draggable from '../Draggable';
import type { Card } from '../../constants';

export type DraggableItemProps = {
  card: Card
  showResult: boolean
}

const DraggableItem = ({ card, showResult }: DraggableItemProps) => {
  const { isDragging, setNodeRef, listeners } = useDraggable({
    id: card.id, disabled: showResult
  });

  return (
    <Draggable
      dragging={isDragging}
      ref={setNodeRef}
      listeners={listeners}
      style={{
        opacity: isDragging ? 0 : undefined,
      }}
    >{card.content}</Draggable>
  );
}

export default DraggableItem