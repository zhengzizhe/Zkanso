import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Settings, Plus, LayoutGrid, Globe, Search, ChevronLeft,
  Calendar as CalendarIcon, Inbox, Layers, Trash2, MoreVertical,
  ChevronRight, Star, Users, Sparkles, Hash, Folder, FolderOpen, ChevronDown, ChevronUp,
  MoreHorizontal, SidebarClose, List, CheckSquare, Image as ImageIcon,
  Paperclip, FileText, ArrowLeft, Clock, LogOut, Link as LinkIcon, Type, Timer, X
} from 'lucide-react';
import { Space, Language, TRANSLATIONS, Doc } from '../types';

interface SidebarProps {
  spaces: Space[];
  activeSpaceId: string | null;
  currentView: string;
  lang: Language;
  docs?: Doc[];
  activeDoc?: Doc | null;
  onNavigate: (view: 'dashboard' | 'space' | 'trash', spaceId?: string) => void;
  onCreateSpace: () => void;
  onBackToHome: () => void;
  onSelectDoc?: (doc: Doc) => void;
  onOpenGlobalSettings: () => void;
  onOpenTemplates: () => void;
  onOpenSearch?: () => void;
  onDateSelect: (date: Date) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Optimized Transition - Craft Style (干脆流畅)
const springTransition = {
  duration: 0.12,
  ease: [0.4, 0, 0.2, 1] as const
};

const sidebarVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 6 : -6,
    opacity: 0,
    zIndex: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    zIndex: 1,
    transition: springTransition
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 6 : -6,
    opacity: 0,
    zIndex: 0,
    transition: { duration: 0.1, ease: [0.4, 0, 1, 1] as const }
  })
};

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.02,
      delayChildren: 0.03
    } 
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 3 }, 
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1] as const
    } 
  }
};

