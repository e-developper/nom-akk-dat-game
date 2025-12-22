import React from 'react';
import { useDroppable, type UniqueIdentifier } from '@dnd-kit/core';
import classNames from 'classnames';

import styles from './Droppable.module.css';

interface Props {
  children: React.ReactNode;
  dragging: boolean;
  id: UniqueIdentifier;
}

function Droppable({ children, id, dragging }: Props) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={classNames(
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
