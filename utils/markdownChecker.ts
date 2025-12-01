/**
 * Markdown 功能检查工具
 * 自动检测哪些功能未实现或样式有问题
 */

import { Editor } from '@tiptap/react';

export interface CheckResult {
  category: string;
  feature: string;
  status: 'supported' | 'partial' | 'missing' | 'style-issue';
  details: string;
}

export class MarkdownChecker {
  private editor: Editor;
  private results: CheckResult[] = [];

  constructor(editor: Editor) {
    this.editor = editor;
  }

  /**
   * 运行所有检查
   */
  runAllChecks(): CheckResult[] {
    this.results = [];

    this.checkHeadings();
    this.checkTextFormatting();
    this.checkLists();
    this.checkCodeBlocks();
    this.checkTables();
    this.checkLinks();
    this.checkImages();
    this.checkBlockquotes();
    this.checkAdvancedFeatures();
    this.checkMermaid();
    this.checkMath();
    this.checkEmoji();
    this.checkHTML();
    this.checkEdgeCases();

    return this.results;
  }

  /**
   * 检查标题
   */
  private checkHeadings(): void {
    const doc = this.editor.state.doc;
    let foundHeadings = new Set<number>();

    doc.descendants((node) => {
      if (node.type.name === 'heading') {
        foundHeadings.add(node.attrs.level);
      }
    });

    for (let level = 1; level <= 6; level++) {
      this.results.push({
        category: '标题',
        feature: `H${level} 标题`,
        status: foundHeadings.has(level) ? 'supported' : 'missing',
        details: foundHeadings.has(level) ? '已渲染' : '未找到'
      });
    }
  }

  /**
   * 检查文本格式
   */
  private checkTextFormatting(): void {
    const formats = [
      { name: '粗体', mark: 'bold' },
      { name: '斜体', mark: 'italic' },
      { name: '删除线', mark: 'strike' },
      { name: '下划线', mark: 'underline' },
      { name: '行内代码', mark: 'code' },
      { name: '高亮', mark: 'highlight' },
    ];

    formats.forEach(({ name, mark }) => {
      const hasFeature = !!this.editor.schema.marks[mark];
      this.results.push({
        category: '文本格式',
        feature: name,
        status: hasFeature ? 'supported' : 'missing',
        details: hasFeature ? '支持' : '不支持'
      });
    });
  }

  /**
   * 检查列表
   */
  private checkLists(): void {
    const lists = [
      { name: '无序列表', node: 'bulletList' },
      { name: '有序列表', node: 'orderedList' },
      { name: '任务列表', node: 'taskList' },
    ];

    lists.forEach(({ name, node }) => {
      const hasFeature = !!this.editor.schema.nodes[node];
      this.results.push({
        category: '列表',
        feature: name,
        status: hasFeature ? 'supported' : 'missing',
        details: hasFeature ? '支持' : '不支持'
      });
    });
  }

  /**
   * 检查代码块
   */
  private checkCodeBlocks(): void {
    const hasCodeBlock = !!this.editor.schema.nodes.codeBlock;
    
    this.results.push({
      category: '代码',
      feature: '代码块',
      status: hasCodeBlock ? 'supported' : 'missing',
      details: hasCodeBlock ? '支持' : '不支持'
    });

    // 检查语法高亮
    const codeBlocks = this.getNodesByType('codeBlock');
    const hasHighlight = codeBlocks.some(node => {
      const dom = this.editor.view.nodeDOM(node.pos) as HTMLElement | null;
      return dom?.querySelector?.('.hljs') !== null;
    });

    this.results.push({
      category: '代码',
      feature: '语法高亮',
      status: hasHighlight ? 'supported' : 'missing',
      details: hasHighlight ? '已启用' : '未启用'
    });
  }

