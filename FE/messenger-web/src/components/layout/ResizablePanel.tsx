"use client";

import { useRef, useState, useEffect } from "react";

interface ResizablePanelProps {
  children: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function ResizablePanel({
  children,
  rightPanel,
  defaultWidth = 30,
  minWidth = 20,
  maxWidth = 70,
}: ResizablePanelProps) {
  const [leftWidth, setLeftWidth] = useState(defaultWidth);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const handleMouseDown = () => {
    isDraggingRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDraggingRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;
    const newLeftWidth = (e.clientX / containerWidth) * 100;

    if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
      setLeftWidth(newLeftWidth);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.body.style.userSelect = "auto";
    document.body.style.cursor = "auto";
  };

  useEffect(() => {
    if (isDraggingRef.current) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [leftWidth, minWidth, maxWidth]);

  return (
    <div ref={containerRef} className="flex h-full w-full">
      {/* Left Panel - Chat List */}
      <div
        style={{ width: `${leftWidth}%` }}
        className="flex flex-col overflow-hidden"
      >
        {children}
      </div>

      {/* Resizable Divider */}
      <div
        onMouseDown={handleMouseDown}
        className="group w-1 cursor-col-resize bg-[var(--border-color)] transition-colors hover:bg-[var(--primary-color)]"
        title="Drag to resize"
      />

      {/* Right Panel - Chat Messages */}
      <div
        style={{ width: `${100 - leftWidth}%` }}
        className="hidden flex-col overflow-hidden lg:flex"
      >
        {rightPanel}
      </div>
    </div>
  );
}
