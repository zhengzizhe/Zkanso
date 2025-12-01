import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

export const DragHandle = Extension.create({
  name: 'dragHandle',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dragHandle'),
        
        view(editorView) {
          // 使用编辑器 DOM 的父容器
          let container = editorView.dom.parentElement;
          
          if (!container || container.children.length === 0) {
            container = editorView.dom.closest('.tiptap-editor')?.parentElement || editorView.dom.parentElement;
          }
          
          if (!container) {
            console.error('DragHandle: 找不到容器');
            return {};
          }

          console.log('DragHandle: 初始化', container);

          // 创建拖拽手柄元素
          const dragHandle = document.createElement('div');
          dragHandle.className = 'drag-handle';
          dragHandle.contentEditable = 'false';
          dragHandle.draggable = false; // 暂时禁用拖动
          dragHandle.setAttribute('data-drag-handle', 'true');
          dragHandle.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="9" cy="5" r="1"/>
              <circle cx="9" cy="12" r="1"/>
              <circle cx="9" cy="19" r="1"/>
              <circle cx="15" cy="5" r="1"/>
              <circle cx="15" cy="12" r="1"/>
              <circle cx="15" cy="19" r="1"/>
            </svg>
          `;
          
          // 设置样式
          dragHandle.style.display = 'flex';
          dragHandle.style.position = 'fixed';
          dragHandle.style.left = '0px';
          dragHandle.style.top = '0px';
          dragHandle.style.width = '24px';
          dragHandle.style.height = '24px';
          dragHandle.style.alignItems = 'center';
          dragHandle.style.justifyContent = 'center';
          dragHandle.style.cursor = 'grab';
          dragHandle.style.opacity = '0.6';
          dragHandle.style.zIndex = '99999';
          dragHandle.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
          dragHandle.style.border = '1px solid #6366f1';
          dragHandle.style.borderRadius = '4px';
          dragHandle.style.color = '#6366f1';
          dragHandle.style.pointerEvents = 'auto';
          dragHandle.style.transition = 'opacity 0.2s, background-color 0.2s';
          
          // Hover 效果
          dragHandle.addEventListener('mouseenter', () => {
            dragHandle.style.opacity = '1';
            dragHandle.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
          });
          dragHandle.addEventListener('mouseleave', () => {
            dragHandle.style.opacity = '0.6';
            dragHandle.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
          });
          
          // 添加到 body
          document.body.appendChild(dragHandle);
          
          console.log('DragHandle: 图标已添加（拖动功能已禁用）');

          // 更新手柄位置
          const updateHandlePosition = () => {
            const { selection } = editorView.state;
            const { $from } = selection;
            
            // 找到当前块级节点
            let depth = $from.depth;
            while (depth > 0) {
              const node = $from.node(depth);
              if (node.isBlock && node.type.name !== 'doc') {
                const pos = $from.before(depth);
                const coords = editorView.coordsAtPos(pos);
                const editorRect = editorView.dom.getBoundingClientRect();
                
                // 更新位置
                const leftPosition = editorRect.left + 8;
                const topPosition = coords.top;
                
                dragHandle.style.left = `${leftPosition}px`;
                dragHandle.style.top = `${topPosition}px`;
                dragHandle.style.opacity = '0.6';
                
                return;
              }
              depth--;
            }
            
            // 如果没有找到块级节点，保持在顶部但半透明
            dragHandle.style.opacity = '0.3';
          };

          // 监听鼠标移动和点击
          editorView.dom.addEventListener('mousemove', updateHandlePosition);
          editorView.dom.addEventListener('click', updateHandlePosition);
          editorView.dom.addEventListener('keyup', updateHandlePosition);
          editorView.dom.addEventListener('input', updateHandlePosition);
          
          // 初始化位置
          setTimeout(updateHandlePosition, 100);

          return {
            update(view, prevState) {
              // 选区变化或文档变化时更新位置
              if (view.state.selection !== prevState.selection || view.state.doc !== prevState.doc) {
                requestAnimationFrame(() => {
                  updateHandlePosition();
                  setTimeout(updateHandlePosition, 0);
                });
              }
            },
            destroy() {
              dragHandle.remove();
            },
          };
        },
      }),
    ];
  },
});

export default DragHandle;
