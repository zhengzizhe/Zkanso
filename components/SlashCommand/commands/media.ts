import { Image, Video, Music, Paperclip, Table, Globe } from 'lucide-react';
import { SlashCommand, CommandCategoryEnum, CommandPriority } from '../types';

/**
 * 媒体命令
 * P0: 图片、表格
 * P1: 视频、音频、文件、嵌入
 */
export const mediaCommands: SlashCommand[] = [
  // P0 命令
  {
    id: 'image',
    title: '图片',
    description: '插入图片',
    icon: Image,
    keywords: ['img', 'image', 'photo', 'picture', '图片', '照片', '图像'],
    category: CommandCategoryEnum.Media,
    priority: CommandPriority.P0,
    action: (editor, range) => {
      const url = window.prompt('输入图片URL:');
      if (url) {
        if (range) {
          editor.chain().focus().deleteRange(range).insertContent(`<img src="${url}" alt="图片" />`).run();
        } else {
          editor.chain().focus().insertContent(`<img src="${url}" alt="图片" />`).run();
        }
      } else if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
    isEnabled: () => true,
  },
  
  {
    id: 'table',
    title: '表格',
    description: '插入表格 (3x3)',
    icon: Table,
    keywords: ['table', 'grid', '表格', '表'],
    category: CommandCategoryEnum.Media,
    priority: CommandPriority.P0,
    action: (editor, range) => {
      if (range) {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent('<table><tr><th>1</th><th>2</th><th>3</th></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>')
          .run();
      } else {
        editor
          .chain()
          .focus()
          .insertContent('<table><tr><th>1</th><th>2</th><th>3</th></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></table>')
          .run();
      }
    },
    isEnabled: () => true,
  },
  
  // P1 命令
  {
    id: 'video',
    title: '视频',
    description: '嵌入视频 (YouTube, Vimeo, MP4)',
    icon: Video,
    keywords: ['video', 'movie', 'mp4', 'youtube', '视频', '影片'],
    category: CommandCategoryEnum.Media,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      const url = window.prompt('输入视频URL:');
      if (url) {
        // 需要视频扩展支持
        console.log('插入视频:', url);
        if (range) {
          editor.chain().focus().deleteRange(range).run();
        }
      } else if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'audio',
    title: '音频',
    description: '插入音频文件',
    icon: Music,
    keywords: ['audio', 'sound', 'music', 'mp3', '音频', '音乐', '声音'],
    category: CommandCategoryEnum.Media,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      const url = window.prompt('输入音频URL:');
      if (url) {
        console.log('插入音频:', url);
        if (range) {
          editor.chain().focus().deleteRange(range).run();
        }
      } else if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'file',
    title: '文件附件',
    description: '上传文件附件',
    icon: Paperclip,
    keywords: ['file', 'attach', 'upload', 'attachment', '文件', '附件', '上传'],
    category: CommandCategoryEnum.Media,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      console.log('上传文件功能待实现');
      if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
  
  {
    id: 'embed',
    title: '嵌入网页',
    description: 'iFrame 嵌入外部内容',
    icon: Globe,
    keywords: ['embed', 'iframe', 'external', '嵌入', '外链', '网页'],
    category: CommandCategoryEnum.Media,
    priority: CommandPriority.P1,
    action: (editor, range) => {
      const url = window.prompt('输入嵌入URL:');
      if (url) {
        console.log('嵌入网页:', url);
        if (range) {
          editor.chain().focus().deleteRange(range).run();
        }
      } else if (range) {
        editor.chain().focus().deleteRange(range).run();
      }
    },
  },
];
