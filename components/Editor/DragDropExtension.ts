import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { NodeSelection } from '@tiptap/pm/state';

export const DragDropExtension = Extension.create({
  name: 'dragDrop',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('dragDrop'),
        props: {
          handleDOMEvents: {
            dragstart(view, event) {
              const target = event.target as HTMLElement;
              const pos = view.posAtDOM(target, 0);
              
              if (pos !== null && pos !== undefined) {
                const $pos = view.state.doc.resolve(pos);
                const node = $pos.node($pos.depth);
                
                if (node) {
                  // 选中要拖拽的节点
                  const from = $pos.before($pos.depth);
                  const to = from + node.nodeSize;
                  const selection = NodeSelection.create(view.state.doc, from);
                  view.dispatch(view.state.tr.setSelection(selection));
                  
                  // 设置拖拽数据
                  const slice = view.state.selection.content();
                  const { dom, text } = view.someProp('clipboardSerializer')
                    ? { dom: document.createElement('div'), text: '' }
                    : { dom: document.createElement('div'), text: node.textContent };
                  
                  event.dataTransfer!.effectAllowed = 'move';
                  event.dataTransfer!.setData('text/html', dom.innerHTML);
                  event.dataTransfer!.setData('text/plain', text);
                  
                  console.log('🚀 拖拽开始:', { from, to, nodeType: node.type.name });
                }
              }
              return false;
            },
            
            drop(view, event) {
              event.preventDefault();
              
              const coords = { left: event.clientX, top: event.clientY };
              const pos = view.posAtCoords(coords);
              
              if (!pos) return false;
              
              const selection = view.state.selection;
              if (!(selection instanceof NodeSelection)) return false;
              
              const node = selection.node;
              const from = selection.from;
              
              let insertPos = pos.pos;
              const $pos = view.state.doc.resolve(insertPos);
              
              // 找到块级节点的位置
              if ($pos.depth > 0) {
                insertPos = $pos.before($pos.depth);
              }
              
              console.log('📍 放置位置:', { from, insertPos, nodeType: node.type.name });
              
              // 执行移动
              const tr = view.state.tr;
              
              // 删除原位置
              tr.delete(from, from + node.nodeSize);
              
              // 调整插入位置
              let finalPos = insertPos;
              if (from < insertPos) {
                finalPos = insertPos - node.nodeSize;
              }
              
              // 插入到新位置
              tr.insert(finalPos, node);
              
              view.dispatch(tr);
              console.log('✅ 移动完成:', { from, to: finalPos });
              
              return true;
            },
            
            dragover(view, event) {
              event.preventDefault();
              event.dataTransfer!.dropEffect = 'move';
              return false;
            },
          },
        },
      }),
    ];
  },
});
