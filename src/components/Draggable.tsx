import React, { forwardRef } from 'react';
import classNames from 'classnames';
import type { DraggableSyntheticListeners } from '@dnd-kit/core';
import type { Transform } from '@dnd-kit/utilities';
import styles from './Draggable.module.css';

export enum Axis {
  All,
  Vertical,
  Horizontal,
}

interface Props {
  axis?: Axis;
  dragOverlay?: boolean;
  dragging?: boolean;
  handle?: boolean;
  label?: string;
  listeners?: DraggableSyntheticListeners;
  style?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
  transform?: Transform | null;
  isPendingDelay?: boolean;
  children?: React.ReactNode;
}

const Draggable = forwardRef<HTMLButtonElement, Props>(
  function Draggable(
    {
      axis,
      dragOverlay,
      dragging,
      handle,
      label,
      listeners,
      transform,
      style,
      buttonStyle,
      isPendingDelay = false,
      ...props
    },
    ref
  ) {
    return (
      <div
        className={classNames(
          styles.Draggable,
          dragOverlay && styles.dragOverlay,
          dragging && styles.dragging,
          handle && styles.handle,
          isPendingDelay && styles.pendingDelay
        )}
        style={
          {
            ...style,
            '--translate-x': `${transform?.x ?? 0}px`,
            '--translate-y': `${transform?.y ?? 0}px`,
          } as React.CSSProperties
        }
      >
        <button
          {...props}
          aria-label="Draggable"
          data-cypress="draggable-item"
          {...(handle ? {} : listeners)}
          tabIndex={handle ? -1 : undefined}
          ref={ref}
          style={{ ...buttonStyle, color: 'white' }}
        >
          {props.children}
        </button>
        {label ? <label>{label}</label> : null}
      </div>
    );
  }
);


export default Draggable
