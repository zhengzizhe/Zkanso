import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState } from 'react';
import { File, Download, Trash2, FileText, FileImage, FileVideo, FileArchive } from 'lucide-react';

// 文件图标映射
const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <FileImage className="w-6 h-6 text-blue-500" />;
  if (type.startsWith('video/')) return <FileVideo className="w-6 h-6 text-purple-500" />;
  if (type.includes('zip') || type.includes('rar')) return <FileArchive className="w-6 h-6 text-orange-500" />;
  if (type.includes('text') || type.includes('document')) return <FileText className="w-6 h-6 text-green-500" />;
  return <File className="w-6 h-6 text-gray-500" />;
};

// 文件大小格式化
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// 文件卡片组件
const FileCard = ({ node, deleteNode }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const { name, size, type, url } = node.attrs;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
  };

  const handleDelete = () => {
    if (deleteNode) deleteNode();
  };

  return (
    <NodeViewWrapper>
      <div
        className="file-card my-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-4">
          {/* 文件图标 */}
          <div className="flex-shrink-0">
            {getFileIcon(type)}
          </div>

          {/* 文件信息 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatFileSize(size)} • {type}
            </p>
          </div>

          {/* 操作按钮 */}
          {isHovered && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="下载"
              >
                <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                title="删除"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </NodeViewWrapper>
  );
};

// 自定义文件节点
export const CustomFile = Node.create({
  name: 'customFile',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      name: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-name'),
        renderHTML: (attributes) => {
          return { 'data-name': attributes.name };
        },
      },
      size: {
        default: 0,
        parseHTML: (element) => parseInt(element.getAttribute('data-size') || '0'),
        renderHTML: (attributes) => {
          return { 'data-size': attributes.size };
        },
      },
      type: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-type'),
        renderHTML: (attributes) => {
          return { 'data-type': attributes.type };
        },
      },
      url: {
        default: '',
        parseHTML: (element) => element.getAttribute('data-url'),
        renderHTML: (attributes) => {
          return { 'data-url': attributes.url };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="custom-file"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'custom-file' })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileCard);
  },
});

export default CustomFile;
