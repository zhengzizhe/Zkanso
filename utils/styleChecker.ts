/**
 * 样式问题检测工具
 * 自动检测 Markdown 渲染中的样式问题
 */

import { Editor } from '@tiptap/react';

export interface StyleIssue {
  category: string;
  element: string;
  issue: string;
  severity: 'critical' | 'warning' | 'minor';
  solution?: string;
}

export class StyleChecker {
  private editor: Editor;
  private issues: StyleIssue[] = [];

  constructor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * 运行所有样式检查
   */
  runAllChecks(): StyleIssue[] {
    this.issues = [];

    this.checkHeadingStyles();
    this.checkTextStyles();
    this.checkListStyles();
    this.checkCodeBlockStyles();
    this.checkTableStyles();
    this.checkLinkStyles();
    this.checkBlockquoteStyles();
    this.checkSpacing();
    this.checkColors();
    this.checkResponsiveness();

    return this.issues;
  }

  /**
   * 检查标题样式
   */
  private checkHeadingStyles(): void {
    const headings = this.editor.view.dom.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    headings.forEach((heading) => {
      const style = window.getComputedStyle(heading);
      
      // 检查字体大小是否区分明显
      const fontSize = parseFloat(style.fontSize);
      if (fontSize < 16) {
        this.issues.push({
          category: '标题',
          element: heading.tagName,
          issue: `字体过小 (${fontSize}px)`,
          severity: 'warning',
          solution: '建议 H6 至少 16px, H1 至少 32px'
        });
      }

      // 检查行高
      const lineHeight = parseFloat(style.lineHeight);
      if (lineHeight / fontSize < 1.2) {
        this.issues.push({
          category: '标题',
          element: heading.tagName,
          issue: '行高过小，可能导致文字拥挤',
          severity: 'minor',
          solution: '建议行高至少为字体大小的 1.2 倍'
        });
      }

      // 检查上下边距
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);
      if (marginTop < 12 || marginBottom < 8) {
        this.issues.push({
          category: '标题',
          element: heading.tagName,
          issue: '上下边距不足，段落间距过小',
          severity: 'minor',
          solution: '建议上边距 16px+，下边距 8px+'
        });
      }
    });
  }

  /**
   * 检查文本样式
   */
  private checkTextStyles(): void {
    const paragraphs = this.editor.view.dom.querySelectorAll('p');
    
    paragraphs.forEach((p, index) => {
      const style = window.getComputedStyle(p);
      
      // 检查字体大小
      const fontSize = parseFloat(style.fontSize);
      if (fontSize < 14) {
        this.issues.push({
          category: '段落',
          element: `p[${index}]`,
          issue: `正文字体过小 (${fontSize}px)`,
          severity: 'warning',
          solution: '建议正文字体至少 14px'
        });
      }

      // 检查行高
      const lineHeight = parseFloat(style.lineHeight);
      if (lineHeight / fontSize < 1.5) {
        this.issues.push({
          category: '段落',
          element: `p[${index}]`,
          issue: '行高不足，阅读体验差',
          severity: 'warning',
          solution: '建议行高为字体大小的 1.5-1.8 倍'
        });
      }

      // 检查行长度
      const width = p.offsetWidth;
      if (width > 800) {
        this.issues.push({
          category: '段落',
          element: `p[${index}]`,
          issue: `行宽过长 (${width}px)，不利于阅读`,
          severity: 'minor',
          solution: '建议最大宽度 700-800px'
        });
      }
    });

    // 检查加粗文本
    const bolds = this.editor.view.dom.querySelectorAll('strong, b');
    if (bolds.length > 0) {
      const style = window.getComputedStyle(bolds[0]);
      const fontWeight = style.fontWeight;
      if (parseInt(fontWeight) < 600) {
        this.issues.push({
          category: '文本格式',
          element: 'strong',
          issue: '加粗效果不明显',
          severity: 'minor',
          solution: '建议 font-weight: 600 或更高'
        });
      }
    }

    // 检查高亮文本
    const marks = this.editor.view.dom.querySelectorAll('mark');
    marks.forEach((mark) => {
      const style = window.getComputedStyle(mark);
      const bgColor = style.backgroundColor;
      const color = style.color;
      
      // 检查对比度
      if (this.isLowContrast(bgColor, color)) {
        this.issues.push({
          category: '文本格式',
          element: 'mark',
          issue: '高亮文本对比度不足',
          severity: 'warning',
          solution: '增加背景色和文字色的对比度'
        });
      }
    });
  }

  /**
   * 检查列表样式
   */
  private checkListStyles(): void {
    const lists = this.editor.view.dom.querySelectorAll('ul, ol');
    
    lists.forEach((list, index) => {
      const style = window.getComputedStyle(list);
      
      // 检查缩进
      const paddingLeft = parseFloat(style.paddingLeft);
      if (paddingLeft < 20) {
        this.issues.push({
          category: '列表',
          element: list.tagName,
          issue: `左侧缩进不足 (${paddingLeft}px)`,
          severity: 'minor',
          solution: '建议左侧内边距至少 24px'
        });
      }

      // 检查列表项间距
      const items = list.querySelectorAll(':scope > li');
      if (items.length > 1) {
        const firstItem = items[0] as HTMLElement;
        const secondItem = items[1] as HTMLElement;
        const gap = secondItem.offsetTop - (firstItem.offsetTop + firstItem.offsetHeight);
        
        if (gap < 4) {
          this.issues.push({
            category: '列表',
            element: `${list.tagName} > li`,
            issue: '列表项间距过小',
            severity: 'minor',
            solution: '建议列表项之间至少 4px 间距'
          });
        }
      }
    });

    // 检查任务列表 - 重点检查布局
    const taskLists = this.editor.view.dom.querySelectorAll('[data-type="taskList"]');
    taskLists.forEach((taskList, index) => {
      const items = taskList.querySelectorAll('li');
      
      items.forEach((item, itemIndex) => {
        const itemStyle = window.getComputedStyle(item as HTMLElement);
        const display = itemStyle.display;
        const position = itemStyle.position;
        
        // 检查任务项是否使用了正确的布局
        if (display === 'flex') {
          this.issues.push({
            category: '任务列表',
            element: `taskItem[${itemIndex}]`,
            issue: '使用 flex 布局可能导致复选框和文字挤在一起',
            severity: 'warning',
            solution: '建议使用 display: block + position: relative，复选框用 position: absolute'
          });
        }
        
        // 检查复选框
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox) {
          const checkboxStyle = window.getComputedStyle(checkbox as HTMLElement);
          const cbPosition = checkboxStyle.position;
          const cbSize = (checkbox as HTMLElement).offsetWidth;
          
          // 检查复选框定位
          if (cbPosition !== 'absolute') {
            this.issues.push({
              category: '任务列表',
              element: 'checkbox',
              issue: '复选框未使用绝对定位，位置可能不稳定',
              severity: 'warning',
              solution: '建议使用 position: absolute 固定复选框位置'
            });
          }
          
          // 检查复选框大小
          if (cbSize < 16) {
            this.issues.push({
              category: '任务列表',
              element: 'checkbox',
              issue: `复选框过小 (${cbSize}px)`,
              severity: 'warning',
              solution: '建议复选框至少 18x18px'
            });
          }
          
          // 检查复选框是否可点击
          const cursor = checkboxStyle.cursor;
          if (cursor !== 'pointer') {
            this.issues.push({
              category: '任务列表',
              element: 'checkbox',
              issue: '复选框缺少指针样式',
              severity: 'minor',
              solution: '设置 cursor: pointer 提升可用性'
            });
          }
        }
        
        // 检查任务项内容区域
        const label = item.querySelector('label');
        if (label) {
          const labelStyle = window.getComputedStyle(label);
          const labelDisplay = labelStyle.display;
          
          if (labelDisplay === 'flex') {
            this.issues.push({
              category: '任务列表',
              element: 'label',
              issue: 'label 使用 flex 可能导致多行文本对齐问题',
              severity: 'warning',
              solution: '建议 label 使用 display: block'
            });
          }
        }
      });
    });
  }

  /**
   * 检查代码块样式
   */
  private checkCodeBlockStyles(): void {
    const codeBlocks = this.editor.view.dom.querySelectorAll('pre code');
    
    codeBlocks.forEach((block, index) => {
      const pre = block.parentElement;
      if (!pre) return;

      const style = window.getComputedStyle(pre);
      
      // 检查背景色 - 用户期望：代码块醒目，与正文区分
      const bgColor = style.backgroundColor;
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: '缺少背景色，代码块不明显，用户难以识别',
          severity: 'warning',
          solution: '添加深色背景 (#f5f5f5 或 #1e1e1e)'
        });
      }

      // 检查内边距 - 用户期望：代码不贴边
      const padding = parseFloat(style.padding);
      if (padding < 12) {
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: `内边距不足 (${padding}px)，代码贴边拥挤`,
          severity: 'minor',
          solution: '建议内边距至少 12-16px'
        });
      }

      // 检查圆角 - 用户期望：现代感
      const borderRadius = parseFloat(style.borderRadius);
      if (borderRadius === 0) {
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: '缺少圆角，显得生硬老旧',
          severity: 'minor',
          solution: '添加 6-8px 圆角提升现代感'
        });
      }

      // 检查字体 - 用户期望：等宽字体，代码对齐
      const fontFamily = style.fontFamily;
      if (!fontFamily.includes('mono') && !fontFamily.includes('Consolas') && !fontFamily.includes('Monaco') && !fontFamily.includes('Fira') && !fontFamily.includes('Courier')) {
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: '未使用等宽字体，代码对齐混乱，难以阅读',
          severity: 'warning',
          solution: '使用等宽字体如 "Fira Code", "Monaco", "Consolas"'
        });
      }
      
      // 检查字体大小 - 用户期望：适中，不过小
      const fontSize = parseFloat(style.fontSize);
      if (fontSize < 13) {
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: `代码字体过小 (${fontSize}px)，难以阅读`,
          severity: 'minor',
          solution: '建议代码字体至少 13-14px'
        });
      }

      // 检查语法高亮 - 用户期望：彩色代码，易于理解
      const hasHighlight = block.querySelector('.hljs, [class*="token"], [class*="keyword"], [class*="string"]');
      const codeText = block.textContent || '';
      const hasCode = codeText.length > 20;
      
      if (!hasHighlight && hasCode) {
        // 检查是否有明显的语言标识
        const language = pre.getAttribute('data-language') || 
                        block.className.match(/language-(\w+)/)?.[1];
        
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: language ? 
                 `缺少语法高亮（语言: ${language}），用户难以分辨关键字` : 
                 '缺少语法高亮，用户难以阅读',
          severity: 'warning',
          solution: '启用语法高亮插件（如 highlight.js 或 Prism）'
        });
      }
      
      // 检查横向滚动 - 用户期望：长代码可滚动
      const overflow = style.overflowX;
      if (overflow === 'visible' && pre.scrollWidth > pre.clientWidth) {
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: '代码过长但无滚动，用户看不到完整内容',
          severity: 'warning',
          solution: '设置 overflow-x: auto 允许横向滚动'
        });
      }
      
      // 检查行高 - 用户期望：代码不拥挤
      const lineHeight = parseFloat(style.lineHeight);
      if (lineHeight / fontSize < 1.4) {
        this.issues.push({
          category: '代码块',
          element: `pre[${index}]`,
          issue: '代码行高过小，代码拥挤难读',
          severity: 'minor',
          solution: '建议行高为字体大小的 1.5-1.6 倍'
        });
      }
    });

    // 检查行内代码 - 用户期望：与正文区分
    const inlineCodes = this.editor.view.dom.querySelectorAll('p code, li code, td code');
    inlineCodes.forEach((code, index) => {
      const style = window.getComputedStyle(code);
      const bgColor = style.backgroundColor;
      
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        this.issues.push({
          category: '行内代码',
          element: `code[${index}]`,
          issue: '缺少背景色，与正文无区分，用户难以识别',
          severity: 'minor',
          solution: '添加浅色背景（如 #f0f0f0）和小圆角'
        });
      }
      
      // 检查内边距
      const padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      if (padding < 4) {
        this.issues.push({
          category: '行内代码',
          element: `code[${index}]`,
          issue: '缺少内边距，代码贴边',
          severity: 'minor',
          solution: '添加水平内边距 2-4px'
        });
      }
    });
  }

  /**
   * 检查表格样式
   */
  private checkTableStyles(): void {
    const tables = this.editor.view.dom.querySelectorAll('table');
    
    tables.forEach((table, index) => {
      const style = window.getComputedStyle(table);
      
      // 检查边框 - 用户期望：清晰的单元格分隔
      const borderWidth = parseFloat(style.borderWidth);
      if (borderWidth === 0) {
        this.issues.push({
          category: '表格',
          element: `table[${index}]`,
          issue: '缺少边框，单元格边界不清晰，用户难以阅读',
          severity: 'warning',
          solution: '添加边框或使用 border-collapse: collapse'
        });
      }

      // 检查单元格内边距 - 用户期望：内容不挤压
      const cells = table.querySelectorAll('td, th');
      if (cells.length > 0) {
        const cellStyle = window.getComputedStyle(cells[0]);
        const padding = parseFloat(cellStyle.padding);
        
        if (padding < 8) {
          this.issues.push({
            category: '表格',
            element: 'td/th',
            issue: `单元格内边距不足 (${padding}px)，内容拥挤难看`,
            severity: 'minor',
            solution: '建议单元格内边距至少 8-12px'
          });
        }
        
        // 检查单元格最小宽度 - 用户期望：内容不被挤压
        const cellWidth = (cells[0] as HTMLElement).offsetWidth;
        if (cellWidth < 60) {
          this.issues.push({
            category: '表格',
            element: 'td/th',
            issue: `单元格过窄 (${cellWidth}px)，内容可能被截断`,
            severity: 'minor',
            solution: '设置最小宽度或使用 table-layout: auto'
          });
        }
      }

      // 检查表头样式 - 用户期望：表头醒目突出
      const headers = table.querySelectorAll('th');
      if (headers.length > 0) {
        const headerStyle = window.getComputedStyle(headers[0]);
        const fontWeight = parseInt(headerStyle.fontWeight);
        const bgColor = headerStyle.backgroundColor;
        const textAlign = headerStyle.textAlign;
        
        if (fontWeight < 600 && (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent')) {
          this.issues.push({
            category: '表格',
            element: 'th',
            issue: '表头不够突出（无加粗且无背景色），用户难以识别',
            severity: 'warning',
            solution: '表头应加粗（font-weight: 600）或使用背景色区分'
          });
        }
        
        // 检查表头对齐
        if (textAlign === 'start' || textAlign === 'left') {
          this.issues.push({
            category: '表格',
            element: 'th',
            issue: '表头文字左对齐，建议居中对齐更美观',
            severity: 'minor',
            solution: '设置 text-align: center 提升视觉效果'
          });
        }
      }

      // 检查宽度 - 用户期望：不需要横向滚动
      const width = table.offsetWidth;
      const containerWidth = this.editor.view.dom.offsetWidth;
      if (width > containerWidth) {
        this.issues.push({
          category: '表格',
          element: `table[${index}]`,
          issue: `表格超出容器宽度 (${width}px > ${containerWidth}px)，用户需要横向滚动`,
          severity: 'warning',
          solution: '添加 overflow-x: auto 的包裹容器或使用响应式表格'
        });
      }
      
      // 检查行高 - 用户期望：不拥挤
      const rows = table.querySelectorAll('tr');
      if (rows.length > 1) {
        const rowStyle = window.getComputedStyle(rows[0]);
        const lineHeight = parseFloat(rowStyle.lineHeight);
        const fontSize = parseFloat(rowStyle.fontSize);
        
        if (lineHeight / fontSize < 1.4) {
          this.issues.push({
            category: '表格',
            element: 'tr',
            issue: '表格行高过小，内容拥挤',
            severity: 'minor',
            solution: '建议行高至少为字体大小的 1.5 倍'
          });
        }
      }
      
      // 检查悬停效果 - 用户期望：交互反馈
      // 注意：这个需要在实际交互时检测，这里只检查是否有 hover 样式定义
      const hasHoverStyle = table.classList.contains('hover-enabled') || 
                           table.classList.contains('interactive');
      if (!hasHoverStyle && rows.length > 3) {
        this.issues.push({
          category: '表格',
          element: `table[${index}]`,
          issue: '缺少行悬停效果，用户难以追踪当前行',
          severity: 'minor',
          solution: '添加 tr:hover 样式改善交互体验'
        });
      }
    });
  }

  /**
   * 检查链接样式
   */
  private checkLinkStyles(): void {
    const links = this.editor.view.dom.querySelectorAll('a');
    
    links.forEach((link) => {
      const style = window.getComputedStyle(link);
      
      // 检查颜色
      const color = style.color;
      const parentColor = window.getComputedStyle(link.parentElement!).color;
      
      if (color === parentColor) {
        this.issues.push({
          category: '链接',
          element: 'a',
          issue: '链接颜色与正文相同，不易识别',
          severity: 'warning',
          solution: '使用蓝色系（如 #0066cc）区分链接'
        });
      }

      // 检查下划线
      const textDecoration = style.textDecoration;
      if (!textDecoration.includes('underline')) {
        this.issues.push({
          category: '链接',
          element: 'a',
          issue: '链接缺少下划线，可能不易识别',
          severity: 'minor',
          solution: '添加下划线或悬停效果'
        });
      }

      // 检查鼠标样式
      const cursor = style.cursor;
      if (cursor !== 'pointer') {
        this.issues.push({
          category: '链接',
          element: 'a',
          issue: '鼠标样式不是指针',
          severity: 'minor',
          solution: '设置 cursor: pointer'
        });
      }
    });
  }

  /**
   * 检查引用块样式
   */
  private checkBlockquoteStyles(): void {
    const blockquotes = this.editor.view.dom.querySelectorAll('blockquote');
    
    blockquotes.forEach((blockquote, index) => {
      const style = window.getComputedStyle(blockquote);
      
      // 检查左边框 - 用户期望：明显的左侧标识
      const borderLeft = style.borderLeftWidth;
      const borderLeftColor = style.borderLeftColor;
      if (parseFloat(borderLeft) < 2) {
        this.issues.push({
          category: '引用块',
          element: `blockquote[${index}]`,
          issue: '缺少左侧边框，引用不明显，用户难以区分',
          severity: 'warning',
          solution: '添加 3-4px 的左侧彩色边框（如 #6366f1）'
        });
      }
      
      // 检查边框颜色是否明显
      if (borderLeftColor === 'rgb(0, 0, 0)' || borderLeftColor === 'rgba(0, 0, 0, 0)') {
        this.issues.push({
          category: '引用块',
          element: `blockquote[${index}]`,
          issue: '左侧边框颜色不明显',
          severity: 'minor',
          solution: '使用彩色边框（蓝色/紫色）提升视觉识别度'
        });
      }

      // 检查内边距 - 用户期望：内容不贴边
      const paddingLeft = parseFloat(style.paddingLeft);
      if (paddingLeft < 12) {
        this.issues.push({
          category: '引用块',
          element: `blockquote[${index}]`,
          issue: `左侧内边距不足 (${paddingLeft}px)，内容贴边难看`,
          severity: 'minor',
          solution: '建议左侧内边距 16-20px'
        });
      }

      // 检查背景色 - 用户期望：与正文有区分
      const bgColor = style.backgroundColor;
      if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
        this.issues.push({
          category: '引用块',
          element: `blockquote[${index}]`,
          issue: '缺少背景色，引用区域不够突出',
          severity: 'minor',
          solution: '添加浅色背景（如 rgba(99, 102, 241, 0.05)）'
        });
      }
      
      // 检查圆角 - 用户期望：现代感
      const borderRadius = parseFloat(style.borderRadius);
      if (borderRadius === 0) {
        this.issues.push({
          category: '引用块',
          element: `blockquote[${index}]`,
          issue: '缺少圆角，显得生硬老旧',
          severity: 'minor',
          solution: '添加 6-8px 圆角提升现代感'
        });
      }
      
      // 检查嵌套引用的视觉层次
      const nestedQuotes = blockquote.querySelectorAll('blockquote');
      if (nestedQuotes.length > 0) {
        nestedQuotes.forEach((nested, nestedIndex) => {
          const nestedStyle = window.getComputedStyle(nested);
          const nestedBorderLeft = nestedStyle.borderLeftWidth;
          const parentBorderLeft = style.borderLeftWidth;
          
          if (nestedBorderLeft === parentBorderLeft) {
            this.issues.push({
              category: '引用块',
              element: `blockquote 嵌套[${nestedIndex}]`,
              issue: '嵌套引用没有视觉区分，用户分不清层级',
              severity: 'warning',
              solution: '嵌套引用应该有不同的左边框颜色或宽度'
            });
          }
        });
      }
    });
  }

  /**
   * 检查间距
   */
  private checkSpacing(): void {
    const editor = this.editor.view.dom;
    const style = window.getComputedStyle(editor);
    
    // 检查编辑器内边距
    const padding = parseFloat(style.padding);
    if (padding < 16) {
      this.issues.push({
        category: '布局',
        element: 'editor',
        issue: `编辑器内边距不足 (${padding}px)`,
        severity: 'minor',
        solution: '建议编辑器四周至少 20-30px 内边距'
      });
    }

    // 检查段落间距
    const paragraphs = editor.querySelectorAll('p');
    if (paragraphs.length > 1) {
      for (let i = 0; i < paragraphs.length - 1; i++) {
        const current = paragraphs[i] as HTMLElement;
        const next = paragraphs[i + 1] as HTMLElement;
        const gap = next.offsetTop - (current.offsetTop + current.offsetHeight);
        
        if (gap < 8) {
          this.issues.push({
            category: '布局',
            element: 'p',
            issue: `段落间距过小 (${gap}px)`,
            severity: 'minor',
            solution: '建议段落间距至少 12-16px'
          });
          break; // 只报告一次
        }
      }
    }
  }

  /**
   * 检查颜色
   */
  private checkColors(): void {
    const editor = this.editor.view.dom;
    const style = window.getComputedStyle(editor);
    
    // 检查背景色
    const bgColor = style.backgroundColor;
    const textColor = style.color;
    
    if (this.isLowContrast(bgColor, textColor)) {
      this.issues.push({
        category: '颜色',
        element: 'editor',
        issue: '文字与背景对比度不足',
        severity: 'critical',
        solution: '确保文字和背景的对比度至少 4.5:1'
      });
    }
  }

  /**
   * 检查响应式
   */
  private checkResponsiveness(): void {
    const editor = this.editor.view.dom;
    const width = editor.offsetWidth;
    
    if (width < 320) {
      this.issues.push({
        category: '响应式',
        element: 'editor',
        issue: '编辑器宽度过小，移动端体验差',
        severity: 'warning',
        solution: '确保编辑器在小屏幕上至少 320px 宽'
      });
    }

    // 检查固定宽度元素
    const tables = editor.querySelectorAll('table');
    const codeBlocks = editor.querySelectorAll('pre');
    
    [...tables, ...codeBlocks].forEach((element) => {
      if (element.scrollWidth > element.clientWidth) {
        this.issues.push({
          category: '响应式',
          element: element.tagName.toLowerCase(),
          issue: '内容溢出，需要横向滚动',
          severity: 'warning',
          solution: '添加响应式处理或横向滚动容器'
        });
      }
    });
  }

  /**
   * 检查颜色对比度是否过低
   */
  private isLowContrast(color1: string, color2: string): boolean {
    // 简化的对比度检查
    const rgb1 = this.parseColor(color1);
    const rgb2 = this.parseColor(color2);
    
    if (!rgb1 || !rgb2) return false;
    
    const luminance1 = this.getLuminance(rgb1);
    const luminance2 = this.getLuminance(rgb2);
    
    const contrast = (Math.max(luminance1, luminance2) + 0.05) / (Math.min(luminance1, luminance2) + 0.05);
    
    return contrast < 4.5;
  }

  /**
   * 解析颜色字符串为 RGB
   */
  private parseColor(color: string): [number, number, number] | null {
    const rgb = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgb) {
      return [parseInt(rgb[1]), parseInt(rgb[2]), parseInt(rgb[3])];
    }
    return null;
  }

  /**
   * 计算相对亮度
   */
  private getLuminance([r, g, b]: [number, number, number]): number {
    const [rs, gs, bs] = [r, g, b].map(val => {
      val = val / 255;
      return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * 生成报告
   */
  generateReport(): string {
    const grouped = this.groupIssues();
    let report = '# 样式问题检查报告\n\n';

    // 统计
    const critical = this.issues.filter(i => i.severity === 'critical').length;
    const warnings = this.issues.filter(i => i.severity === 'warning').length;
    const minor = this.issues.filter(i => i.severity === 'minor').length;

    report += `## 概览\n\n`;
    report += `- 🔴 严重问题：${critical} 个\n`;
    report += `- 🟡 警告：${warnings} 个\n`;
    report += `- 🔵 次要问题：${minor} 个\n`;
    report += `- **总计**：${this.issues.length} 个问题\n\n`;

    Object.entries(grouped).forEach(([category, issues]) => {
      report += `## ${category}\n\n`;
      
      issues.forEach(issue => {
        const icon = this.getSeverityIcon(issue.severity);
        report += `${icon} **${issue.element}**: ${issue.issue}\n`;
        if (issue.solution) {
          report += `   💡 解决方案：${issue.solution}\n`;
        }
        report += '\n';
      });
    });

    return report;
  }

  /**
   * 分组问题
   */
  private groupIssues(): Record<string, StyleIssue[]> {
    const grouped: Record<string, StyleIssue[]> = {};

    this.issues.forEach(issue => {
      if (!grouped[issue.category]) {
        grouped[issue.category] = [];
      }
      grouped[issue.category].push(issue);
    });

    return grouped;
  }

  /**
   * 获取严重程度图标
   */
  private getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'critical': return '🔴';
      case 'warning': return '🟡';
      case 'minor': return '🔵';
      default: return '⚪';
    }
  }
}
