
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import DocCard from './components/DocCard';
import { CraftEditorWrapper as CraftEditor } from './components/Editor';
import { SlashCommandDemo } from './components/SlashCommand/SlashCommandDemo';
import CraftEditorDemo from './pages/craft-editor-demo';
import mockData from './mock-data.json';
import { ShareModal, SettingsModal, GlobalSettingsModal, TemplatesModal, CommandPalette, TagsManagementModal } from './components/Modals';
import { Space, Doc, ViewMode, Language, Theme, TRANSLATIONS, Template } from './types';
import { Search, Plus, Grid, List as ListIcon, CloudSun, AlignJustify, Trash2, ArrowLeft, Clock, FileText, Sparkles, TrendingUp, Timer, Zap, Shuffle, X, Star, Hash, Calendar as CalendarIcon, TestTube, Slash } from 'lucide-react';

const MOCK_SPACES: Space[] = [
  {
    id: 'space-1',
    name: '2025 Vision Board',
    icon: '📝',
    color: 'blue'
  },
  {
    id: 'space-2',
    name: 'Trips',
    icon: '✈️',
    color: 'orange'
  },
  {
    id: 'space-3',
    name: 'Reading List',
    icon: '📚',
    color: 'purple'
  }
];

const generateMockDocs = (): Doc[] => {
  return [];
};

const TEMPLATES: Template[] = [];

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

