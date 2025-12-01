import React, { useState } from 'react';
import { Editor } from '@tiptap/react';
import { FloatingToolbar as ToolbarContainer } from './FloatingToolbar';
import { TextFormatGroup } from './TextFormatGroup';
import { ColorPicker } from './ColorPicker';
import { LinkEditor } from './LinkEditor';
import { ToolbarDivider } from './ToolbarDivider';
import { ToolbarButton } from './ToolbarButton';
import {
  Code,
  Link as LinkIcon,
  Sigma,
  MoreHorizontal,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Subscript as SubIcon,
  Superscript as SuperIcon,
  Table,
  Image as ImageIcon,
  Youtube,
  ChevronDown,
} from 'lucide-react';

interface FloatingToolbarProps {
  editor: Editor | null;
  theme?: 'feishu' | 'craft';
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({ editor, theme = 'feishu' }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  
  if (!editor) return null;

  return (
    <ToolbarContainer editor={editor} theme={theme}>
      {/* 文字格式组: B I U S */}
      <TextFormatGroup editor={editor} theme={theme} />
      
      <ToolbarDivider theme={theme} />

      {/* 代码 */}
      <ToolbarButton
        icon={<Code size={16} strokeWidth={2.5} />}
        label="代码"
        onClick={() => editor.chain().focus().toggleCode().run()}
        isActive={editor.isActive('code')}
        theme={theme}
      />
      
      {/* 链接 */}
      <LinkEditor editor={editor} theme={theme} />
      
      <ToolbarDivider theme={theme} />
      
      {/* 数学公式 */}
      <ToolbarButton
        icon={<Sigma size={16} strokeWidth={2.5} />}
        label="公式"
        onClick={() => {
          const latex = window.prompt('请输入LaTeX公式:');
          if (latex) {
            editor.chain().focus().insertContent({
              type: 'displayMath',
              attrs: { value: latex },
            }).run();
          }
        }}
        theme={theme}
      />
      
      {/* 颜色 */}
      <ColorPicker editor={editor} theme={theme} />
      
      <ToolbarDivider theme={theme} />
      
      {/* 更多 - 带下拉菜单 */}
      <div className="relative">
        <ToolbarButton
          icon={<MoreHorizontal size={16} strokeWidth={2.5} />}
          label="更多"
          onClick={() => setShowMoreMenu(!showMoreMenu)}
          isActive={showMoreMenu}
          theme={theme}
        />
        
        {/* 下拉菜单 */}
        {showMoreMenu && (
          <div 
            className="absolute top-full mt-2 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 min-w-[200px] z-50"
            onMouseLeave={() => setShowMoreMenu(false)}
          >
            {/* 标题 */}
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
              标题
            </div>
            <button
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <Heading1 className="w-4 h-4" />
              <span>一级标题</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <Heading2 className="w-4 h-4" />
              <span>二级标题</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <Heading3 className="w-4 h-4" />
              <span>三级标题</span>
            </button>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
            
            {/* 列表 */}
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
              列表
            </div>
            <button
              onClick={() => {
                editor.chain().focus().toggleBulletList().run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <List className="w-4 h-4" />
              <span>无序列表</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <ListOrdered className="w-4 h-4" />
              <span>有序列表</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleBlockquote().run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <Quote className="w-4 h-4" />
              <span>引用</span>
            </button>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
            
            {/* 对齐 */}
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
              对齐
            </div>
            <button
              onClick={() => {
                editor.chain().focus().setTextAlign('left').run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <AlignLeft className="w-4 h-4" />
              <span>左对齐</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().setTextAlign('center').run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <AlignCenter className="w-4 h-4" />
              <span>居中对齐</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().setTextAlign('right').run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <AlignRight className="w-4 h-4" />
              <span>右对齐</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().setTextAlign('justify').run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <AlignJustify className="w-4 h-4" />
              <span>两端对齐</span>
            </button>
            
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
            
            {/* 其他 */}
            <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase">
              其他
            </div>
            <button
              onClick={() => {
                editor.chain().focus().toggleSuperscript().run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <SuperIcon className="w-4 h-4" />
              <span>上标</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().toggleSubscript().run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <SubIcon className="w-4 h-4" />
              <span>下标</span>
            </button>
            <button
              onClick={() => {
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                setShowMoreMenu(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-left"
            >
              <Table className="w-4 h-4" />
              <span>插入表格</span>
            </button>
          </div>
        )}
      </div>
    </ToolbarContainer>
  );
};

// 导出子组件供外部使用
export { ToolbarButton } from './ToolbarButton';
export { ToolbarDivider } from './ToolbarDivider';
export { TextFormatGroup } from './TextFormatGroup';
export { ColorPicker } from './ColorPicker';
export { LinkEditor } from './LinkEditor';
