import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

/**
 * 块类型指示器扩展
 * 为每个块级节点添加飞书风格的类型图标和拖拽手柄
 */
export const BlockHandleExtension = Extension.create({
  name: 'blockHandle',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('blockHandle'),
        
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];

            doc.descendants((node, pos) => {
              // 只处理块级节点
              if (!node.isBlock || node.type.name === 'doc') {
                return;
              }

              // 为每个块级节点添加类名装饰
              decorations.push(
                Decoration.node(pos, pos + node.nodeSize, {
                  class: 'has-block-handle',
                  'data-block-type': node.type.name,
                  'data-block-attrs': JSON.stringify(node.attrs)
                })
              );
            });

            return DecorationSet.create(doc, decorations);
          }
        }
      })
    ];
  },

  addGlobalAttributes() {
    return [
      {
        types: [
          'paragraph',
          'heading',
          'bulletList',
          'orderedList',
          'blockquote',
          'codeBlock'
        ],
        attributes: {
          blockHandle: {
            default: true,
            parseHTML: element => element.hasAttribute('data-block-handle'),
            renderHTML: attributes => {
              if (!attributes.blockHandle) {
                return {};
              }
              return {
                'data-block-handle': 'true'
              };
            }
          }
        }
      }
    ];
  }
});
