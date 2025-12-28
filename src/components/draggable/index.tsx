import { forwardRef, type ReactNode } from 'react';
import classNames from 'classnames';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';

import './style.css';

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

type DraggableProps = {
  children: ReactNode;
  dragOverlay?: boolean;
  isDragging?: boolean;
  label?: string;
  handle?: boolean;
  listeners?: DraggableSyntheticListeners;
}

const Draggable = forwardRef<HTMLButtonElement, DraggableProps>(
  function Draggable(
    {
      dragOverlay,
      isDragging,
      label,
      handle,
      listeners,
      ...props
    },
    ref
  ) {
    return (
      <div
        className={classNames(
          'draggable',
          { 'dragOverlay': dragOverlay },
          { 'dragging': isDragging },
        )}
      >
        <button
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          ref={ref}
          {...props}
        >
          {props.children}
        </button>
        {label && <label>{label}</label>}
      </div>
    );
  }
);


export default Draggable