  /**
   * 检查表格
   */
  private checkTables(): void {
    const hasTable = !!this.editor.schema.nodes.table;
    
    this.results.push({
      category: '表格',
      feature: '基础表格',
      status: hasTable ? 'supported' : 'missing',
      details: hasTable ? '支持' : '不支持'
    });

    if (hasTable) {
      // 检查表格对齐
      const tables = this.getNodesByType('table');
      const hasAlignment = tables.some(node => {
        const cells = [];
        node.node.descendants((cellNode) => {
          if (cellNode.type.name === 'tableCell' || cellNode.type.name === 'tableHeader') {
            cells.push(cellNode);
          }
        });
        return cells.some(cell => cell.attrs.textAlign);
      });

      this.results.push({
        category: '表格',
        feature: '表格对齐',
        status: hasAlignment ? 'supported' : 'partial',
        details: hasAlignment ? '支持' : '部分支持'
      });
    }
  }

  /**
   * 检查链接
   */
  private checkLinks(): void {
    const hasLink = !!this.editor.schema.marks.link;
    
    this.results.push({
      category: '链接',
      feature: '超链接',
      status: hasLink ? 'supported' : 'missing',
      details: hasLink ? '支持' : '不支持'
    });
  }

  /**
   * 检查图片
   */
  private checkImages(): void {
    const hasImage = !!this.editor.schema.nodes.customImage || !!this.editor.schema.nodes.image;
    
    this.results.push({
      category: '媒体',
      feature: '图片',
      status: hasImage ? 'supported' : 'missing',
      details: hasImage ? '支持' : '不支持'
    });

    const hasVideo = !!this.editor.schema.nodes.customVideo;
    this.results.push({
      category: '媒体',
      feature: '视频',
      status: hasVideo ? 'supported' : 'missing',
      details: hasVideo ? '支持' : '不支持'
    });
  }

  /**
   * 检查引用块
   */
  private checkBlockquotes(): void {
    const hasBlockquote = !!this.editor.schema.nodes.blockquote;
    
    this.results.push({
      category: '引用',
      feature: '引用块',
      status: hasBlockquote ? 'supported' : 'missing',
      details: hasBlockquote ? '支持' : '不支持'
    });

    // 检查嵌套引用
    const quotes = this.getNodesByType('blockquote');
    const hasNested = quotes.some(node => {
      let nested = false;
      node.node.descendants((child) => {
        if (child.type.name === 'blockquote') {
          nested = true;
        }
      });
      return nested;
    });

    this.results.push({
      category: '引用',
      feature: '嵌套引用',
      status: hasNested ? 'supported' : 'partial',
      details: hasNested ? '支持' : '需要测试'
    });
  }

  /**
   * 检查高级功能
   */
  private checkAdvancedFeatures(): void {
    const features = [
      { name: '脚注', node: 'footnote' },
      { name: '折叠内容', node: 'details' },
      { name: '标注框', node: 'callout' },
      { name: '定义列表', node: 'definitionList' },
    ];

    features.forEach(({ name, node }) => {
      const hasFeature = !!this.editor.schema.nodes[node] || !!this.editor.schema.nodes[`custom${node.charAt(0).toUpperCase()}${node.slice(1)}`];
      this.results.push({
        category: '高级功能',
        feature: name,
        status: hasFeature ? 'supported' : 'missing',
        details: hasFeature ? '支持' : '不支持'
      });
    });
  }

  /**
   * 检查 Mermaid 图表
   */
  private checkMermaid(): void {
    // 检查是否有 mermaid 代码块
    const codeBlocks = this.getNodesByType('codeBlock');
    const hasMermaid = codeBlocks.some(node => {
      return node.node.attrs.language === 'mermaid';
    });

    this.results.push({
      category: 'Mermaid',
      feature: '流程图',
      status: hasMermaid ? 'partial' : 'missing',
      details: hasMermaid ? '代码块存在，需要渲染器' : '不支持'
    });

    this.results.push({
      category: 'Mermaid',
      feature: '时序图',
      status: 'missing',
      details: '不支持'
    });

    this.results.push({
      category: 'Mermaid',
      feature: '甘特图',
      status: 'missing',
      details: '不支持'
    });
  }

