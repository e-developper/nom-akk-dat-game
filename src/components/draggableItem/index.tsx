import { useDraggable } from '@dnd-kit/core';
import Draggable from '../draggable';
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
      isDragging={isDragging}
      ref={setNodeRef}
      listeners={listeners}
    >{card.content}</Draggable>
  );
}

export default DraggableItem