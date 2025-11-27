
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import DocCard from './components/DocCard';
import Editor from './components/Editor';
import { ShareModal, SettingsModal, GlobalSettingsModal, TemplatesModal, CommandPalette } from './components/Modals';
import { Space, Doc, ViewMode, Language, Theme, TRANSLATIONS, Template } from './types';
import { Search, Plus, Grid, List as ListIcon, CloudSun, AlignJustify, Trash2, ArrowLeft, Clock, FileText, Sparkles, TrendingUp, Timer, Zap, Shuffle, X, Star, Hash, Calendar as CalendarIcon } from 'lucide-react';

// --- Mock Data Generator ---
const MOCK_SPACES: Space[] = [
  { id: '1', name: 'Personal', icon: '🪐', color: 'blue' },
  { id: '2', name: 'Work', icon: '🚀', color: 'orange' },
  { id: '3', name: 'Ideas', icon: '💡', color: 'green' },
  { id: '4', name: 'Journal', icon: '📔', color: 'pink' },
];

const generateMockDocs = (): Doc[] => {
  const docs: Doc[] = [];
  const spaceIds = MOCK_SPACES.map(s => s.id);
  let idCounter = 1000;

  // 1. Add specific demo data (preserved from original)
  const demoDocs: Doc[] = [
      { 
        id: '101', spaceId: '1', parentId: null, type: 'doc', 
        title: '2025 Vision Board', content: '## Future Goals\n\n1. Master AI Engineering\n2. Visit Mars Colony Alpha\n3. Build a glass house\n\n## Shopping List\n- [ ] Spacesuit\n- [x] Oxygen Tank\n- [ ] Protein Bars\n\n![Mars Surface](https://images.unsplash.com/photo-1614728853975-69c960c72abc?auto=format&fit=crop&w=300&q=80)', 
        lastModified: Date.now() - 1000000, isFavorite: true, isLiked: false, isShared: false,
        tags: ['planning', 'life'],
        coverImage: 'https://images.unsplash.com/photo-1614728853975-69c960c72abc?auto=format&fit=crop&w=500&q=80', isDeleted: false
      },
      { 
        id: '102', spaceId: '1', parentId: null, type: 'folder', 
        title: 'Trips', content: '', 
        lastModified: Date.now() - 5000000, isFavorite: false, isLiked: true, isShared: true,
        tags: ['travel'], isDeleted: false
      },
      { 
        id: '106', spaceId: '1', parentId: '102', type: 'folder', 
        title: 'Tokyo', content: '', 
        lastModified: Date.now() - 500000, isFavorite: false, isLiked: false, isShared: false, isDeleted: false
      },
      { 
        id: '107', spaceId: '1', parentId: '106', type: 'doc', 
        title: 'Itinerary', content: '## Day 1: Shibuya\n- [ ] Visit Crossing\n- [ ] Hachiko Statue\n\n![Shibuya](https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=300&q=80)', 
        lastModified: Date.now() - 10000, isFavorite: false, isLiked: false, isShared: false,
        coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=500&q=80', isDeleted: false
      },
  ];
  docs.push(...demoDocs);

  // 2. Generate ~60 items across spaces with nesting
  spaceIds.forEach(spaceId => {
      // Create 4 Root Docs per space
      for (let i = 0; i < 4; i++) {
          docs.push({
              id: (idCounter++).toString(),
              spaceId,
              parentId: null,
              type: 'doc',
              title: `Note ${idCounter} - ${String.fromCharCode(65+i)}`,
              content: `# Note ${idCounter}\n\nLorum ipsum content...`,
              lastModified: Date.now() - Math.floor(Math.random() * 1000000000),
              isFavorite: Math.random() > 0.9, isLiked: false, isShared: false, isDeleted: false
          });
      }

      // Create 3 Root Folders per space
      for (let i = 0; i < 3; i++) {
          const folderId = (idCounter++).toString();
          docs.push({
              id: folderId,
              spaceId,
              parentId: null,
              type: 'folder',
              title: `Folder ${idCounter}`,
              content: '',
              lastModified: Date.now(),
              isFavorite: false, isLiked: false, isShared: false, isDeleted: false
          });
          
          // 4 Docs inside folder
          for (let j = 0; j < 4; j++) {
               docs.push({
                  id: (idCounter++).toString(),
                  spaceId,
                  parentId: folderId,
                  type: 'doc',
                  title: `Sub-doc ${idCounter}`,
                  content: `# Nested Document\n\nContent goes here.`,
                  lastModified: Date.now() - Math.floor(Math.random() * 500000000),
                  isFavorite: false, isLiked: false, isShared: false, isDeleted: false
               });
          }

          // 1 Nested sub-folder
          const subFolderId = (idCounter++).toString();
          docs.push({
              id: subFolderId,
              spaceId,
              parentId: folderId,
              type: 'folder',
              title: `Nested Archive ${idCounter}`,
              content: '',
              lastModified: Date.now(),
              isFavorite: false, isLiked: false, isShared: false, isDeleted: false
          });
          
          // 2 Deep docs
          for (let k = 0; k < 2; k++) {
              docs.push({
                  id: (idCounter++).toString(),
                  spaceId,
                  parentId: subFolderId,
                  type: 'doc',
                  title: `Deeply Nested ${idCounter}`,
                  content: `Level 3 content`,
                  lastModified: Date.now(),
                  isFavorite: false, isLiked: false, isShared: false, isDeleted: false
               });
          }
      }
  });

  return docs;
}

