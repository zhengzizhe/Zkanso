import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';

/**
 * 拖拽状态枚举
 */
export enum DragState {
  IDLE = 'idle',           // 闲置
  HOVER = 'hover',         // 悬停手柄
  DRAGGING = 'dragging',   // 拖拽中
  DROPPING = 'dropping'    // 释放中
}

/**
 * 拖拽位置信息
 */
interface DragPosition {
  nodePos: number;          // 节点在文档中的位置
  clientY: number;          // 鼠标 Y 坐标
  elementRect: DOMRect;     // 元素的边界矩形
}

/**
 * 放置指示器位置
 */
interface DropIndicator {
  position: number;         // 插入位置
  zone: 'before' | 'after'; // 插入区域
  targetElement: HTMLElement | null;
}

/**
 * 拖拽控制器钩子
 * 
 * 管理段落拖拽的完整生命周期
 */
export function useDragController(editor: Editor | null) {
  // 拖拽状态
  const [dragState, setDragState] = useState<DragState>(DragState.IDLE);
  const [draggedNodePos, setDraggedNodePos] = useState<number | null>(null);
  const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);
  
  // 拖拽数据引用
  const dragDataRef = useRef<{
    startY: number;
    scrollContainer: HTMLElement | null;
    autoScrollInterval: number | null;
  }>({
    startY: 0,
    scrollContainer: null,
    autoScrollInterval: null
  });

  /**
   * 开始拖拽
   */
  const handleDragStart = useCallback((
    event: React.DragEvent<HTMLElement>,
    nodePos: number
  ) => {
    if (!editor) return;

    // 设置拖拽数据
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(nodePos));
    
    // 创建 Craft 风格的拖拽镜像
    const dragImage = event.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.opacity = '0.95';
    dragImage.style.transform = 'rotate(1.5deg) scale(1.02)';
    dragImage.style.boxShadow = '0 12px 32px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.12)';
    dragImage.style.border = '1px solid rgba(99, 102, 241, 0.2)';
    dragImage.style.borderRadius = '8px';
    dragImage.style.backgroundColor = '#FFFFFF';
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.15))';
    document.body.appendChild(dragImage);
    event.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);

    // 更新状态
    setDragState(DragState.DRAGGING);
    setDraggedNodePos(nodePos);
    dragDataRef.current.startY = event.clientY;
    
    // 添加原始块的半透明效果
    const originalElement = event.currentTarget.closest('[data-node-view-wrapper]') as HTMLElement;
    if (originalElement) {
      originalElement.style.opacity = '0.4';
      originalElement.setAttribute('data-dragging', 'true');
    }
    
    // 添加全局拖拽样式
    document.body.classList.add('editor-dragging');
    
    console.log('🟢 拖拽开始:', { nodePos, clientY: event.clientY });
  }, [editor]);

  /**
   * 拖拽经过
   */
  const handleDragOver = useCallback((
    event: React.DragEvent<HTMLElement>,
    targetNodePos: number
  ) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (!editor || draggedNodePos === null) return;

    const targetElement = event.currentTarget;
    const rect = targetElement.getBoundingClientRect();
    const mouseY = event.clientY;
    const elementMiddle = rect.top + rect.height / 2;

    // 判断插入位置（上方或下方）
    const zone: 'before' | 'after' = mouseY < elementMiddle ? 'before' : 'after';

    // 更新放置指示器
    setDropIndicator({
      position: targetNodePos,
      zone,
      targetElement
    });

    // 自动滚动检测
    handleAutoScroll(mouseY);
  }, [editor, draggedNodePos]);

  /**
   * 自动滚动处理 - Craft 风格的平滑渐进式加速
   */
  const handleAutoScroll = useCallback((mouseY: number) => {
    const scrollContainer = document.querySelector('.craft-editor-content') as HTMLElement;
    if (!scrollContainer) return;

    const { top, bottom } = scrollContainer.getBoundingClientRect();
    const threshold = 120; // 增大触发区域
    const maxSpeed = 28; // 提高最大速度

    let scrollSpeed = 0;

    // 接近顶部 - 使用缓动函数
    if (mouseY - top < threshold) {
      const distance = threshold - (mouseY - top);
      const ratio = distance / threshold;
      // 使用二次函数实现平滑加速
      scrollSpeed = -maxSpeed * Math.pow(ratio, 1.5);
    }
    // 接近底部
    else if (bottom - mouseY < threshold) {
      const distance = threshold - (bottom - mouseY);
      const ratio = distance / threshold;
      scrollSpeed = maxSpeed * Math.pow(ratio, 1.5);
    }

    // 执行平滑滚动
    if (scrollSpeed !== 0) {
      scrollContainer.scrollBy({ 
        top: scrollSpeed, 
        behavior: 'auto' 
      });
    }
  }, []);

  /**
   * 放置拖拽
   */
  const handleDrop = useCallback((
    event: React.DragEvent<HTMLElement>
  ) => {
    event.preventDefault();
    
    if (!editor || draggedNodePos === null || !dropIndicator) return;

    console.log('🔵 拖拽放置:', { 
      from: draggedNodePos, 
      to: dropIndicator.position,
      zone: dropIndicator.zone 
    });

    // 获取目标节点和源节点的信息
    const { doc } = editor.state;
    const sourceNode = doc.nodeAt(draggedNodePos);
    const targetNode = doc.nodeAt(dropIndicator.position);
    
    if (!sourceNode || !targetNode) {
      console.error('⚠️ 节点不存在');
      cleanup();
      return;
    }

    // 计算目标位置
    let targetPos = dropIndicator.position;
    if (dropIndicator.zone === 'after') {
      // 在目标节点后面插入
      targetPos = dropIndicator.position + targetNode.nodeSize;
    }
    // else: zone === 'before', 使用 dropIndicator.position 即可

    console.log('🎯 最终目标位置:', targetPos);

    // 执行移动操作
    moveNode(draggedNodePos, targetPos);

    // 清理状态
    cleanup();
  }, [editor, draggedNodePos, dropIndicator]);

  /**
   * 拖拽结束
   */
  const handleDragEnd = useCallback(() => {
    console.log('🔴 拖拽结束');
    
    // 恢复原始块的透明度
    const draggingElements = document.querySelectorAll('[data-dragging="true"]');
    draggingElements.forEach(el => {
      (el as HTMLElement).style.opacity = '1';
      el.removeAttribute('data-dragging');
    });
    
    cleanup();
  }, []);

  /**
   * 移动节点 - 优化版，修复位置计算
   */
  const moveNode = useCallback((from: number, to: number) => {
    if (!editor) return;
    if (from === to) {
      console.log('⚠️ 源位置和目标位置相同，跳过移动');
      return;
    }

    try {
      const { state, view } = editor;
      const { tr, doc } = state;
      
      // 获取源节点
      const sourceNode = doc.nodeAt(from);
      if (!sourceNode) {
        console.error('❗ 未找到源节点 at position:', from);
        return;
      }

      const sourceSize = sourceNode.nodeSize;
      console.log('📌 节点信息:', { 
        type: sourceNode.type.name,
        content: sourceNode.textContent,
        from, 
        to, 
        sourceSize 
      });

      // 创建新的事务
      const newTr = tr.replaceWith(from, from + sourceSize, []);
      
      // 计算调整后的插入位置
      let insertPos = to;
      if (from < to) {
        // 向下移动：需要减去被删除节点的大小
        insertPos = to - sourceSize;
      }
      
      console.log('🎯 计算位置:', { 
        originalFrom: from,
        originalTo: to,
        sourceSize,
        finalInsertPos: insertPos
      });

      // 在新位置插入节点
      newTr.insert(insertPos, sourceNode);
      
      // 应用事务
      view.dispatch(newTr);

      console.log('✅ 节点移动完成:', { from, to: insertPos });
    } catch (error) {
      console.error('❌ 移动节点失败:', error);
    }
  }, [editor]);

  /**
   * 清理拖拽状态
   */
  const cleanup = useCallback(() => {
    setDragState(DragState.IDLE);
    setDraggedNodePos(null);
    setDropIndicator(null);
    document.body.classList.remove('editor-dragging');
    
    // 清除自动滚动
    if (dragDataRef.current.autoScrollInterval) {
      clearInterval(dragDataRef.current.autoScrollInterval);
      dragDataRef.current.autoScrollInterval = null;
    }
  }, []);

  // 清理副作用
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    dragState,
    draggedNodePos,
    dropIndicator,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  };
}
