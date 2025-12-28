import { type ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';

import type { Cell } from '../../constants';
import './style.css';

type DroppableProps = {
  children: ReactNode;
  dragging: boolean;
  cell: Cell
  showResult: boolean
}

function Droppable({ children, cell, dragging, showResult }: DroppableProps) {
  const { isOver, setNodeRef } = useDroppable({ id: cell.id, disabled: showResult });

  return (
    <div
      ref={setNodeRef}
      className={classNames('droppable',
        { 'correct-answer': cell.isValueCorrect && showResult },
        { 'not-correct-answer': !cell.isValueCorrect && showResult },
        { 'over': isOver },
        { 'dragging': dragging },
        { 'dropped': children }
      )}
      aria-label="Droppable region"
    >
      {children}
    </div>
  );
}

export default Droppable
