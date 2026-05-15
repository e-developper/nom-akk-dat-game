import { forwardRef, type ReactNode, type PointerEventHandler } from 'react';
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
  hidden?: boolean;
  selected?: boolean;
  locked?: boolean;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
  onPointerUp?: PointerEventHandler<HTMLDivElement>;
}

const Draggable = forwardRef<HTMLButtonElement, DraggableProps>(
  function Draggable(
    {
      dragOverlay,
      isDragging,
      label,
      handle,
      listeners,
      hidden,
      selected,
      locked,
      children,
      onPointerDown,
      onPointerUp,
    },
    ref
  ) {
    return (
      <div
        className={classNames(
          'draggable',
          { 'dragOverlay': dragOverlay },
          { 'dragging': isDragging },
          { 'selected': selected },
          { 'locked': locked },
        )}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <button
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          ref={ref}
        >
          {hidden ? '?' : children}
        </button>
        {label && <label>{label}</label>}
      </div>
    );
  }
);

export default Draggable