  /**
   * 检查数学公式
   */
  private checkMath(): void {
    const hasInlineMath = !!this.editor.schema.marks.math || !!this.editor.schema.nodes.mathInline;
    const hasBlockMath = !!this.editor.schema.nodes.mathBlock;

    this.results.push({
      category: '数学公式',
      feature: '行内公式',
      status: hasInlineMath ? 'supported' : 'missing',
      details: hasInlineMath ? '支持' : '不支持'
    });

    this.results.push({
      category: '数学公式',
      feature: '块级公式',
      status: hasBlockMath ? 'supported' : 'missing',
      details: hasBlockMath ? '支持' : '不支持'
    });
  }

  /**
   * 检查 Emoji
   */
  private checkEmoji(): void {
    const doc = this.editor.view.dom;
    const text = doc.textContent || '';
    const hasEmoji = /[\u{1F600}-\u{1F64F}]/u.test(text);

    this.results.push({
      category: 'Emoji',
      feature: 'Emoji 渲染',
      status: hasEmoji ? 'supported' : 'partial',
      details: hasEmoji ? '支持' : '需要测试'
    });
  }

  /**
   * 检查 HTML 混合
   */
  private checkHTML(): void {
    this.results.push({
      category: 'HTML',
      feature: 'HTML 混合渲染',
      status: 'partial',
      details: '部分支持，需要测试'
    });

    this.results.push({
      category: 'HTML',
      feature: 'details/summary',
      status: 'partial',
      details: '需要测试'
    });
  }

  /**
   * 检查边界情况
   */
  private checkEdgeCases(): void {
    this.results.push({
      category: '边界情况',
      feature: '超长 URL 换行',
      status: 'style-issue',
      details: '需要检查样式'
    });

    this.results.push({
      category: '边界情况',
      feature: '深度嵌套',
      status: 'partial',
      details: '需要测试'
    });

    this.results.push({
      category: '边界情况',
      feature: '未闭合标签',
      status: 'partial',
      details: '需要测试'
    });
  }

  /**
   * 获取指定类型的所有节点
   */
  private getNodesByType(typeName: string): Array<{ node: any; pos: number }> {
    const nodes: Array<{ node: any; pos: number }> = [];
    const doc = this.editor.state.doc;

    doc.descendants((node, pos) => {
      if (node.type.name === typeName) {
        nodes.push({ node, pos });
      }
    });

    return nodes;
  }

  /**
   * 生成检查报告
   */
  generateReport(): string {
    const grouped = this.groupResults();
    let report = '# Markdown 功能检查报告\n\n';

    Object.entries(grouped).forEach(([category, results]) => {
      report += `## ${category}\n\n`;
      
      const supported = results.filter(r => r.status === 'supported').length;
      const total = results.length;
      report += `**完成度**: ${supported}/${total} (${Math.round(supported / total * 100)}%)\n\n`;

      results.forEach(result => {
        const icon = this.getStatusIcon(result.status);
        report += `${icon} **${result.feature}**: ${result.details}\n`;
      });

      report += '\n';
    });

    return report;
  }

  /**
   * 分组结果
   */
  private groupResults(): Record<string, CheckResult[]> {
    const grouped: Record<string, CheckResult[]> = {};

    this.results.forEach(result => {
      if (!grouped[result.category]) {
        grouped[result.category] = [];
      }
      grouped[result.category].push(result);
    });

    return grouped;
  }

  /**
   * 获取状态图标
   */
  private getStatusIcon(status: string): string {
    switch (status) {
      case 'supported': return '✅';
      case 'partial': return '⚠️';
      case 'missing': return '❌';
      case 'style-issue': return '🎨';
      default: return '❓';
    }
  }
}
