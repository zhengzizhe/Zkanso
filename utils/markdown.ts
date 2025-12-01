import TurndownService from 'turndown';
import MarkdownIt from 'markdown-it';
import { Editor } from '@tiptap/react';

/**
 * 将编辑器内容导出为 Markdown
 */
export function exportToMarkdown(editor: Editor): string {
  const html = editor.getHTML();
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    bulletListMarker: '-',
  });

  // 自定义规则：任务列表
  turndownService.addRule('taskList', {
    filter: (node) => {
      return (
        node.nodeName === 'LI' &&
        node.parentNode?.nodeName === 'UL' &&
        (node.parentNode as HTMLElement).getAttribute('data-type') === 'taskList'
      );
    },
    replacement: (content, node) => {
      const checkbox = (node as HTMLElement).querySelector('input[type="checkbox"]');
      const checked = checkbox?.hasAttribute('checked') ? 'x' : ' ';
      return `- [${checked}] ${content}\n`;
    },
  });

  // 自定义规则：YouTube 视频
  turndownService.addRule('youtube', {
    filter: (node) => {
      return (
        node.nodeName === 'DIV' &&
        (node as HTMLElement).getAttribute('data-youtube-video') !== null
      );
    },
    replacement: (content, node) => {
      const iframe = (node as HTMLElement).querySelector('iframe');
      const src = iframe?.getAttribute('src') || '';
      return `\n[YouTube Video](${src})\n\n`;
    },
  });

  // 自定义规则：提示框 (Callout)
  turndownService.addRule('callout', {
    filter: (node) => {
      return (
        node.nodeName === 'DIV' &&
        (node as HTMLElement).classList.contains('callout-wrapper')
      );
    },
    replacement: (content, node) => {
      const type = (node as HTMLElement).getAttribute('data-type') || 'info';
      const icon = {
        info: 'ℹ️',
        warning: '⚠️',
        success: '✅',
        error: '❌',
      }[type] || 'ℹ️';
      return `
> ${icon} **${type.toUpperCase()}**
> ${content}

`;
    },
  });

  return turndownService.turndown(html);
}

/**
 * 从 Markdown 导入内容到编辑器
 */
export function importFromMarkdown(editor: Editor, markdown: string): void {
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
  });

  const html = md.render(markdown);
  editor.commands.setContent(html);
}

/**
 * 下载为 Markdown 文件
 */
export function downloadMarkdown(editor: Editor, filename: string = 'document.md'): void {
  const markdown = exportToMarkdown(editor);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 从文件读取 Markdown
 */
export function uploadMarkdown(
  editor: Editor,
  onComplete?: () => void,
  onError?: (error: Error) => void
): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.md,.markdown';

  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const markdown = event.target?.result as string;
        importFromMarkdown(editor, markdown);
        onComplete?.();
      } catch (error) {
        onError?.(error as Error);
      }
    };

    reader.onerror = () => {
      onError?.(new Error('文件读取失败'));
    };

    reader.readAsText(file);
  };

  input.click();
}

/**
 * 复制为 Markdown 到剪贴板
 */
export async function copyAsMarkdown(editor: Editor): Promise<void> {
  const markdown = exportToMarkdown(editor);
  
  try {
    await navigator.clipboard.writeText(markdown);
  } catch (error) {
    // 降级方案
    const textarea = document.createElement('textarea');
    textarea.value = markdown;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
}
