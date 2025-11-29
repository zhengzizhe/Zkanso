import { SlashCommand, SlashCommandCategory } from '../types';

/**
 * 搜索命令
 * 支持中英文、拼音、关键词模糊搜索
 * 
 * @param query 搜索查询
 * @param commands 命令列表
 * @returns 过滤并排序后的命令列表
 */
export function searchCommands(query: string, commands: SlashCommand[]): SlashCommand[] {
  const searchTerm = query.toLowerCase().trim();
  
  // 空查询返回所有命令
  if (!searchTerm) {
    return commands.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }
  
  return commands
    .map(cmd => {
      let score = 0;
      
      // 标题精确匹配 +100
      if (cmd.title.toLowerCase() === searchTerm) {
        score += 100;
      }
      
      // 标题开头匹配 +50
      if (cmd.title.toLowerCase().startsWith(searchTerm)) {
        score += 50;
      }
      
      // 标题包含 +20
      if (cmd.title.toLowerCase().includes(searchTerm)) {
        score += 20;
      }
      
      // 关键词精确匹配 +80
      if (cmd.keywords.some(kw => kw.toLowerCase() === searchTerm)) {
        score += 80;
      }
      
      // 关键词开头匹配 +40
      if (cmd.keywords.some(kw => kw.toLowerCase().startsWith(searchTerm))) {
        score += 40;
      }
      
      // 关键词包含 +15
      if (cmd.keywords.some(kw => kw.toLowerCase().includes(searchTerm))) {
        score += 15;
      }
      
      // 描述包含 +10
      if (cmd.description.toLowerCase().includes(searchTerm)) {
        score += 10;
      }
      
      // ID包含 +5
      if (cmd.id.toLowerCase().includes(searchTerm)) {
        score += 5;
      }
      
      // 优先级加成
      score += (cmd.priority || 0) / 10;
      
      return { ...cmd, score };
    })
    .filter(cmd => cmd.score > 0)
    .sort((a, b) => (b.score || 0) - (a.score || 0));
}

/**
 * 按分类搜索命令
 * 
 * @param query 搜索查询
 * @param categories 分类列表
 * @returns 过滤后的分类列表
 */
export function searchCommandsByCategory(
  query: string,
  categories: SlashCommandCategory[]
): SlashCommandCategory[] {
  const searchTerm = query.toLowerCase().trim();
  
  // 空查询返回所有分类
  if (!searchTerm) {
    return categories;
  }
  
  return categories
    .map(category => ({
      ...category,
      commands: searchCommands(searchTerm, category.commands),
    }))
    .filter(category => category.commands.length > 0);
}

/**
 * 高亮搜索关键词
 * 
 * @param text 原文本
 * @param query 搜索查询
 * @returns 高亮后的HTML字符串
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-900/50">$1</mark>');
}
