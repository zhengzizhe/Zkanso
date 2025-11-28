
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Globe, Link as LinkIcon, ChevronDown, UserPlus, 
  Check, Trash2, Image as ImageIcon, Smile, Type, Palette, Monitor, RefreshCcw,
  Copy, FileDown, LayoutGrid, CheckCircle, Lock, Calendar, ToggleLeft, ToggleRight,
  Search, Command, Home, Plus, Moon, Sun, ArrowRight, FileText, Hash
} from 'lucide-react';
import { Doc, Language, Theme, TRANSLATIONS, Collaborator, Template, Space } from '../types';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface ShareModalProps extends ModalProps {
  doc: Doc;
}

interface SettingsModalProps extends ModalProps {
  doc: Doc;
  onUpdate: (updates: Partial<Doc>) => void;
  onDelete: () => void;
  onRestore?: () => void; // Add restore callback
  onDuplicate: () => void;
  onExport: () => void;
}

interface GlobalSettingsModalProps extends ModalProps {
    theme: Theme;
    setTheme: (t: Theme) => void;
    setLang: (l: Language) => void;
}

interface TemplatesModalProps extends ModalProps {
    templates: Template[];
    onSelect: (template: Template) => void;
}

interface CommandPaletteProps extends ModalProps {
    docs: Doc[];
    spaces: Space[];
    onNavigate: (view: 'dashboard' | 'space' | 'doc', id?: string) => void;
    onCreateDoc: () => void;
    onToggleTheme: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.08 } },
  exit: { opacity: 0, transition: { duration: 0.06 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.1,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.98,
    transition: { duration: 0.08, ease: [0.4, 0, 1, 1] } 
  }
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, lang, docs, spaces, onNavigate, onCreateDoc, onToggleTheme }) => {
    const t = TRANSLATIONS[lang];
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    type ActionData = { id: string; label: string; icon: React.ElementType; action: () => void };
    type CommandItem = 
        | { type: 'action'; data: ActionData }
        | { type: 'space'; data: Space }
        | { type: 'doc'; data: Doc };

    // 优化：使用useMemo缓存筛选结果，只在query或docs变化时重新计算
    const filteredDocs = useMemo(() => {
        if (!query) return docs.slice(0, 3); // 显示最近3个
        const lowerQuery = query.toLowerCase();
        return docs
            .filter(d => !d.isDeleted && d.title.toLowerCase().includes(lowerQuery))
            .slice(0, 5); // 限制5个
    }, [docs, query]);

    const filteredSpaces = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return spaces
            .filter(s => s.name.toLowerCase().includes(lowerQuery))
            .slice(0, 3);
    }, [spaces, query]);

    const actions: ActionData[] = useMemo(() => {
        const allActions = [
            { id: 'create', label: t.cmdCreateDoc, icon: Plus, action: () => onCreateDoc() },
            { id: 'home', label: t.cmdGoHome, icon: Home, action: () => onNavigate('dashboard') },
            { id: 'theme', label: t.cmdToggleTheme, icon: Moon, action: () => onToggleTheme() },
        ];
        if (!query) return allActions;
        const lowerQuery = query.toLowerCase();
        return allActions.filter(a => a.label.toLowerCase().includes(lowerQuery));
    }, [query, t, onCreateDoc, onNavigate, onToggleTheme]);

    // 优化：合并所有items，并缓存结果
    const allItems: CommandItem[] = useMemo(() => [
        ...actions.map(a => ({ type: 'action' as const, data: a })),
        ...filteredSpaces.map(s => ({ type: 'space' as const, data: s })),
        ...filteredDocs.map(d => ({ type: 'doc' as const, data: d }))
    ], [actions, filteredSpaces, filteredDocs]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            // 优化：立即focus，不用setTimeout
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % allItems.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            executeItem(allItems[selectedIndex]);
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    const executeItem = (item: CommandItem) => {
        if (!item) return;
        if (item.type === 'action') {
            item.data.action();
        } else if (item.type === 'space') {
            onNavigate('space', item.data.id);
        } else if (item.type === 'doc') {
            onNavigate('doc', item.data.id);
        }
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
                     <motion.div 
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/60"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <motion.div
                        className="w-full max-w-[600px] bg-[#fafafa]/95 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10 flex flex-col max-h-[60vh] ring-1 ring-black/5 will-change-transform"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <div className="flex items-center px-4 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                            <Search className="w-5 h-5 text-gray-400 mr-3" />
                            <input 
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={t.cmdPlaceholder}
                                className="flex-1 bg-transparent border-none outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400"
                            />
                            <div className="text-xs font-bold text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">ESC</div>
                        </div>

                        <div className="overflow-y-auto p-2 custom-scrollbar will-change-scroll">
                            {allItems.length === 0 ? (
                                <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                                    {t.cmdNoResults}
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {actions.length > 0 && (
                                        <div className="px-2 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.cmdActions}</div>
                                    )}
                                    {allItems.filter((i): i is { type: 'action'; data: ActionData } => i.type === 'action').map((item, idx) => {
                                        const globalIdx = idx;
                                        const isSelected = globalIdx === selectedIndex;
                                        return (
                                            <button
                                                key={`action-${idx}`}
                                                onClick={() => executeItem(item)}
                                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                            >
                                                <item.data.icon className="w-4 h-4" />
                                                <span>{item.data.label}</span>
                                                {isSelected && <ArrowRight className="w-4 h-4 ml-auto opacity-50" />}
                                            </button>
                                        );
                                    })}

                                    {filteredSpaces.length > 0 && (
                                        <div className="px-2 py-1.5 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.spaces}</div>
                                    )}
                                    {allItems.filter((i): i is { type: 'space'; data: Space } => i.type === 'space').map((item, idx) => {
                                        const globalIdx = actions.length + idx;
                                        const isSelected = globalIdx === selectedIndex;
                                        return (
                                            <button
                                                key={`space-${item.data.id}`}
                                                onClick={() => executeItem(item)}
                                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                            >
                                                <span className="text-base">{item.data.icon}</span>
                                                <span>{item.data.name}</span>
                                                {isSelected && <ArrowRight className="w-4 h-4 ml-auto opacity-50" />}
                                            </button>
                                        );
                                    })}
                                    
                                    {(filteredDocs.length > 0) && (
                                        <div className="px-2 py-1.5 mt-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.allDocs}</div>
                                    )}
                                    {allItems.filter((i): i is { type: 'doc'; data: Doc } => i.type === 'doc').map((item, idx) => {
                                        const globalIdx = actions.length + filteredSpaces.length + idx;
                                        const isSelected = globalIdx === selectedIndex;
                                        return (
                                            <button
                                                key={`doc-${item.data.id}`}
                                                onClick={() => executeItem(item)}
                                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isSelected ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                            >
                                                <FileText className="w-4 h-4 opacity-70" />
                                                <span className="truncate">{item.data.title || t.untitled}</span>
                                                {isSelected && <ArrowRight className="w-4 h-4 ml-auto opacity-50" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// 优化：模板卡片组件，使用 memo 避免不必要的重渲染
const TemplateCard = React.memo<{ template: Template; isSelected: boolean; onSelect: (t: Template) => void }>(({ template, isSelected, onSelect }) => (
    <motion.div
        onClick={() => onSelect(template)}
        initial={false}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`relative group p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-3 will-change-transform ${
            isSelected
                ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-500 ring-1 ring-indigo-500' 
                : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-700'
        }`}
    >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl shadow-sm ${template.color}`}>
            {template.icon}
        </div>
        <div>
            <h4 className="font-bold text-gray-800 dark:text-white text-sm">{template.title}</h4>
            <p className="text-xs text-gray-400 mt-1 line-clamp-3 leading-relaxed">{template.content.replace(/#/g, '').substring(0, 60)}...</p>
        </div>
        {isSelected && (
            <div className="absolute top-3 right-3 text-indigo-500">
                <CheckCircle className="w-5 h-5 fill-indigo-100 dark:fill-indigo-900/50" />
            </div>
        )}
    </motion.div>
), (prev, next) => prev.isSelected === next.isSelected && prev.template.id === next.template.id);

TemplateCard.displayName = 'TemplateCard';

export const TemplatesModal: React.FC<TemplatesModalProps> = ({ isOpen, onClose, lang, templates, onSelect }) => {
    const t = TRANSLATIONS[lang];
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

    // 优化：ESC键关闭
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);
    
    // 优化：打开时重置选择状态
    useEffect(() => {
        if (isOpen) {
            setSelectedCategory('all');
            setSelectedTemplate(null);
        }
    }, [isOpen]);

    const categories = [
        { id: 'all', label: t.cat_all },
        { id: 'work', label: t.cat_work },
        { id: 'personal', label: t.cat_personal },
        { id: 'education', label: t.cat_education },
    ];

    // 优化：缓存筛选结果
    const filteredTemplates = useMemo(() => {
        return selectedCategory === 'all' 
            ? templates 
            : templates.filter(temp => temp.category === selectedCategory);
    }, [selectedCategory, templates]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                     <motion.div 
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <motion.div
                        className="w-full max-w-[800px] h-[600px] bg-[#fafafa]/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10 flex flex-col md:flex-row will-change-transform"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Sidebar */}
                        <div className="w-full md:w-56 bg-gray-50/80 dark:bg-gray-800/50 border-r border-gray-200 dark:border-white/5 p-4 flex flex-col">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6 px-2 flex items-center gap-2">
                                <LayoutGrid className="w-5 h-5 text-indigo-500" />
                                {t.templatesGallery}
                            </h3>
                            <div className="space-y-1 flex-1">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.id)}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.id ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col h-full overflow-hidden">
                             <div className="p-4 border-b border-gray-100 dark:border-white/5 flex justify-between items-center">
                                 <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{categories.find(c => c.id === selectedCategory)?.label}</span>
                                 <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400">
                                     <X className="w-5 h-5" />
                                 </button>
                             </div>
                             
                             <div className="flex-1 overflow-y-auto p-6 custom-scrollbar will-change-scroll">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                     {filteredTemplates.map(template => (
                                         <TemplateCard 
                                             key={template.id}
                                             template={template}
                                             isSelected={selectedTemplate?.id === template.id}
                                             onSelect={setSelectedTemplate}
                                         />
                                     ))}
                                 </div>
                             </div>

                             {/* Footer Action */}
                             <div className="p-4 border-t border-gray-100 dark:border-white/5 bg-white/50 dark:bg-black/20 flex justify-end gap-3 backdrop-blur-sm">
                                 <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors">
                                     Cancel
                                 </button>
                                 <button 
                                    disabled={!selectedTemplate}
                                    onClick={() => selectedTemplate && onSelect(selectedTemplate)}
                                    className="px-6 py-2 text-sm font-bold bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                                 >
                                     {t.useTemplate}
                                 </button>
                             </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export const GlobalSettingsModal: React.FC<GlobalSettingsModalProps> = ({ isOpen, onClose, lang, theme, setTheme, setLang }) => {
    const t = TRANSLATIONS[lang];
    const [activeTab, setActiveTab] = useState<'general' | 'appearance'>('appearance');

    // ESC 键关闭
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                     <motion.div 
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <motion.div
                        className="w-full max-w-[600px] bg-[#fafafa]/95 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10 flex h-[500px]"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Sidebar */}
                        <div className="w-48 bg-gray-50/50 dark:bg-gray-800/30 border-r border-gray-200/50 dark:border-white/10 p-4 space-y-2">
                             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-4 mt-2">{t.globalSettings}</h3>
                             <button 
                                onClick={() => setActiveTab('appearance')} 
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-white dark:bg-white/10 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                             >
                                <Palette className="w-4 h-4" />
                                {t.appearance}
                             </button>
                             <button 
                                onClick={() => setActiveTab('general')} 
                                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'general' ? 'bg-white dark:bg-white/10 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'}`}
                             >
                                <Monitor className="w-4 h-4" />
                                {t.general}
                             </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-8 overflow-y-auto">
                             <div className="flex items-center justify-between mb-8">
                                 <h2 className="text-xl font-bold text-gray-800 dark:text-white">{activeTab === 'appearance' ? t.appearance : t.general}</h2>
                                 <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-400">
                                     <X className="w-5 h-5" />
                                 </button>
                             </div>

                             {activeTab === 'appearance' && (
                                 <div className="space-y-6">
                                     <div>
                                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4 block">{t.theme}</label>
                                         <div className="grid grid-cols-3 gap-4">
                                             <ThemeOption 
                                                label={t.light} 
                                                isActive={theme === 'light'} 
                                                onClick={() => setTheme('light')}
                                                preview={<div className="w-full h-20 rounded-lg bg-gray-50 border border-gray-200"></div>}
                                             />
                                             <ThemeOption 
                                                label={t.dark} 
                                                isActive={theme === 'dark'} 
                                                onClick={() => setTheme('dark')}
                                                preview={<div className="w-full h-20 rounded-lg bg-gray-900 border border-gray-700"></div>}
                                             />
                                             <ThemeOption 
                                                label={t.gradient} 
                                                isActive={theme === 'gradient'} 
                                                onClick={() => setTheme('gradient')}
                                                preview={<div className="w-full h-20 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200"></div>}
                                             />
                                         </div>
                                     </div>
                                 </div>
                             )}

                             {activeTab === 'general' && (
                                 <div className="space-y-6">
                                     <div>
                                         <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">{t.language}</label>
                                         <div className="space-y-2">
                                             <button 
                                                onClick={() => setLang('en')}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${lang === 'en' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                                             >
                                                 <span className="font-medium">English</span>
                                                 {lang === 'en' && <Check className="w-4 h-4" />}
                                             </button>
                                             <button 
                                                onClick={() => setLang('zh')}
                                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${lang === 'zh' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                                             >
                                                 <span className="font-medium">简体中文</span>
                                                 {lang === 'zh' && <Check className="w-4 h-4" />}
                                             </button>
                                         </div>
                                     </div>
                                 </div>
                             )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}

const ThemeOption = ({ label, isActive, onClick, preview }: any) => (
    <button onClick={onClick} className={`group flex flex-col items-center gap-2 ${isActive ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}>
        <div className={`w-full rounded-xl p-1 border-2 transition-all ${isActive ? 'border-indigo-500' : 'border-transparent group-hover:border-gray-200 dark:group-hover:border-gray-700'}`}>
            {preview}
        </div>
        <span className={`text-xs font-medium ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}`}>{label}</span>
    </button>
);

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, doc, lang }) => {
  const t = TRANSLATIONS[lang];
  const [inviteText, setInviteText] = useState('');
  const [accessLevel, setAccessLevel] = useState<'restricted' | 'anyone'>('restricted');
  const [showAccessMenu, setShowAccessMenu] = useState(false);
  
  // Password & Expiration
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState('');
  const [enableExpiration, setEnableExpiration] = useState(false);
  const [expirationDate, setExpirationDate] = useState('');

  // ESC 键关闭
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Mock Collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>(doc.collaborators || [
    { id: 'me', name: 'You', avatar: '', role: 'owner' },
    { id: '1', name: 'Alice Chen', avatar: '', role: 'editor' },
    { id: '2', name: 'Bob Design', avatar: '', role: 'viewer' }
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />
          
          <motion.div
            className="w-full max-w-[480px] bg-[#fafafa]/95 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden relative z-10 dark:border dark:border-gray-700 flex flex-col max-h-[90vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-800 flex items-center justify-between shrink-0">
              <h3 className="font-bold text-gray-800 dark:text-white text-lg">{t.shareTitle}</h3>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-gray-800 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto custom-scrollbar flex-1">
                {/* Invite Section */}
                <div className="p-6 pb-2">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all dark:text-white"
                                placeholder={t.invitePlaceholder}
                                value={inviteText}
                                onChange={(e) => setInviteText(e.target.value)}
                            />
                        </div>
                        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-colors shadow-sm whitespace-nowrap">
                            {t.inviteCollaborators}
                        </button>
                    </div>
                </div>

                {/* Link Sharing */}
                <div className="px-6 py-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t.linkSharing}</h4>
                    <div className="p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-800">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 shadow-sm relative">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${accessLevel === 'anyone' ? 'bg-green-50 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                    <Globe className="w-5 h-5" />
                                </div>
                                <div className="relative">
                                    <button 
                                        onClick={() => setShowAccessMenu(!showAccessMenu)}
                                        className="flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-0.5 -ml-2 rounded-lg transition-colors group"
                                    >
                                        <span className="text-sm font-bold text-gray-800 dark:text-white">
                                            {accessLevel === 'anyone' ? t.anyone : t.restricted}
                                        </span>
                                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showAccessMenu ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className="text-xs text-gray-500 ml-0.5">{accessLevel === 'anyone' ? t.canView : t.restricted}</div>
                                    
                                    {/* Access Menu Dropdown */}
                                    <AnimatePresence>
                                        {showAccessMenu && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setShowAccessMenu(false)} />
                                                <motion.div 
                                                    initial={{ opacity: 0, y: 5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: 5 }}
                                                    className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden py-1"
                                                >
                                                    <button 
                                                        onClick={() => { setAccessLevel('restricted'); setShowAccessMenu(false); }}
                                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between"
                                                    >
                                                        <span className={accessLevel === 'restricted' ? 'text-indigo-600 font-medium' : 'text-gray-700 dark:text-gray-300'}>{t.restricted}</span>
                                                        {accessLevel === 'restricted' && <Check className="w-4 h-4 text-indigo-600" />}
                                                    </button>
                                                    <button 
                                                        onClick={() => { setAccessLevel('anyone'); setShowAccessMenu(false); }}
                                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center justify-between"
                                                    >
                                                        <span className={accessLevel === 'anyone' ? 'text-indigo-600 font-medium' : 'text-gray-700 dark:text-gray-300'}>{t.anyone}</span>
                                                        {accessLevel === 'anyone' && <Check className="w-4 h-4 text-indigo-600" />}
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                            <button className="text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                                <LinkIcon className="w-3.5 h-3.5" />
                                {t.copyLink}
                            </button>
                        </div>

                        {/* Public Link Settings */}
                        <AnimatePresence>
                            {accessLevel === 'anyone' && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-3 pt-3 pb-2 space-y-3">
                                        {/* Password Toggle */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                    <Lock className="w-4 h-4 text-gray-400" />
                                                    {t.passwordProtection}
                                                </div>
                                                <button onClick={() => setEnablePassword(!enablePassword)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                    {enablePassword ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8" />}
                                                </button>
                                            </div>
                                            {enablePassword && (
                                                <motion.input 
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    type="text" 
                                                    placeholder={t.setPassword}
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                                />
                                            )}
                                        </div>

                                        {/* Expiration Toggle */}
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                    <Calendar className="w-4 h-4 text-gray-400" />
                                                    {t.expiration}
                                                </div>
                                                <button onClick={() => setEnableExpiration(!enableExpiration)} className="text-gray-400 hover:text-indigo-600 transition-colors">
                                                    {enableExpiration ? <ToggleRight className="w-8 h-8 text-indigo-600" /> : <ToggleLeft className="w-8 h-8" />}
                                                </button>
                                            </div>
                                            {enableExpiration && (
                                                <motion.input 
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    type="date" 
                                                    value={expirationDate}
                                                    onChange={(e) => setExpirationDate(e.target.value)}
                                                    className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                                                />
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Collaborators List */}
                <div className="px-6 pb-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{t.sharedWithMe}</h4>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                        {collaborators.map((user) => (
                            <div key={user.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{user.name}</span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{user.role === 'owner' ? 'you@company.com' : 'user@company.com'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className={`text-xs px-2 py-1 rounded font-medium ${user.role === 'owner' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer'}`}>
                                        {user.role === 'owner' ? t.owner : (user.role === 'editor' ? t.canEdit : t.canView)}
                                    </span>
                                    {user.role !== 'owner' && <ChevronDown className="w-3 h-3 ml-1 text-gray-400" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, doc, onUpdate, onDelete, onRestore, onDuplicate, onExport, lang }) => {
    const t = TRANSLATIONS[lang];
    const [title, setTitle] = useState(doc.title);

    // ESC 键关闭
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const handleSave = () => {
        onUpdate({ title });
        onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div 
                        className="absolute inset-0 bg-black/20 backdrop-blur-sm dark:bg-black/50"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    
                    <motion.div
                        className="w-full max-w-[400px] bg-[#fafafa]/95 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-gray-700"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-800 dark:text-white">{t.docSettings}</h3>
                                <button onClick={handleSave} className="text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1 rounded-lg transition-colors">
                                    Done
                                </button>
                            </div>

                            {/* Main Icon & Title */}
                            <div className="flex flex-col items-center mb-8">
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-4xl shadow-inner mb-4 cursor-pointer hover:scale-105 transition-transform group relative overflow-hidden ${doc.isDeleted ? 'bg-gray-100 grayscale' : 'bg-gray-50 dark:bg-gray-800'}`}>
                                    <span className="relative z-10">{doc.type === 'folder' ? '📁' : '📄'}</span>
                                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                        <Smile className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="w-full relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl py-2 pl-9 pr-4 font-semibold text-center focus:bg-white dark:focus:bg-gray-700 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none dark:text-white"
                                        disabled={!!doc.isDeleted}
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2">
                                <button disabled={!!doc.isDeleted} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 group disabled:opacity-50">
                                    <ImageIcon className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                    {t.changeCover}
                                </button>
                                
                                <div className="h-px bg-gray-200/50 dark:bg-gray-700 my-1"></div>
                                
                                {!doc.isDeleted && (
                                    <>
                                        <button 
                                            onClick={onDuplicate}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 group"
                                        >
                                            <Copy className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                            {t.duplicate}
                                        </button>
                                        <button 
                                            onClick={onExport}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-800 transition-colors text-sm font-medium text-gray-700 dark:text-gray-300 group"
                                        >
                                            <FileDown className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
                                            {t.exportMarkdown}
                                        </button>
                                        <div className="h-px bg-gray-200/50 dark:bg-gray-700 my-1"></div>
                                    </>
                                )}

                                {doc.isDeleted ? (
                                    <>
                                        <button 
                                            onClick={() => { onRestore && onRestore(); onClose(); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors text-sm font-medium text-emerald-600 group"
                                        >
                                            <RefreshCcw className="w-4 h-4 text-emerald-400 group-hover:text-emerald-600" />
                                            {t.restore}
                                        </button>
                                        <button 
                                            onClick={onDelete}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium text-red-600 group"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                                            {t.deleteForever}
                                        </button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={onDelete}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium text-red-600 group"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-600" />
                                        {t.moveToTrash}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}

// Tags Management Modal
export const TagsManagementModal: React.FC<ModalProps> = ({ isOpen, onClose, lang }) => {
    const t = TRANSLATIONS[lang];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div 
                        className="absolute inset-0 bg-black/30 backdrop-blur-sm dark:bg-black/60"
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />
                    <motion.div
                        className="w-full max-w-[640px] bg-[#fafafa]/95 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden relative z-10 border border-gray-100 dark:border-white/10 flex flex-col max-h-[70vh] ring-1 ring-black/5"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.1, ease: [0.4, 0, 0.2, 1] }}
                    >
                        {/* Header */}
                        <div className="flex items-center px-4 py-4 border-b border-gray-200/50 dark:border-gray-800/50">
                            <Hash className="w-5 h-5 text-indigo-500 mr-3" />
                            <h3 className="flex-1 text-lg font-bold text-gray-800 dark:text-white">
                                标签管理
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="text-xs font-bold text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700">ESC</div>
                                <button 
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="overflow-y-auto p-4 custom-scrollbar">
                            {/* Add New Tag */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
                                    添加新标签
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="输入标签名称..."
                                        className="flex-1 px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:text-white placeholder-gray-400 transition-all"
                                    />
                                    <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-colors flex items-center gap-2">
                                        <Plus className="w-4 h-4" />
                                        添加
                                    </button>
                                </div>
                            </div>
                            
                            {/* Tags List */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                        已有标签
                                    </label>
                                    <span className="text-xs text-gray-400">
                                        3 个标签
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { label: 'colors', color: 'bg-rose-500', count: 5 },
                                        { label: 'design', color: 'bg-indigo-500', count: 8 },
                                        { label: 'planning', color: 'bg-emerald-500', count: 3 },
                                    ].map(tag => (
                                        <div 
                                            key={tag.label} 
                                            className="group flex items-center gap-3 px-3 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all hover:shadow-sm"
                                        >
                                            <div className={`w-3 h-3 rounded-full ${tag.color}`} />
                                            <span className="flex-1 font-medium text-gray-800 dark:text-gray-200 text-sm">{tag.label}</span>
                                            <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full font-medium">{tag.count}</span>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title="编辑">
                                                    <Type className="w-3.5 h-3.5" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="删除">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