const TEMPLATES: Template[] = [
    { id: 't1', category: 'work', title: 'Meeting Notes', icon: '🗓', color: 'bg-blue-100 text-blue-600', content: '# Meeting Notes\n\n## Attendees\n- [ ] \n- [ ] \n\n## Agenda\n1. Review last week\n2. Discuss upcoming roadmap\n3. AOB\n\n## Action Items\n- [ ] ' },
    { id: 't2', category: 'work', title: 'Project Plan', icon: '🚀', color: 'bg-indigo-100 text-indigo-600', content: '# Project: [Name]\n\n## Overview\nBrief description of the project goals.\n\n## Timeline\n- [ ] Phase 1: Planning\n- [ ] Phase 2: Execution\n- [ ] Phase 3: Launch\n\n## Resources\n[Link to designs]\n[Link to specs]' },
    { id: 't3', category: 'personal', title: 'Weekly Review', icon: '☕️', color: 'bg-amber-100 text-amber-600', content: '# Weekly Review\n\n## Wins of the week\n\n## Challenges\n\n## Next Week Priorities\n- [ ] \n- [ ] ' },
    { id: 't4', category: 'personal', title: 'Habit Tracker', icon: '✅', color: 'bg-emerald-100 text-emerald-600', content: '# Habit Tracker\n\n## Daily Habits\n- [ ] Drink 2L Water\n- [ ] Read 30 mins\n- [ ] Exercise\n\n## Notes' },
    { id: 't5', category: 'education', title: 'Lecture Notes', icon: '📚', color: 'bg-pink-100 text-pink-600', content: '# Subject: [Topic]\nDate: [Date]\n\n## Key Concepts\n\n## Detailed Notes\n\n## Summary\n\n## Questions' },
];

const useCurrentTime = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    
    const hour = time.getHours();
    let greeting = 'Good Morning';
    if (hour >= 12 && hour < 17) greeting = 'Good Afternoon';
    else if (hour >= 17) greeting = 'Good Evening';
    
    // Simple translation mapping
    const greetingZh: Record<string, string> = {
        'Good Morning': '早安',
        'Good Afternoon': '下午好',
        'Good Evening': '晚上好'
    };

    return { 
        time, 
        formattedTime: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        getGreeting: (lang: Language) => lang === 'zh' ? greetingZh[greeting] : greeting 
    };
}

// 相对时间格式化（Craft风格）
const formatRelativeTime = (timestamp: number, lang: Language): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (lang === 'zh') {
    if (seconds < 60) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days === 1) return '昨天';
    if (days < 7) return `${days}天前`;
    if (days < 30) return `${Math.floor(days / 7)}周前`;
    return new Date(timestamp).toLocaleDateString('zh-CN');
  } else {
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(timestamp).toLocaleDateString('en-US');
  }
};