const ViewHeader = ({ title, showSearch, onSearch, layoutMode, setLayoutMode, onMenuClick, t, children, view, getGreeting, lang, formattedTime, isSidebarCollapsed }: any) => (
  <div 
    className="fixed top-0 left-0 right-0 h-20 bg-transparent z-20 flex items-center justify-between px-6 md:px-10 transition-all duration-300 ease-in-out"
    style={{
      marginLeft: isSidebarCollapsed ? 0 : 320
    }}
  >
    <div className="flex items-center gap-5 flex-1">
      {/* 移动菜单按钮 */}
      <button 
        onClick={onMenuClick} 
        className="md:hidden p-2.5 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-white/10 rounded-2xl transition-all active:scale-95"
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
                  <div className="absolute left-3 flex items-center pointer-events-none z-10">
                    <Search className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                  </div>
                  <input 
                    type="text" 
                    placeholder={t.search}
                    readOnly
                    className="w-56 pl-9 pr-20 py-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 hover:from-white hover:to-gray-50 dark:hover:from-gray-800/80 dark:hover:to-gray-900/80 border border-gray-200/80 dark:border-gray-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 rounded-lg text-xs font-medium focus:outline-none transition-all cursor-pointer text-gray-700 dark:text-gray-200 placeholder-gray-400 shadow-sm hover:shadow"
                  />
                  <div className="absolute right-2 flex items-center gap-1 pointer-events-none">
                    <kbd className="px-2 py-0.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded text-[9px] font-bold text-gray-500 dark:text-gray-400 shadow-sm">⌘K</kbd>
                  </div>
                </div>
                
                {/* 布局切换 */}
                <div className="hidden sm:flex items-center gap-1 p-1 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200/80 dark:border-gray-700/50 shadow-sm">
                  <button 
                    onClick={() => setLayoutMode('grid')} 
                    className={`p-2 rounded-md transition-all ${
                      layoutMode === 'grid' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setLayoutMode('list')} 
                    className={`p-2 rounded-md transition-all ${
                      layoutMode === 'list' 
                        ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'
                    }`}
                  >
                    <ListIcon className="w-3.5 h-3.5" />
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
  const [docs, setDocs] = useState<Doc[]>(() => {
    // 加载假数据
    const loadedDocs = mockData.docs.map(doc => ({
      ...doc,
      lastModified: doc.lastModified || Date.now()
    }));
    
    // 添加demo文档
    const demoDoc: Doc = {
      id: 'demo-document',
      spaceId: null,
      parentId: null,
      type: 'doc',
      title: '🎨 Kanso编辑器完整功能展示',
      content: '',
      lastModified: Date.now(),
      isFavorite: false,
      isLiked: false,
      isShared: false,
      isDeleted: false
    };
    
    return [demoDoc, ...loadedDocs];
  });
  
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);
  const [activeDocId, setActiveDocId] = useState<string | null>('demo-document'); // 默认打开demo文档
  const [view, setView] = useState<ViewMode>('doc'); // 默认进入编辑模式
  const [showSlashTest, setShowSlashTest] = useState(false);
  const [showCraftEditorDemo, setShowCraftEditorDemo] = useState(false);
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'shared' | 'favorites'>('all');
  const [lang, setLang] = useState<Language>('zh'); 
  const [theme, setTheme] = useState<Theme>('light');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // 创意功能状态
  const [showQuickCapture, setShowQuickCapture] = useState(false);
  const [quickCaptureText, setQuickCaptureText] = useState('');
  const [dailyQuote, setDailyQuote] = useState(0);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25分钟
  const [pomodoroRunning, setPomodoroRunning] = useState(false);

  // Modal State
  const [modalType, setModalType] = useState<'share' | 'settings' | 'globalSettings' | 'templates' | 'commandPalette' | 'tagsManagement' | null>(null);
  const [modalDocId, setModalDocId] = useState<string | null>(null);

  const t = TRANSLATIONS[lang];

  // 每日灵感语录
  const inspirationQuotes: Array<{ zh: string; en: string }> = [];
  const currentQuote = inspirationQuotes.length > 0 
    ? inspirationQuotes[dailyQuote % inspirationQuotes.length] 
    : { zh: '', en: '' };
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
    // 移除所有主题类
    document.body.classList.remove('theme-light', 'theme-dark', 'theme-gradient', 'theme-paper', 'theme-warm', 'theme-slate', 'theme-snow', 'theme-cream', 'theme-mint', 'theme-rose', 'theme-midnight', 'theme-ocean', 'theme-forest', 'theme-ember', 'theme-purple', 'theme-charcoal');
    document.documentElement.classList.remove('dark');
    
    // 应用新主题
    document.body.classList.add(`theme-${theme}`);
    
    // 深色主题添加 dark 类
    if (['dark', 'midnight', 'ocean', 'forest', 'ember', 'purple', 'charcoal'].includes(theme)) {
      document.documentElement.classList.add('dark');
    }
    
    // 控制 mesh-bg 的显示
    const meshBg = document.querySelector('.mesh-bg') as HTMLElement;
    if (meshBg) {
      if (['light', 'paper', 'warm', 'slate', 'snow', 'cream', 'mint', 'rose'].includes(theme)) {
        meshBg.style.display = 'none';
      } else {
        meshBg.style.display = 'block';
      }
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
      const searchLower = searchQuery.toLowerCase();
      return doc.title.toLowerCase().includes(searchLower);
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
      content: '',
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
    const totalWords = 0;
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
      spaceId: activeSpaceId || spaces[0]?.id,
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
          spaceId: activeSpaceId || spaces[0]?.id,
          parentId: null,
          type: 'doc',
          title: template.title,
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
            content: '',
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

  // --- View Transition Variants (Craft Style - Spring Physics) ---
  const pageVariants = {
      initial: { opacity: 0, y: 2, scale: 0.99 },
      animate: { 
          opacity: 1, 
          y: 0,
          scale: 1,
          transition: { 
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8
          }
      },
      exit: { 
          opacity: 0, 
          y: -2,
          scale: 0.99,
          transition: { 
            type: "spring",
            stiffness: 500,
            damping: 35
          }
      }
  };

  return (
    <div className="flex min-h-screen relative text-gray-900 dark:text-gray-100 overflow-hidden">
      
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
        onOpenSettings={handleOpenSettings}
        // @ts-ignore
        onOpenSearch={() => setModalType('commandPalette')}
        onOpenTagsManagement={() => setModalType('tagsManagement')}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isCollapsed={isSidebarCollapsed}
      />

      <AnimatePresence mode="wait">
        {view === 'doc' && activeDoc ? (
             <motion.main 
                key="editor" 
                className="flex-1 ml-0 overflow-hidden relative min-h-screen"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  marginLeft: isSidebarCollapsed ? 0 : 320,
                  transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
             >
                 <CraftEditor
                   docId={activeDoc.id}
                   pageTitle={activeDoc.title || 'Untitled'}
                   spaceName={activeSpace?.name || 'Personal'}
                   coverImage={activeDoc.coverImage}
                   author={{
                     name: activeDoc.author || 'Anonymous',
                     avatar: activeDoc.authorAvatar
                   }}
                   createdAt={activeDoc.createdAt}
                   updatedAt={activeDoc.updatedAt}
                   onBack={() => {
                     setView(activeSpaceId ? 'space' : 'dashboard');
                     setActiveDocId(null);
                   }}
                   onShare={handleOpenShare}
                 />
             </motion.main>
        ) : (
            <motion.div 
                key={`${view}-${activeSpaceId || 'home'}`} 
                className="flex-1 ml-0 flex flex-col h-screen overflow-hidden"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  marginLeft: isSidebarCollapsed ? 0 : 320,
                  transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
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
                    isSidebarCollapsed={isSidebarCollapsed}
                >  
                    {view === 'dashboard' && (
                        <>
                        <motion.button 
                            whileHover={{ 
                              scale: 1.02, 
                              y: -2,
                              transition: { type: "spring", stiffness: 400, damping: 25 }
                            }}
                            whileTap={{ 
                              scale: 0.98,
                              transition: { type: "spring", stiffness: 600, damping: 30 }
                            }}
                            onClick={() => setShowCraftEditorDemo(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-600 hover:via-red-600 hover:to-pink-700 text-white rounded-xl shadow-lg hover:shadow-xl font-bold will-change-transform"
                            style={{ transform: 'translate3d(0,0,0)' }}
                            title="Craft 编辑器完整演示"
                        >
                            <Sparkles className="w-5 h-5" />
                            <span className="hidden sm:inline">Craft Demo</span>
                        </motion.button>
                        <motion.button 
                            whileHover={{ 
                              scale: 1.02, 
                              y: -2,
                              transition: { type: "spring", stiffness: 400, damping: 25 }
                            }}
                            whileTap={{ 
                              scale: 0.98,
                              transition: { type: "spring", stiffness: 600, damping: 30 }
                            }}
                            onClick={() => setShowSlashTest(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl shadow-lg hover:shadow-xl font-bold will-change-transform"
                            style={{ transform: 'translate3d(0,0,0)' }}
                            title="斜杠命令测试"
                        >
                            <Slash className="w-5 h-5" />
                            <span className="hidden sm:inline">命令测试</span>
                        </motion.button>
                        <motion.button 
                            whileHover={{ 
                              scale: 1.02, 
                              y: -2,
                              transition: { type: "spring", stiffness: 400, damping: 25 }
                            }}
                            whileTap={{ 
                              scale: 0.98,
                              transition: { type: "spring", stiffness: 600, damping: 30 }
                            }}
                            onClick={handleCreateDoc}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl font-bold will-change-transform"
                            style={{ transform: 'translate3d(0,0,0)' }}
                            title={t.newDoc}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="hidden sm:inline">{t.newDoc}</span>
                        </motion.button>
                        </>
                    )}
                    {view === 'space' && activeSpace && (
                         <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleCreateDoc}
                            className="flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg transition-colors"
                            title={t.newDoc}
                        >
                            <Plus className="w-4 h-4" />
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
                            <AnimatePresence mode="wait">
                                <motion.div 
                                    key={`${view}-${filterMode}-${layoutMode}`}
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ 
                                        opacity: 1, 
                                        y: 0,
                                        scale: 1,
                                        transition: {
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 28,
                                            mass: 0.9
                                        }
                                    }}
                                    exit={{ 
                                        opacity: 0, 
                                        y: -8,
                                        scale: 0.98,
                                        transition: {
                                            type: "spring",
                                            stiffness: 400,
                                            damping: 32
                                        }
                                    }}
                                    className={`${layoutMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'flex flex-col gap-2'} pb-24`}
                                >
                                    {filteredDocs.map((doc, index) => (
                                        <motion.div
                                            key={doc.id}
                                            initial={{ opacity: 0, scale: 0.96, y: 12 }}
                                            animate={{ 
                                                opacity: 1, 
                                                scale: 1,
                                                y: 0,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 28,
                                                    mass: 0.6,
                                                    delay: Math.min(index * 0.015, 0.15)
                                                }
                                            }}
                                            style={{
                                                transform: 'translate3d(0,0,0)',
                                                transformStyle: 'preserve-3d'
                                            }}
                                        >
                                            <DocCard 
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
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
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
            </motion.div>
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
      
      <TagsManagementModal 
        isOpen={modalType === 'tagsManagement'}
        onClose={() => setModalType(null)}
        lang={lang}
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

      {/* Craft 编辑器完整演示 */}
      <AnimatePresence>
        {showCraftEditorDemo && (
          <motion.div 
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowCraftEditorDemo(false)}
            />
            <motion.div
              className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden m-4"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setShowCraftEditorDemo(false)}
                  className="p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="w-full h-full overflow-auto">
                <CraftEditorDemo />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 斜杠命令测试页面 */}
      <AnimatePresence>
        {showSlashTest && (
          <motion.div 
            className="fixed inset-0 z-[200] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowSlashTest(false)}
            />
            <motion.div
              className="relative w-full h-full max-w-7xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden m-4"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setShowSlashTest(false)}
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="w-full h-full overflow-auto">
                <SlashCommandDemo />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default App;
