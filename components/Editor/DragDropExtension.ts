import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { NodeSelection } from '@tiptap/pm/state';

/**
 * Craft 风格拖拽扩展 - 完整版
 * 实现特性：
 * 1. 拖拽镜像：0.92透明度 + 1.02缩放 + 1deg旋转 + 多层阴影
 * 2. 原块状态：0.4透明度 + 虚线轮廓
 * 3. 自动滚动：上下100px阈值区域
 */

let draggedNode: any = null;
let draggedPos: number = 0;
let dragSourceElement: HTMLElement | null = null;

export const DragDropExtension = Extension.create({
  name: 'dragDrop',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dragDrop'),
        
        props: {
          handleDOMEvents: {
            // ========== 拖拽开始 ==========
            dragstart(view, event) {
              const target = event.target as HTMLElement;
              
              // 查找手柄或block-wrapper
              const dragHandle = target.closest('[data-drag-handle]');
              if (!dragHandle) return false;
              
              const blockWrapper = dragHandle.closest('.block-wrapper');
              if (!blockWrapper) return false;

              dragSourceElement = blockWrapper as HTMLElement;
              
              const pos = view.posAtDOM(blockWrapper, 0);
              if (pos === null || pos === undefined) return false;

              const $pos = view.state.doc.resolve(pos);
              const node = $pos.node($pos.depth);
              
              if (!node) return false;

              draggedNode = node;
              draggedPos = $pos.before($pos.depth);

              console.log('🟢 开始拖拽:', {
                nodeType: node.type.name,
                from: draggedPos,
                to: draggedPos + node.nodeSize
              });

              // 选中节点
              const selection = NodeSelection.create(view.state.doc, draggedPos);
              view.dispatch(view.state.tr.setSelection(selection));

              // 设置拖拽数据
              if (event.dataTransfer) {
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.dropEffect = 'move';
                event.dataTransfer.setData('text/html', blockWrapper.innerHTML);
                
                // 创建 Craft 风格拖拽镜像
                const dragImage = createDragGhost(blockWrapper as HTMLElement);
                document.body.appendChild(dragImage);
                event.dataTransfer.setDragImage(dragImage, 20, 20);
                
                setTimeout(() => {
                  if (document.body.contains(dragImage)) {
                    document.body.removeChild(dragImage);
                  }
                }, 0);
              }

              // 添加拖拽中状态
              dragSourceElement.classList.add('is-dragging');

              return false;
            },

            // ========== 拖拽经过 ==========
            dragover(view, event) {
              event.preventDefault();
              
              if (!draggedNode || !dragSourceElement) return false;

              if (event.dataTransfer) {
                event.dataTransfer.dropEffect = 'move';
              }

              // 自动滚动
              handleAutoScroll(event);

              return false;
            },

            // ========== 放置 ==========
            drop(view, event) {
              event.preventDefault();
              
              if (!draggedNode || draggedPos === null || !dragSourceElement) {
                console.log('❌ 没有拖拽数据');
                return false;
              }

              // 使用鼠标坐标获取放置位置
              const coords = { left: event.clientX, top: event.clientY };
              const pos = view.posAtCoords(coords);
              
              if (!pos) {
                console.log('❌ 无法获取放置坐标');
                cleanup();
                return false;
              }

              const $dropPos = view.state.doc.resolve(pos.pos);
              let insertPos = $dropPos.before($dropPos.depth);

              console.log('📍 拖拽信息:', {
                from: draggedPos,
                to: insertPos,
                nodeSize: draggedNode.nodeSize
              });

              // 拖到自己不移动
              if (insertPos === draggedPos) {
                console.log('⚠️ 拖到自己');
                cleanup();
                return true;
              }

              // 执行移动
              const tr = view.state.tr;
              tr.delete(draggedPos, draggedPos + draggedNode.nodeSize);
              
              if (draggedPos < insertPos) {
                insertPos = insertPos - draggedNode.nodeSize;
              }
              
              tr.insert(insertPos, draggedNode);
              view.dispatch(tr);

              console.log('✅ 移动完成');
              cleanup();
              return true;
            },

            // ========== 拖拽结束 ==========
            dragend(view, event) {
              cleanup();
              return false;
            },
          },
        },
      }),
    ];
  },
});

/**
 * 创建 Craft 风格拖拽镜像
 * 规格：
 * - 透明度: 0.92
 * - 缩放: 1.02
 * - 旋转: 1deg
 * - 阴影: 3层（主阴影 + 次阴影 + 发光）
 * - 边框: 1px 紫色半透明
 * - 圆角: 6px
 */
function createDragGhost(element: HTMLElement): HTMLElement {
  const ghost = element.cloneNode(true) as HTMLElement;
  
  ghost.style.position = 'fixed';
  ghost.style.top = '-9999px';
  ghost.style.left = '-9999px';
  ghost.style.width = `${element.offsetWidth}px`;
  ghost.style.height = `${element.offsetHeight}px`;
  ghost.style.opacity = '0.92';
  ghost.style.transform = 'scale(1.02) rotate(1deg)';
  ghost.style.borderRadius = '6px';
  ghost.style.border = '1px solid rgba(99, 102, 241, 0.3)';
  ghost.style.background = 'rgba(255, 255, 255, 0.95)';
  ghost.style.boxShadow = `
    0 20px 40px rgba(0, 0, 0, 0.15),
    0 8px 16px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(99, 102, 241, 0.1)
  `;
  ghost.style.filter = 'drop-shadow(0 4px 12px rgba(99, 102, 241, 0.15))';
  ghost.style.pointerEvents = 'none';
  ghost.style.zIndex = '9999';
  ghost.style.willChange = 'transform, opacity';
  
  return ghost;
}

/**
 * 自动滚动逻辑
 * - 阈值: 100px
 * - 最大速度: 25px/frame
 * - 速度曲线: easeInOutQuad (power 1.8)
 */
function handleAutoScroll(event: DragEvent) {
  const scrollThreshold = 100;
  const maxScrollSpeed = 25;
  
  const viewportHeight = window.innerHeight;
  const mouseY = event.clientY;
  
  let scrollSpeed = 0;
  
  if (mouseY < scrollThreshold) {
    const distance = scrollThreshold - mouseY;
    scrollSpeed = -Math.pow(distance / scrollThreshold, 1.8) * maxScrollSpeed;
  } else if (mouseY > viewportHeight - scrollThreshold) {
    const distance = mouseY - (viewportHeight - scrollThreshold);
    scrollSpeed = Math.pow(distance / scrollThreshold, 1.8) * maxScrollSpeed;
  }
  
  if (scrollSpeed !== 0) {
    window.scrollBy({ top: scrollSpeed, behavior: 'smooth' });
  }
}

/**
 * 清理拖拽状态
 */
function cleanup() {
  if (dragSourceElement) {
    dragSourceElement.classList.remove('is-dragging');
    dragSourceElement = null;
  }
  draggedNode = null;
  draggedPos = 0;
}