const ViewHeader = ({ title, showSearch, onSearch, layoutMode, setLayoutMode, onMenuClick, t, children, view, getGreeting, lang, formattedTime }: any) => (
  <div className="fixed top-0 left-0 right-0 md:left-[320px] h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border-b border-gray-200/20 dark:border-white/5 z-20 flex items-center justify-between px-6 md:px-10 transition-all duration-300">
    <div className="flex items-center gap-5 flex-1">
      {/* 移动菜单按钮 */}
      <button 
        onClick={onMenuClick} 
        className="md:hidden p-2.5 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10 rounded-2xl transition-all active:scale-95 backdrop-blur-sm"
      >
        <AlignJustify className="w-5 h-5" />
      </button>
      
      {/* Dashboard: 问候语 | 其他: 标题 */}
      {view === 'dashboard' ? (
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-indigo-500/30 hidden md:flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <CloudSun className="w-6 h-6 relative z-10" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {getGreeting(lang)}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">Creator</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-0.5">
              {lang === 'zh' ? '开始新的创作' : 'Start creating'}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="hidden md:block w-1.5 h-10 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 rounded-full shadow-lg"></div>
          <h1 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 truncate tracking-tight">
            {title}
          </h1>
        </div>
      )}
    </div>
    
    <div className="flex items-center gap-4">
        {/* Dashboard: 时间 | 其他: 搜索+布局 */}
        {view === 'dashboard' ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-lg shadow-emerald-500/50"></div>
            <div className="text-2xl md:text-3xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 tabular-nums tracking-tight">
              {formattedTime}
            </div>
          </div>
        ) : (
          showSearch && (
            <>
                {/* 搜索框 */}
                <div 
                  className="relative group hidden md:flex items-center" 
                  onClick={onSearch}
                >
                  <div className="absolute left-4 flex items-center pointer-events-none z-10">
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={t.search}
                    readOnly
                    className="w-64 pl-11 pr-24 py-3 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-white hover:to-gray-50 dark:hover:from-gray-800/80 dark:hover:to-gray-900/80 border border-gray-200/80 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 rounded-2xl text-sm font-semibold focus:outline-none transition-all cursor-pointer text-gray-700 dark:text-gray-200 placeholder-gray-400 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  />
                  <div className="absolute right-3 flex items-center gap-1.5 pointer-events-none">
                    <kbd className="px-2.5 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-[10px] font-black text-gray-600 dark:text-gray-400 shadow-md">⌘K</kbd>
                  </div>
                </div>
                
                {/* 布局切换 */}
                <div className="hidden sm:flex items-center gap-1.5 p-1.5 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-700/50 shadow-lg">
                  <button 
                    onClick={() => setLayoutMode('grid')} 
                    className={`p-2.5 rounded-xl transition-all ${
                      layoutMode === 'grid' 
                        ? 'bg-white dark:bg-gray-700 shadow-xl text-indigo-600 dark:text-indigo-400 scale-110' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:scale-105'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setLayoutMode('list')} 
                    className={`p-2.5 rounded-xl transition-all ${
                      layoutMode === 'list' 
                        ? 'bg-white dark:bg-gray-700 shadow-xl text-indigo-600 dark:text-indigo-400 scale-110' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50 hover:scale-105'
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                  </button>
                </div>
            </>
          )
        )}
        {children}
    </div>
  </div>
);

const App: React.FC = () => {
  const [spaces, setSpaces] = useState<Space[]>(MOCK_SPACES);
  // Initialize with large mock data
  const [docs, setDocs] = useState<Doc[]>(() => generateMockDocs());
  
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>('dashboard');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'shared' | 'favorites'>('all');
  const [lang, setLang] = useState<Language>('zh'); 
  const [theme, setTheme] = useState<Theme>('gradient');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 创意功能状态
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [quickCaptureText, setQuickCaptureText] = useState('');
  const [dailyQuote, setDailyQuote] = useState(0);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25分钟
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  // Modal State
  const [modalType, setModalType] = useState<'share' | 'settings' | 'globalSettings' | 'templates' | 'commandPalette' | null>(null);
  const [modalDocId, setModalDocId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  // 每日灵感语录
  const inspirationQuotes = [
    { zh: '“今天的你，想创造什么？”', en: '"What will you create today?"' },
    { zh: '“伟大的想法始于第一个字。”', en: '"Great ideas start with the first word."' },
    { zh: '“不要等待灵感，创造它。”', en: '"Don\'t wait for inspiration, create it."' },
    { zh: '“你的下一个突破只差一次点击。”', en: '"Your next breakthrough is one click away."' },
    { zh: '“记录今日，启发明天。”', en: '"Document today, inspire tomorrow."' },
    { zh: '“每个大项目都从小笔记开始。”', en: '"Every big project starts with a small note."' },
  ];

  const currentQuote = inspirationQuotes[dailyQuote % inspirationQuotes.length];
  const { formattedTime, getGreeting } = useCurrentTime();

  // Pomodoro 倒计时
  useEffect(() => {
    if (!pomodoroRunning || pomodoroTime <= 0) return;
    const timer = setInterval(() => {
      setPomodoroTime(prev => {
        if (prev <= 1) {
          setPomodoroRunning(false);
          return 25 * 60; // 重置
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [pomodoroRunning, pomodoroTime]);

  // --- Theme Effect ---
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-gradient');
    document.body.classList.add(`theme-${theme}`);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- Command Palette Shortcut ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setModalType(prev => prev === 'commandPalette' ? null : 'commandPalette');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- Computed Data ---
  const activeSpace = spaces.find(s => s.id === activeSpaceId);
  const activeDoc = docs.find(d => d.id === activeDocId);
  const modalDoc = docs.find(d => d.id === modalDocId);

  const filteredDocs = docs.filter(doc => {
    if (searchQuery) {
      // 全文搜索：标题 + 内容
      const searchLower = searchQuery.toLowerCase();
      return doc.title.toLowerCase().includes(searchLower) || 
             doc.content.toLowerCase().includes(searchLower);
    }
    if (view === 'trash') return doc.isDeleted;
    if (doc.isDeleted) return false;

    if (view === 'dashboard') {
      // 应用筛选器
      if (filterMode === 'favorites') return doc.isFavorite;
      if (filterMode === 'shared') return doc.isShared || (doc.collaborators && doc.collaborators.length > 0);
      // Dashboard 显示所有最近文档（按时间排序，限制30个）
      return true;
    }
    if (view === 'space' && activeSpaceId) return doc.spaceId === activeSpaceId && doc.parentId === null;
    return false;
  }).sort((a, b) => {
    // 仅在 Dashboard 视图按最近修改时间排序
    if (view === 'dashboard') {
      return b.lastModified - a.lastModified;
    }
    return 0;
  }).slice(0, view === 'dashboard' ? 30 : undefined); // Dashboard 限制显示30个

  // 快速捕捉功能
  const handleQuickCapture = () => {
    if (!quickCaptureText.trim()) return;
    const newDoc: Doc = {
      id: `quick-${Date.now()}`,
      title: quickCaptureText.split('\n')[0].substring(0, 50) || 'Quick Note',
      content: quickCaptureText,
      spaceId: null,
      parentId: null,
      type: 'doc',
      lastModified: Date.now(),
      isFavorite: false,
      isLiked: false,
      isShared: false,
      isDeleted: false,
    };
    setDocs(prev => [newDoc, ...prev]);
    setQuickCaptureText('');
    setShowQuickCapture(false);
  };

  // 随机文档
  const handleFeelingLucky = () => {
    const availableDocs = docs.filter(d => !d.isDeleted);
    if (availableDocs.length === 0) return;
    const randomDoc = availableDocs[Math.floor(Math.random() * availableDocs.length)];
    handleOpenDoc(randomDoc);
  };

  // 文档统计
  const stats = useMemo(() => {
    const totalDocs = docs.filter(d => !d.isDeleted).length;
    const totalWords = docs.reduce((sum, doc) => sum + (doc.content?.split(/\s+/).length || 0), 0);
    const last7Days = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentDocs = docs.filter(d => d.lastModified > last7Days).length;
    return { totalDocs, totalWords, recentDocs };
  }, [docs]);

  // --- Handlers ---
  const handleNavigate = useCallback((newView: ViewMode, spaceId?: string) => {
    setView(newView);
    if (newView === 'space' && spaceId) setActiveSpaceId(spaceId);
    else if (newView === 'dashboard') setActiveSpaceId(null);
    else if (newView === 'trash') setActiveSpaceId(null);
    setActiveDocId(null);
    setIsSidebarOpen(false);
  }, []);

  const handleOpenDoc = useCallback((doc: Doc) => {
    if (doc.isDeleted) return; 
    // Folders are openable as pages
    setActiveDocId(doc.id);
    setView('doc');
    setIsSidebarOpen(false);
  }, []);

  // Handle navigation from Editor breadcrumbs
  const handleBreadcrumbNavigate = (item: { id: string, type?: 'space' | 'folder' | 'doc' }) => {
      if (item.type === 'space') {
          handleNavigate('space', item.id);
      } else {
          // Open doc or folder
          const doc = docs.find(d => d.id === item.id);
          if (doc) handleOpenDoc(doc);
      }
  };

  const handleCreateDoc = () => {
    const newDoc: Doc = {
      id: Date.now().toString(),
      spaceId: activeSpaceId || spaces[0].id,
      parentId: null,
      type: 'doc',
      title: '',
      content: '',
      lastModified: Date.now(),
      isFavorite: false,
      isLiked: false,
      isShared: false,
      isDeleted: false
    };
    setDocs([newDoc, ...docs]);
    setActiveDocId(newDoc.id);
    setView('doc');
    setIsSidebarOpen(false);
  };

  const handleCreateFromTemplate = (template: Template) => {
      const newDoc: Doc = {
          id: Date.now().toString(),
          spaceId: activeSpaceId || spaces[0].id,
          parentId: null,
          type: 'doc',
          title: template.title,
          content: template.content,
          lastModified: Date.now(),
          isFavorite: false,
          isLiked: false,
          isShared: false,
          isDeleted: false
      };
      setDocs([newDoc, ...docs]);
      setActiveDocId(newDoc.id);
      setView('doc');
      setModalType(null);
      setIsSidebarOpen(false);
  };

  const handleDateSelect = (date: Date) => {
      const dateStr = date.toISOString().split('T')[0];
      const dailyTitle = `📅 Daily: ${dateStr}`;
      const existingDoc = docs.find(d => d.title === dailyTitle && !d.isDeleted);
      if (existingDoc) {
          handleOpenDoc(existingDoc);
      } else {
          const newDoc: Doc = {
            id: Date.now().toString(),
            spaceId: '4', 
            parentId: null,
            type: 'doc',
            title: dailyTitle,
            content: `# ${dailyTitle}

## Priorities
- [ ] 

## Notes
`,
            lastModified: Date.now(),
            isFavorite: false,
            isLiked: false,
            isShared: false,
            isDeleted: false,
            tags: ['daily'],
            coverImage: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=500&q=80'
          };
          setDocs([newDoc, ...docs]);
          setActiveDocId(newDoc.id);
          setView('doc');
      }
      setIsSidebarOpen(false);
  }

  const handleUpdateDoc = useCallback((id: string, updates: Partial<Doc>) => {
    setDocs(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const handleSoftDelete = (id: string) => {
      handleUpdateDoc(id, { isDeleted: true, deletedAt: Date.now() });
      setModalType(null);
  };

  const handleRestore = (id: string) => {
      handleUpdateDoc(id, { isDeleted: false, deletedAt: undefined });
      setModalType(null);
  }

  const handlePermanentDelete = (id: string) => {
      setDocs(prev => prev.filter(d => d.id !== id));
      setModalType(null);
  }

  const handleEmptyTrash = () => {
      if (confirm('Are you sure you want to permanently delete all items in trash?')) {
          setDocs(prev => prev.filter(d => !d.isDeleted));
      }
  }

  const handleDuplicateDoc = (docId: string) => {
      const original = docs.find(d => d.id === docId);
      if(!original) return;
      const newDoc: Doc = {
          ...original,
          id: Date.now().toString(),
          title: `${original.title} (${t.copyOf})`,
          lastModified: Date.now(),
          isFavorite: false,
          isLiked: false,
          isShared: false,
          isDeleted: false,
          deletedAt: undefined,
          tags: original.tags ? [...original.tags] : [],
          collaborators: [] 
      };
      setDocs([newDoc, ...docs]);
      setModalType(null);
  };

  const handleExportDoc = (docId: string) => {
      const doc = docs.find(d => d.id === docId);
      if(!doc) return;
      const element = document.createElement("a");
      const file = new Blob([doc.content], {type: 'text/markdown'});
      element.href = URL.createObjectURL(file);
      element.download = `${doc.title || 'untitled'}.md`;
      document.body.appendChild(element); 
      element.click();
      document.body.removeChild(element);
  };

  const handleToggleFavorite = useCallback((doc: Doc, e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateDoc(doc.id, { isFavorite: !doc.isFavorite });
  }, [handleUpdateDoc]);

  const handleToggleLike = useCallback((doc: Doc, e: React.MouseEvent) => {
    e.stopPropagation();
    handleUpdateDoc(doc.id, { isLiked: !doc.isLiked });
  }, [handleUpdateDoc]);

  const handleOpenSettings = (doc: Doc, e: React.MouseEvent) => {
      e.stopPropagation();
      setModalDocId(doc.id);
      setModalType('settings');
  }

  const handleOpenShare = () => {
      if (activeDoc) {
          setModalDocId(activeDoc.id);
          setModalType('share');
      }
  }

  const handleCommandNavigate = (viewMode: 'dashboard' | 'space' | 'doc', id?: string) => {
      if (viewMode === 'doc' && id) {
          const doc = docs.find(d => d.id === id);
          if (doc) handleOpenDoc(doc);
      } else {
          handleNavigate(viewMode, id);
      }
      setIsSidebarOpen(false);
  }

  // --- View Transition Variants (Craft Style - 干脆流畅) ---
  const pageVariants = {
      initial: { opacity: 0, y: 4 },
      animate: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.12,
            ease: [0.4, 0, 0.2, 1]
          }
      },
      exit: { 
          opacity: 0, 
          y: -4,
          transition: { duration: 0.1, ease: [0.4, 0, 1, 1] }
      }
  };

  return (
    <div className="flex min-h-screen relative text-gray-900 dark:text-gray-100 overflow-hidden bg-transparent">
      
      {/* Sidebar Component handles its own mobile rendering via props */}
      <Sidebar 
        spaces={spaces}
        activeSpaceId={activeSpaceId || (activeDoc ? activeDoc.spaceId : null)}
        currentView={view}
        lang={lang}
        docs={docs}
        activeDoc={activeDoc}
        onNavigate={handleNavigate}
        onCreateSpace={() => {}}
        onBackToHome={() => handleNavigate('dashboard')}
        onSelectDoc={handleOpenDoc}
        onOpenGlobalSettings={() => setModalType('globalSettings')}
        onOpenTemplates={() => setModalType('templates')}
        onDateSelect={handleDateSelect}
        // @ts-ignore
        onOpenSearch={() => setModalType('commandPalette')}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <AnimatePresence mode="wait">
        {view === 'doc' && activeDoc ? (
             <main key="editor" className="flex-1 ml-0 md:ml-[320px] mr-0 md:mr-6 my-0 md:my-6 overflow-hidden relative h-[calc(100vh-3.5rem)] md:h-auto mt-14 md:mt-0">
                 <Editor 
                    doc={activeDoc}
                    space={spaces.find(s => s.id === activeDoc.spaceId)} 
                    allDocs={docs.filter(d => !d.isDeleted)}
                    lang={lang}
                    onBack={() => {
                        setView(activeSpaceId ? 'space' : 'dashboard');
                        setActiveDocId(null);
                    }}
                    onNavigate={handleBreadcrumbNavigate}
                    onUpdate={handleUpdateDoc}
                    onOpenShare={handleOpenShare}
                />
             </main>
        ) : (
            <div key={`${view}-${activeSpaceId || 'home'}`} className="flex-1 ml-0 md:ml-[320px] flex flex-col h-screen overflow-hidden">
                {/* Unified Fixed Header */}
                <ViewHeader 
                    title={view === 'dashboard' ? t.welcome : (view === 'trash' ? t.trash : activeSpace?.name)}
                    showSearch={view !== 'doc'}
                    onSearch={() => setModalType('commandPalette')}
                    layoutMode={layoutMode}
                    setLayoutMode={setLayoutMode}
                    onMenuClick={() => setIsSidebarOpen(true)}
                    t={t}
                    view={view}
                    getGreeting={getGreeting}
                    lang={lang}
                    formattedTime={formattedTime}
                >  
                    {view === 'space' && activeSpace && (
                         <motion.button 
                            whileHover={{ scale: 1.05, y: -1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreateDoc}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl font-bold transition-all"
                            title={t.newDoc}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">{t.newDoc}</span>
                        </motion.button>
                    )}
                </ViewHeader>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-24 md:pt-28 custom-scrollbar">
                    <motion.div 
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="flex flex-col h-full max-w-[1400px] mx-auto"
                    >
                        {/* View Specific Headers/Widgets */}
                        {view === 'dashboard' && (
                            <>
                            {/* 创意功能区 - 3栏布局 */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                {/* 每日灵感 */}
                                <motion.div 
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="col-span-1 p-4 rounded-2xl bg-pink-50/70 dark:bg-pink-900/20 border border-pink-200/50 dark:border-pink-800/30 cursor-pointer group backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
                                    onClick={() => setDailyQuote(prev => prev + 1)}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="p-2 rounded-lg bg-pink-500/10 group-hover:bg-pink-500/20 transition-colors">
                                            <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-pink-500 dark:text-pink-400 uppercase tracking-wider">
                                            {lang === 'zh' ? '点击刷新' : 'Click to refresh'}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 leading-relaxed italic">
                                        {currentQuote[lang]}
                                    </p>
                                </motion.div>

                                {/* 统计仪表盘 */}
                                <motion.div 
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="col-span-1 p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 rounded-lg bg-blue-500/10">
                                            <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                                            {lang === 'zh' ? '统计' : 'Stats'}
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-blue-600 dark:text-blue-400 tabular-nums">{stats.totalDocs}</div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{lang === 'zh' ? '文档' : 'Docs'}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tabular-nums">{(stats.totalWords / 1000).toFixed(1)}k</div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{lang === 'zh' ? '字数' : 'Words'}</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-black text-purple-600 dark:text-purple-400 tabular-nums">{stats.recentDocs}</div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">{lang === 'zh' ? '7天' : '7 Days'}</div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Pomodoro 计时器 */}
                                <motion.div 
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="col-span-1 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 rounded-lg bg-emerald-500/10">
                                            <Timer className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                        <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                            Pomodoro
                                        </h4>
                                    </div>
                                    <div className="text-center mb-3">
                                        <div className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
                                            {Math.floor(pomodoroTime / 60)}:{(pomodoroTime % 60).toString().padStart(2, '0')}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setPomodoroRunning(!pomodoroRunning)}
                                        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors"
                                    >
                                        {pomodoroRunning ? (lang === 'zh' ? '暂停' : 'Pause') : (lang === 'zh' ? '开始' : 'Start')}
                                    </button>
                                </motion.div>
                            </div>

                            {/* 快速操作栏 */}
                            <div className="flex gap-3 mb-6">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowQuickCapture(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                                >
                                    <Zap className="w-4 h-4" />
                                    {lang === 'zh' ? '快速捕捉' : 'Quick Capture'}
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleFeelingLucky}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold hover:border-indigo-400 dark:hover:border-indigo-500 transition-all"
                                >
                                    <Shuffle className="w-4 h-4" />
                                    {lang === 'zh' ? '随机文档' : 'Feeling Lucky'}
                                </motion.button>
                            </div>

                            {/* 新增功能区 - 4栏网格 */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* 📌 快速收藏夹 */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="col-span-1 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 rounded-lg bg-amber-500/10">
                                            <Star className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                                            {lang === 'zh' ? '收藏夹' : 'Favorites'}
                                        </h4>
                                    </div>
                                    <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mb-1 tabular-nums">
                                        {docs.filter(d => d.isFavorite && !d.isDeleted).length}
                                    </div>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {lang === 'zh' ? '个收藏文档' : 'Favorited'}
                                    </p>
                                </motion.div>

                                {/* 🏷️ 智能标签云 */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="col-span-1 lg:col-span-2 p-4 rounded-2xl bg-cyan-50/70 dark:bg-cyan-900/20 border border-cyan-200/50 dark:border-cyan-800/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 rounded-lg bg-cyan-500/10">
                                            <Hash className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                                        </div>
                                        <h4 className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                                            {lang === 'zh' ? '热门标签' : 'Tag Cloud'}
                                        </h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {(() => {
                                            const tagCounts: Record<string, number> = {};
                                            docs.filter(d => !d.isDeleted).forEach(d => {
                                                const words = (d.title + ' ' + d.content).toLowerCase().split(/\s+/);
                                                words.forEach(word => {
                                                    if (word.length > 2) {
                                                        tagCounts[word] = (tagCounts[word] || 0) + 1;
                                                    }
                                                });
                                            });
                                            const topTags = Object.entries(tagCounts)
                                                .sort((a, b) => b[1] - a[1])
                                                .slice(0, 6);
                                            return topTags.length > 0 ? topTags.map(([tag, count]) => (
                                                <span key={tag} className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg text-xs font-bold">
                                                    #{tag} <span className="opacity-50">({count})</span>
                                                </span>
                                            )) : (
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {lang === 'zh' ? '暂无标签' : 'No tags yet'}
                                                </span>
                                            );
                                        })()}
                                    </div>
                                </motion.div>

                                {/* 📅 日历热力图 */}
                                <motion.div
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    className="col-span-1 p-4 rounded-2xl bg-violet-50/70 dark:bg-violet-900/20 border border-violet-200/50 dark:border-violet-800/30 backdrop-blur-md shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-2 rounded-lg bg-violet-500/10">
                                            <CalendarIcon className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                                        </div>
                                        <h4 className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                                            {lang === 'zh' ? '活跃度' : 'Activity'}
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {Array.from({length: 28}).map((_, i) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() - (27 - i));
                                            const dayDocs = docs.filter(d => {
                                                const docDate = new Date(d.lastModified);
                                                return docDate.toDateString() === date.toDateString() && !d.isDeleted;
                                            }).length;
                                            const intensity = Math.min(dayDocs, 3);
                                            return (
                                                <div
                                                    key={i}
                                                    className="aspect-square rounded transition-all hover:ring-2 hover:ring-violet-400"
                                                    style={{
                                                        backgroundColor: intensity === 0 ? 'rgba(139, 92, 246, 0.1)' :
                                                            intensity === 1 ? 'rgba(139, 92, 246, 0.3)' :
                                                            intensity === 2 ? 'rgba(139, 92, 246, 0.6)' :
                                                            'rgba(139, 92, 246, 0.9)'
                                                    }}
                                                    title={`${date.toLocaleDateString()}: ${dayDocs} docs`}
                                                />
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </div>
                            
                            {/* 最近编辑标题 */}
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    {lang === 'zh' ? '最近编辑' : 'Recent Edits'}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {lang === 'zh' ? `显示 ${filteredDocs.length} 个最近修改的文档` : `Showing ${filteredDocs.length} recently modified documents`}
                                </p>
                            </div>
                            </>
                        )}

                        {view === 'trash' && (
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-gray-500 dark:text-gray-400 font-medium">Items are deleted forever after 30 days.</p>
                                {filteredDocs.length > 0 && (
                                    <button 
                                        onClick={handleEmptyTrash}
                                        className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        {t.emptyTrash}
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Filters Row (Desktop only, mobile moved to header/implicit) */}
                        {view !== 'trash' && (
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex p-1 bg-gray-100/50 dark:bg-white/5 rounded-xl">
                                    <button 
                                        onClick={() => setFilterMode('all')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            filterMode === 'all' 
                                                ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white' 
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/50'
                                        }`}
                                    >
                                        {t.all}
                                    </button>
                                    <button 
                                        onClick={() => setFilterMode('shared')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            filterMode === 'shared' 
                                                ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white' 
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/50'
                                        }`}
                                    >
                                        {t.shared}
                                    </button>
                                    <button 
                                        onClick={() => setFilterMode('favorites')}
                                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                            filterMode === 'favorites' 
                                                ? 'bg-white dark:bg-gray-800 shadow-sm text-gray-800 dark:text-white' 
                                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-white/50'
                                        }`}
                                    >
                                        {t.favorites}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Doc Grid */}
                        {filteredDocs.length > 0 ? (
                            <div className={`${layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-2'} pb-24`}>
                                <AnimatePresence mode="popLayout">
                                    {filteredDocs.map((doc) => (
                                        <DocCard 
                                            key={doc.id}
                                            doc={doc} 
                                            lang={lang}
                                            layout={layoutMode}
                                            onClick={handleOpenDoc}
                                            onToggleFavorite={handleToggleFavorite}
                                            onToggleLike={handleToggleLike}
                                            onOpenSettings={handleOpenSettings}
                                            onRestore={() => handleRestore(doc.id)}
                                            onDeleteForever={() => handlePermanentDelete(doc.id)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-600">
                                 {view === 'trash' ? (
                                    <>
                                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800/50 rounded-full flex items-center justify-center mb-4">
                                            <Trash2 className="w-10 h-10 opacity-30" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400">{t.trashEmpty}</h3>
                                    </>
                                 ) : (
                                    <>
                                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center mb-4">
                                            <FileText className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-600 dark:text-gray-400 mb-2">
                                            {lang === 'zh' ? '暂无文档' : 'No Documents'}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
                                            {lang === 'zh' ? '创建一个文档开始你的工作' : 'Create a document to get started'}
                                        </p>
                                        {view === 'space' && activeSpace && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleCreateDoc}
                                                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all"
                                            >
                                                <Plus className="w-5 h-5" />
                                                {t.newDoc}
                                            </motion.button>
                                        )}
                                    </>
                                 )}
                            </div>
                        )}
                    </motion.div>
                </main>
            </div>
        )}
      </AnimatePresence>

      <GlobalSettingsModal 
        isOpen={modalType === 'globalSettings'}
        onClose={() => setModalType(null)}
        lang={lang}
        theme={theme}
        setTheme={setTheme}
        setLang={setLang}
      />
      
      <TemplatesModal 
        isOpen={modalType === 'templates'}
        onClose={() => setModalType(null)}
        lang={lang}
        templates={TEMPLATES}
        onSelect={handleCreateFromTemplate}
      />
      
      <CommandPalette 
        isOpen={modalType === 'commandPalette'}
        onClose={() => setModalType(null)}
        lang={lang}
        docs={docs}
        spaces={spaces}
        onNavigate={handleCommandNavigate}
        onCreateDoc={() => {
            handleCreateDoc();
            setModalType(null);
        }}
        onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
      />

      {modalDoc && (
          <>
            <ShareModal 
                isOpen={modalType === 'share'} 
                onClose={() => setModalType(null)} 
                doc={modalDoc} 
                lang={lang}
            />
            <SettingsModal 
                isOpen={modalType === 'settings'} 
                onClose={() => setModalType(null)} 
                doc={modalDoc} 
                onUpdate={(updates) => handleUpdateDoc(modalDoc.id, updates)}
                onDelete={modalDoc.isDeleted ? () => handlePermanentDelete(modalDoc.id) : () => handleSoftDelete(modalDoc.id)}
                onRestore={() => handleRestore(modalDoc.id)}
                onDuplicate={() => handleDuplicateDoc(modalDoc.id)}
                onExport={() => handleExportDoc(modalDoc.id)}
                lang={lang}
            />
          </>
      )}

      {/* 快速捕捉弹窗 */}
      <AnimatePresence>
        {showQuickCapture && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              className="absolute inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickCapture(false)}
            />
            <motion.div
              className="w-full max-w-lg bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.12, ease: [0.4, 0, 0.2, 1] }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {lang === 'zh' ? '快速捕捉' : 'Quick Capture'}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setShowQuickCapture(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <textarea
                  autoFocus
                  value={quickCaptureText}
                  onChange={(e) => setQuickCaptureText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowQuickCapture(false);
                    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleQuickCapture();
                  }}
                  placeholder={lang === 'zh' ? '记录你的想法... (Cmd/Ctrl+Enter 保存)' : 'Capture your thoughts... (Cmd/Ctrl+Enter to save)'}
                  className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    onClick={() => setShowQuickCapture(false)}
                    className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium transition-colors"
                  >
                    {lang === 'zh' ? '取消' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleQuickCapture}
                    className="px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
                  >
                    {lang === 'zh' ? '保存' : 'Save'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
