'use client';

import { useEffect, useRef, useState } from 'react';
import Image from '@tiptap/extension-image';
import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';

type ResizeDragState = {
  startX: number;
  startWidth: number;
};

function ResizableImageView({ node, selected, updateAttributes }: NodeViewProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, []);

  const startResize = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const imageWidth = wrapper.getBoundingClientRect().width;
    const dragState: ResizeDragState = {
      startX: event.clientX,
      startWidth: imageWidth,
    };

    setIsResizing(true);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';

    const onMouseMove = (moveEvent: MouseEvent) => {
      const nextWidth = Math.max(160, Math.min(1200, dragState.startWidth + moveEvent.clientX - dragState.startX));
      updateAttributes({ width: Math.round(nextWidth) });
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const width = typeof node.attrs.width === 'number' ? node.attrs.width : undefined;

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      className={`relative my-3 inline-block max-w-full ${selected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950' : ''}`}
      style={{ width: width ? `${width}px` : 'min(100%, 520px)' }}
    >
      <img
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        title={node.attrs.title || ''}
        className="block h-auto w-full rounded-2xl border border-white/10"
        draggable={false}
      />

      <button
        type="button"
        aria-label="Resize image"
        title="Drag to resize"
        className={`absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border border-cyan-300 bg-cyan-400 shadow-lg ${isResizing ? 'cursor-col-resize' : 'cursor-col-resize'} ${selected ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}
        onMouseDown={startResize}
      />
    </NodeViewWrapper>
  );
}

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        renderHTML: (attributes) =>
          attributes.width
            ? { width: attributes.width }
            : {},
      },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView);
  },
});