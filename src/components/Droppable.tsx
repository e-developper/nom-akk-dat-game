import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import classNames from 'classnames';

import styles from './Droppable.module.css';
import type { Cell } from '../constants';

interface Props {
  children: React.ReactNode;
  dragging: boolean;
  cell: Cell
  showResult: boolean
}

function Droppable({ children, cell, dragging, showResult }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: cell.id, disabled: showResult });

  return (
    <div
      ref={setNodeRef}
      className={classNames(
        { 'correct-answer': cell.isValueCorrect && showResult },
        { 'not-correct-answer': !cell.isValueCorrect && showResult },
        styles.Droppable,
        isOver && styles.over,
        dragging && styles.dragging,
        children && styles.dropped
      )}
      aria-label="Droppable region"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </div>
  );
}

export default Droppable