const Sidebar: React.FC<SidebarProps> = React.memo(({ 
  spaces, activeSpaceId, currentView, lang, docs = [], activeDoc,
  onNavigate, onCreateSpace, onBackToHome, onSelectDoc, onOpenGlobalSettings, onOpenTemplates, onOpenSearch, onDateSelect,
  isOpen, onClose
}) => {
  const t = TRANSLATIONS[lang];
  const activeSpace = spaces.find(s => s.id === activeSpaceId);
  const trashCount = docs.filter(d => d.isDeleted).length;
  
  // Depth logic for animation
  const viewDepth = currentView === 'dashboard' || currentView === 'trash' ? 0 : (currentView === 'space' ? 1 : 2);
  const [prevDepth, setPrevDepth] = useState(viewDepth);
  if (viewDepth !== prevDepth) setPrevDepth(viewDepth);
  const direction = viewDepth > prevDepth ? 1 : -1;

  return (
    <>
        {/* Mobile Backdrop */}
        <AnimatePresence>
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm"
                />
            )}
        </AnimatePresence>

        {/* Sidebar Container */}
        <div className={`fixed z-50 transition-transform duration-300 ease-in-out md:translate-x-0 
            ${isOpen ? 'translate-x-0' : '-translate-x-[110%]'} 
            top-0 left-0 bottom-0 w-[280px] md:left-4 md:top-4 md:bottom-4 perspective-[1200px] pointer-events-none`}
        >
          <motion.div 
            className="pointer-events-auto relative w-full h-full md:rounded-[28px] overflow-hidden shadow-2xl border-r md:border border-white/20 dark:border-white/10 ring-1 ring-white/10 will-change-transform bg-white/10 dark:bg-gray-900/10 backdrop-blur-[60px] saturate-[200%]"
          >
            {/* 朗胧内光效 */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-white/10 pointer-events-none"></div>
            
            {/* 动态光晕效果 */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
            </div>
            
            <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                {(currentView === 'dashboard' || currentView === 'trash') && (
                    <motion.div 
                        key="home"
                        custom={direction}
                        variants={sidebarVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full flex flex-col"
                    >
                         <HomeSidebarContent 
                            spaces={spaces} t={t} lang={lang} 
                            currentView={currentView}
                            onNavigate={onNavigate} onCreateSpace={onCreateSpace}
                            onOpenSettings={onOpenGlobalSettings}
                            onOpenTemplates={onOpenTemplates}
                            onOpenSearch={onOpenSearch}
                            onDateSelect={onDateSelect}
                            trashCount={trashCount}
                            onClose={onClose}
                        />
                    </motion.div>
                )}

                {currentView === 'space' && activeSpace && (
                    <motion.div 
                        key="space"
                        custom={direction}
                        variants={sidebarVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full flex flex-col"
                    >
                         <SpaceSidebarContent 
                            space={activeSpace} docs={docs} activeDoc={activeDoc} t={t} lang={lang}
                            onBack={onBackToHome} onSelectDoc={onSelectDoc}
                        />
                    </motion.div>
                )}

                {currentView === 'doc' && activeDoc && (
                    <motion.div 
                        key="doc"
                        custom={direction}
                        variants={sidebarVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        className="absolute inset-0 w-full h-full flex flex-col"
                    >
                         <DocSidebarContent 
                            doc={activeDoc} allDocs={docs} t={t} lang={lang}
                            onBack={() => onNavigate(activeDoc.spaceId ? 'space' : 'dashboard', activeDoc.spaceId)}
                            onSelectDoc={onSelectDoc}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        </div>
    </>
  );
}, (prev, next) => {
    // Custom comparison to prevent typing lag
    return (
        prev.currentView === next.currentView &&
        prev.activeSpaceId === next.activeSpaceId &&
        prev.activeDoc?.id === next.activeDoc?.id &&
        prev.activeDoc?.title === next.activeDoc?.title &&
        prev.activeDoc?.isDeleted === next.activeDoc?.isDeleted &&
        prev.spaces === next.spaces &&
        prev.lang === next.lang &&
        prev.isOpen === next.isOpen && 
        prev.docs?.length === next.docs?.length
    );
});

// --- Home Sidebar Content ---
const HomeSidebarContent = ({ spaces, t, lang, currentView, onNavigate, onCreateSpace, onOpenSettings, onOpenTemplates, onOpenSearch, onDateSelect, trashCount, onClose }: any) => {
    const [spacesExpanded, setSpacesExpanded] = useState(spaces.length <= 5);
    const displaySpaces = spacesExpanded ? spaces : spaces.slice(0, 5);
    
    return (
    <motion.div className="flex flex-col h-full text-gray-800 dark:text-gray-100" variants={staggerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} className="p-5 flex items-center justify-between gap-3">
             <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-base shadow-lg ring-2 ring-white/20">
                    K
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-gray-100 tracking-tight text-lg leading-tight">Kanso</span>
                    <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Workspace</span>
                </div>
             </div>
             <button onClick={onClose} className="md:hidden p-2 rounded-lg hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-500">
                 <X className="w-5 h-5" />
             </button>
        </motion.div>

        {/* Quick Search */}
        <motion.div variants={itemVariants} className="px-4 mb-6">
            <button 
                onClick={onOpenSearch}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white/70 dark:bg-white/5 hover:bg-white/90 border border-white/50 rounded-xl transition-all backdrop-blur-sm group shadow-sm hover:shadow-md ring-1 ring-black/5"
            >
                <div className="flex items-center gap-2.5 text-gray-500 dark:text-gray-400">
                    <Search className="w-4 h-4" />
                    <span className="text-sm font-medium">{t.search}</span>
                </div>
                <span className="text-[10px] bg-gray-200/50 dark:bg-white/10 px-1.5 py-0.5 rounded text-gray-500 font-bold group-hover:text-gray-700 transition-colors border border-gray-200 dark:border-white/5">⌘ K</span>
            </button>
        </motion.div>

        <div className="flex-1 overflow-y-auto px-3 custom-scrollbar pb-4 space-y-6">
            {/* Primary Nav */}
            <motion.div variants={staggerVariants} className="space-y-1.5">
                <NavItem 
                    icon={<Clock className="w-4 h-4" />} 
                    label={t.recents} 
                    isActive={currentView === 'dashboard'} 
                    color="text-blue-600" 
                    bgColor="bg-blue-100 dark:bg-blue-900/40" 
                    onClick={() => { onNavigate('dashboard'); onClose(); }} 
                />
                <NavItem 
                    icon={<LayoutGrid className="w-4 h-4" />} 
                    label={t.templates} 
                    isActive={false} 
                    color="text-purple-600" 
                    bgColor="bg-purple-100 dark:bg-purple-900/40" 
                    onClick={() => { onOpenTemplates(); onClose(); }} 
                />
                <NavItem 
                    icon={<Trash2 className="w-4 h-4" />} 
                    label={t.trash} 
                    isActive={currentView === 'trash'} 
                    count={trashCount} 
                    color="text-red-500" 
                    bgColor="bg-red-100 dark:bg-red-900/40" 
                    onClick={() => { onNavigate('trash'); onClose(); }} 
                />
            </motion.div>

            {/* Calendar Widget */}
            <motion.div variants={itemVariants}>
                 <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.calendar}</span>
                 </div>
                <MiniCalendar onDateSelect={(d) => { onDateSelect(d); onClose(); }} />
            </motion.div>

            {/* Spaces List - 优化版 */}
            <motion.div variants={staggerVariants}>
                 <div className="flex items-center justify-between px-2 mb-2 mt-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{t.spaces}</span>
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-200/50 dark:bg-white/5 px-1.5 py-0.5 rounded">{spaces.length}</span>
                    </div>
                    <button onClick={(e) => {e.stopPropagation(); onCreateSpace()}} className="hover:bg-gray-200/60 p-1 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                 </div>
                 <div className="space-y-1 max-h-[280px] overflow-y-auto custom-scrollbar pr-1">
                    {displaySpaces.map((space: Space) => (
                        <motion.button
                            key={space.id}
                            variants={itemVariants}
                            whileHover={{ scale: 1.01, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
                            onClick={() => { onNavigate('space', space.id); onClose(); }}
                            className="flex items-center w-full px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 transition-colors group relative overflow-hidden hover:shadow-sm"
                        >
                            <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-300">{space.icon}</span>
                            <span className="text-sm font-semibold group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{space.name}</span>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                        </motion.button>
                    ))}
                 </div>
                 {/* 展开/收起按钮 */}
                 {spaces.length > 5 && (
                    <button 
                        onClick={() => setSpacesExpanded(!spacesExpanded)}
                        className="w-full mt-2 py-1.5 text-center text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                        {spacesExpanded ? (
                            <>
                                <ChevronUp className="w-3 h-3" />
                                {lang === 'zh' ? '收起' : 'Collapse'}
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3" />
                                {lang === 'zh' ? `展开全部 (${spaces.length - 5}+)` : `Expand (${spaces.length - 5}+)`}
                            </>
                        )}
                    </button>
                 )}
            </motion.div>
        </div>

        {/* User Profile */}
        <UserProfile t={t} onOpenSettings={onOpenSettings} />
    </motion.div>
    );
};

// --- User Profile Component ---
const UserProfile = ({ t, onOpenSettings }: any) => (
    <motion.div variants={itemVariants} className="p-3 mt-auto">
        <div className="p-2 bg-white/70 dark:bg-white/5 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer hover:bg-white/90">
            <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold shadow-md ring-2 ring-white dark:ring-white/10">
                    ME
                 </div>
                 <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">Creator</span>
                    <span className="text-[10px] text-gray-500 font-medium group-hover:text-indigo-600 transition-colors">Free Plan</span>
                 </div>
                 <button onClick={onOpenSettings} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    <Settings className="w-4 h-4" />
                 </button>
            </div>
        </div>
    </motion.div>
);

// --- Space Sidebar Content ---
const SpaceSidebarContent = ({ space, docs, activeDoc, t, onBack, lang, onSelectDoc }: any) => {
    // State for folder drill-down navigation
    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);

    // Sync sidebar with active doc
    useEffect(() => {
        if (activeDoc && activeDoc.spaceId === space.id) {
            // If activeDoc is a folder, show its contents (i.e. we are 'in' that folder)
            // If activeDoc is a page, show its siblings (i.e. we are 'in' its parent folder)
            if (activeDoc.type === 'folder') {
                setCurrentFolderId(activeDoc.id);
            } else {
                setCurrentFolderId(activeDoc.parentId);
            }
        }
    }, [activeDoc, space.id]);

    // Filter docs based on space, deletion status, and current folder level
    const displayDocs = useMemo(() => {
        return docs.filter((d: Doc) => 
            d.spaceId === space.id && 
            !d.isDeleted && 
            d.parentId === (currentFolderId || null)
        );
    }, [docs, space.id, currentFolderId]);

    // Calculate breadcrumb trail
    const breadcrumbs = useMemo(() => {
        const path: Doc[] = [];
        let currId = currentFolderId;
        while(currId) {
            const d = docs.find((x: Doc) => x.id === currId);
            if(d) {
                path.unshift(d);
                currId = d.parentId;
            } else {
                break;
            }
        }
        return path;
    }, [currentFolderId, docs]);

    return (
        <motion.div className="flex flex-col h-full" variants={staggerVariants} initial="hidden" animate="visible">
            <motion.div variants={itemVariants} className="px-4 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-2xl filter drop-shadow-sm">{space.icon}</span>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">{space.name}</h2>
                </div>
                <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-white/10 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                    <SidebarClose className="w-4 h-4" />
                </button>
            </motion.div>

            <motion.div variants={itemVariants} className="px-4 mb-6 relative group">
                <Search className="absolute left-7 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <input 
                    type="text" 
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border border-black/5 dark:border-white/5 rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none transition-all placeholder-gray-400 text-gray-800 dark:text-gray-100 shadow-sm focus:shadow-md focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
                />
            </motion.div>

            <motion.nav variants={staggerVariants} className="px-3 space-y-1 mb-6">
                <SpaceNavItem icon={<Sparkles className="w-4 h-4" />} label={t.allDocs} count={docs.filter((d:Doc) => d.spaceId === space.id && !d.isDeleted).length} color="text-indigo-500" bgColor="bg-indigo-50" />
                <SpaceNavItem icon={<Star className="w-4 h-4" />} label={t.favorites} count={docs.filter((d:Doc) => d.spaceId === space.id && !d.isDeleted && d.isFavorite).length} color="text-amber-500" bgColor="bg-amber-50" />
                <SpaceNavItem icon={<Users className="w-4 h-4" />} label={t.sharedWithMe} color="text-teal-500" bgColor="bg-teal-50" />
            </motion.nav>

            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4">
                 <motion.div variants={itemVariants} className="mb-6">
                    <SectionHeader title={t.tags} />
                    <div className="flex flex-wrap gap-2 mt-2 px-1">
                        {[
                            { label: 'colors', color: 'bg-rose-50 text-rose-600 border-rose-100' }, 
                            { label: 'design', color: 'bg-indigo-50 text-indigo-600 border-indigo-100' }, 
                            { label: 'planning', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' }
                        ].map(tag => (
                            <motion.button
                                key={tag.label}
                                whileHover={{ scale: 1.05, y: -1 }}
                                className={`flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold border ${tag.color} dark:bg-white/5 dark:border-white/10 dark:text-gray-300 transition-all shadow-sm`}
                            >
                                <Hash className="w-2.5 h-2.5 mr-1 opacity-70" />
                                <span>{tag.label}</span>
                            </motion.button>
                        ))}
                    </div>
                 </motion.div>

                 <motion.div variants={staggerVariants}>
                    <SectionHeader title={t.spaceContent} />
                    
                    {/* Breadcrumb Navigation */}
                    {currentFolderId && (
                        <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 mb-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-white/5 rounded-lg border border-gray-200/50 dark:border-white/5">
                            <button 
                                onClick={() => setCurrentFolderId(null)} 
                                className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline px-1 rounded"
                            >
                                {space.name}
                            </button>
                            {breadcrumbs.map((crumb, i) => (
                                <React.Fragment key={crumb.id}>
                                    <span className="opacity-40">/</span>
                                    <button 
                                        onClick={() => setCurrentFolderId(crumb.id)} 
                                        disabled={i === breadcrumbs.length - 1}
                                        className={`px-1 rounded max-w-[80px] truncate ${i === breadcrumbs.length - 1 ? 'font-bold text-gray-800 dark:text-gray-200 cursor-default' : 'hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline'}`}
                                    >
                                        {crumb.title}
                                    </button>
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    <div className="mt-1 space-y-0.5">
                         {/* Back Button (only if nested) */}
                         {currentFolderId && (
                            <button 
                                onClick={() => {
                                    const curr = docs.find((d:Doc) => d.id === currentFolderId);
                                    setCurrentFolderId(curr?.parentId || null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-lg mb-1 transition-colors"
                            >
                                <ArrowLeft className="w-3 h-3" />
                                Back
                            </button>
                        )}

                        {/* Document List */}
                         {displayDocs.length > 0 ? displayDocs.map((doc: Doc) => (
                             <FolderTreeItem 
                                key={doc.id} 
                                doc={doc} 
                                allDocs={docs} // Pass all docs to check for children count if needed
                                onSelect={onSelectDoc} 
                                onNavigate={(d: Doc) => setCurrentFolderId(d.id)}
                            />
                         )) : (
                             <div className="px-4 py-3 text-xs text-gray-400 italic text-center">Empty folder</div>
                         )}
                    </div>
                 </motion.div>
            </div>
            
            <div className="p-4 mt-auto">
                <button onClick={onBack} className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl text-gray-500 hover:bg-white/60 dark:hover:bg-white/10 hover:text-indigo-600 transition-colors border border-transparent hover:border-gray-200/50">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t.backToHome}
                </button>
            </div>
        </motion.div>
    );
};

// --- Doc Sidebar Content ---
const DocSidebarContent = ({ doc, allDocs = [], t, onBack, lang, onSelectDoc }: { doc: Doc, allDocs?: Doc[], t: any, onBack: () => void, lang: Language, onSelectDoc?: (d: Doc) => void }) => {
    const [activeTab, setActiveTab] = useState('outline');
    
    // 1. Parsing Outline
    const outline = useMemo(() => {
        if(!doc.content) return [];
        return doc.content.split('\n')
            .filter(l => l.startsWith('#'))
            .map((text, i) => ({ 
                text: text.replace(/#+\s/,''), 
                level: (text.match(/^#+/)||[''])[0].length, 
                id: i 
            }));
    }, [doc.content]);

    // 2. Metadata Stats
    const stats = useMemo(() => {
        const words = doc.content ? doc.content.split(/\s+/).length : 0;
        const readTime = Math.max(1, Math.ceil(words / 200)) + ' min';
        return { words, readTime };
    }, [doc.content]);

    // 3. Backlinks Logic
    const backlinks = useMemo(() => {
        if (!allDocs.length) return [];
        return allDocs.filter(d => 
            d.id !== doc.id && 
            !d.isDeleted &&
            d.content.toLowerCase().includes(doc.title.toLowerCase())
        );
    }, [doc, allDocs]);

    return (
        <motion.div className="flex flex-col h-full" variants={staggerVariants} initial="hidden" animate="visible">
            {/* Top Bar */}
            <motion.div variants={itemVariants} className="px-4 py-5 flex items-center gap-3">
                <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 transition-colors shadow-sm ring-1 ring-black/5 hover:ring-black/10 bg-white/40">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate leading-tight">{doc.title || t.untitled}</h2>
                    <div className="flex items-center gap-1 mt-0.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="text-[10px] text-gray-400 font-medium">Synced</span>
                    </div>
                </div>
            </motion.div>

            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-6 space-y-6">
                {/* Metadata Grid */}
                <motion.div variants={itemVariants} className="grid grid-cols-2 gap-2">
                    <MetadataItem icon={<Type className="w-3 h-3 text-blue-500" />} label={t.wordCount} value={stats.words} />
                    <MetadataItem icon={<Timer className="w-3 h-3 text-orange-500" />} label={t.readTime} value={stats.readTime} />
                    <MetadataItem icon={<CalendarIcon className="w-3 h-3 text-purple-500" />} label={t.updated} value="Today" />
                    <MetadataItem icon={<LinkIcon className="w-3 h-3 text-emerald-500" />} label={t.backlinks} value={backlinks.length} />
                </motion.div>

                {/* Tabs */}
                <motion.div variants={itemVariants} className="flex p-1 bg-gray-200/50 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/5">
                    {['outline', 'links', 'files'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${activeTab===tab ? 'bg-white dark:bg-white/10 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                           {t[tab] || tab}
                        </button>
                    ))}
                </motion.div>

                {/* Tab Content */}
                <motion.div variants={staggerVariants} className="min-h-[100px]">
                    {activeTab === 'outline' && (
                        <div className="mt-2 px-1 relative">
                            {outline.length > 0 ? (
                                <>
                                    {/* Vertical Guide Line */}
                                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gray-300/40 dark:bg-white/10" />
                                    
                                    {outline.map((h, i) => (
                                        <motion.div 
                                            key={i} 
                                            variants={itemVariants}
                                            className="group relative flex items-center py-1 cursor-pointer transition-colors"
                                        >
                                            {/* Hierarchy Dot */}
                                            <div className="absolute left-[8px] z-10 flex items-center justify-center w-2">
                                                <div className={`rounded-full transition-all duration-300 group-hover:scale-150 group-hover:bg-indigo-500 box-content border-2 border-transparent
                                                    ${h.level === 1 ? 'w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500' : 
                                                      h.level === 2 ? 'w-1 h-1 bg-gray-300 dark:bg-gray-600' : 'w-1 h-1 bg-gray-200 dark:bg-gray-700'}
                                                `} />
                                            </div>

                                            <div 
                                                className={`ml-5 pr-2 py-1 rounded-md w-full truncate transition-all
                                                    ${h.level === 1 ? 'text-xs font-bold text-gray-800 dark:text-gray-200' : 
                                                      h.level === 2 ? 'text-[11px] font-medium text-gray-600 dark:text-gray-400' : 'text-[10px] text-gray-500 dark:text-gray-500'}
                                                    hover:bg-gray-200/50 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-indigo-300
                                                `}
                                                style={{ paddingLeft: `${(h.level - 1) * 8}px` }}
                                            >
                                                {h.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            ) : <EmptyState label="Empty Outline" />}
                        </div>
                    )}
                    {/* ... other tabs ... */}
                    {activeTab !== 'outline' && <EmptyState label={`No ${activeTab} found`} />}
                </motion.div>
            </div>
        </motion.div>
    );
};

// --- Helpers ---
const MetadataItem = ({ icon, label, value }: any) => (
    <div className="p-3 bg-white/60 dark:bg-white/5 border border-white/60 dark:border-white/5 rounded-xl flex flex-col gap-1 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-[9px] font-extrabold uppercase tracking-wider">
            {icon}
            <span>{label}</span>
        </div>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-100 font-mono">{value}</span>
    </div>
);

const EmptyState = ({ label }: { label: string }) => (
    <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-600 gap-2">
        <Inbox className="w-8 h-8 opacity-30 stroke-1" />
        <span className="text-xs font-medium opacity-60">{label}</span>
    </div>
);

const NavItem = ({ icon, label, isActive, color, bgColor, onClick, count }: any) => (
    <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.01, x: 2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={`relative flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all group overflow-hidden ${isActive ? 'bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/10 dark:ring-white/10' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-200'}`}
    >
        <div className="flex items-center">
            {isActive && (
                 <motion.div 
                    layoutId="activeNav"
                    className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full ${color.replace('text-', 'bg-')}`}
                 />
            )}
            <div className={`mr-3 ml-1 p-1.5 rounded-lg transition-colors ${isActive ? bgColor : 'bg-transparent'} ${isActive ? color : `text-gray-400 group-hover:${color} group-hover:bg-gray-100/50 dark:group-hover:bg-white/5`}`}>
                 {icon}
            </div>
            <span className={`text-sm font-semibold tracking-wide ${isActive ? 'text-gray-900 dark:text-white' : ''}`}>{label}</span>
        </div>
        {count !== undefined && count > 0 && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isActive ? 'bg-gray-100 dark:bg-white/20 text-gray-700 dark:text-white' : 'bg-gray-200/50 dark:bg-white/10 text-gray-500'}`}>
                {count}
            </span>
        )}
    </motion.button>
);

const SpaceNavItem = ({ icon, label, count, color, bgColor }: any) => (
    <motion.div 
        variants={itemVariants}
        whileHover={{ x: 4, backgroundColor: "rgba(255, 255, 255, 0.6)" }}
        className="flex items-center justify-between px-3 py-2 rounded-xl text-gray-600 dark:text-gray-300 cursor-pointer transition-colors group"
    >
        <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-lg ${color} bg-opacity-20 group-hover:bg-opacity-100 group-hover:text-white transition-all duration-300 ${bgColor}`}>{icon}</div>
            <span className="text-sm font-semibold">{label}</span>
        </div>
        {count !== undefined && <span className="text-[10px] font-bold text-gray-400 bg-white dark:bg-white/10 px-2 py-0.5 rounded-md border border-gray-100 dark:border-white/5">{count}</span>}
    </motion.div>
);

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center justify-between px-2 py-1 mb-1 group cursor-pointer hover:bg-gray-100/50 dark:hover:bg-white/5 rounded-lg transition-colors">
        <span className="text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{title}</span>
        <ChevronRight className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
);

const FolderTreeItem = ({ doc, allDocs, onSelect, onNavigate, depth = 0 }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    // If we have onNavigate, we assume "Drill-down" mode, so we don't render children recursively here
    // But we still calculate them to show indicator
    const children = allDocs.filter((d:Doc) => d.parentId === doc.id);
    const isFolder = doc.type === 'folder';
    const isNavMode = !!onNavigate;

    return (
        <motion.div variants={itemVariants} className="relative">
             {/* Indentation Guide Line (Only if NOT in nav mode and depth > 0) */}
             {!isNavMode && depth > 0 && (
                <div 
                    className="absolute top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-700" 
                    style={{ left: `${(depth * 14) + 14}px` }} 
                />
            )}
            <div 
                className="group flex items-center px-2 py-1.5 rounded-lg hover:bg-white/60 dark:hover:bg-white/10 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all relative z-10"
                style={{ paddingLeft: isNavMode ? '10px' : `${10 + depth * 14}px` }}
                onClick={() => {
                    if (isNavMode && isFolder) {
                        onNavigate(doc);
                    } else {
                        onSelect && onSelect(doc);
                    }
                }}
            >
                {/* Chevron: Hide in Nav Mode */}
                {!isNavMode && (
                    <div onClick={(e) => {e.stopPropagation(); setIsOpen(!isOpen)}} className={`mr-1.5 p-0.5 rounded-md hover:bg-black/5 dark:hover:bg-white/20 transition-colors ${!children.length && isFolder ? 'invisible' : ''}`}>
                        <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                    </div>
                )}

                <div className="mr-2 text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {isFolder ? (
                        (isOpen && !isNavMode) ? <FolderOpen className="w-4 h-4 text-amber-400" /> : <Folder className="w-4 h-4 text-amber-400/80" />
                    ) : (
                        <FileText className="w-3.5 h-3.5" />
                    )}
                </div>
                <span className={`text-sm truncate ${isFolder ? 'font-semibold text-gray-700 dark:text-gray-200' : 'font-medium'}`}>{doc.title || 'Untitled'}</span>
                
                {/* Drill-down indicator for Nav Mode */}
                {isNavMode && isFolder && (
                    <ChevronRight className="w-3 h-3 ml-auto text-gray-300 group-hover:text-indigo-400" />
                )}
            </div>
            
            {/* Recursive Children: Only if NOT in nav mode */}
            {!isNavMode && (
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                        >
                            {children.map((child:Doc) => <FolderTreeItem key={child.id} doc={child} allDocs={allDocs} onSelect={onSelect} depth={depth + 1} />)}
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </motion.div>
    );
};

const MiniCalendar = ({ onDateSelect }: { onDateSelect: (d: Date) => void }) => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

    return (
        <motion.div whileHover={{ scale: 1.02 }} className="p-4 bg-white/70 dark:bg-white/5 rounded-2xl border border-white/60 dark:border-white/10 shadow-sm backdrop-blur-sm cursor-default group ring-1 ring-black/5">
            <div className="flex items-center justify-between mb-3 px-1">
                 <span className="text-xs font-bold text-gray-700 dark:text-gray-200">{today.toLocaleDateString('default', { month: 'long', year: 'numeric' })}</span>
                 <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                 </div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <span key={d} className="text-[9px] font-extrabold text-gray-300 dark:text-gray-600">{d}</span>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
                {Array.from({length: firstDay}).map((_, i) => <div key={`empty-${i}`} />)}
                {Array.from({length: daysInMonth}).map((_, i) => {
                    const d = i + 1;
                    const isToday = d === today.getDate();
                    return (
                        <div 
                            key={d} 
                            onClick={() => onDateSelect(new Date(today.getFullYear(), today.getMonth(), d))}
                            className={`h-6 w-6 flex items-center justify-center rounded-lg text-[10px] font-bold transition-all cursor-pointer ${isToday ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-none scale-110' : 'text-gray-500 hover:bg-white hover:shadow-sm hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/10'}`}
                        >
                            {d}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default Sidebar;