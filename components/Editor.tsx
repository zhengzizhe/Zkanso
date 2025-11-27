import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Sparkles, Image as ImageIcon, Share2, PlayCircle, PanelRight,
  Bold, Italic, Strikethrough, Code, X, PlusCircle, MessageSquare,
  Heading1, Heading2, Heading3, List, ListOrdered, CheckSquare, Quote, 
  Minus, Type, Terminal, AlignLeft, AlignCenter, AlignRight, Maximize2, Minimize2, Link as LinkIcon, Check, ChevronRight,
  Wand2, Loader2, RefreshCw
} from 'lucide-react';
import { Doc, Language, TRANSLATIONS, Space } from '../types';
import { generateCompletion } from '../services/geminiService';

interface EditorProps {
  doc: Doc;
  space?: Space;
  allDocs?: Doc[]; // Passed for wiki linking
  lang: Language;
  onBack: () => void;
  onUpdate: (id: string, updates: Partial<Doc>) => void;
  onOpenShare: () => void;
  onNavigate?: (item: { id: string, type?: 'space' | 'folder' | 'doc' }) => void;
}

// --- Slash Command Definition ---
interface Command {
  id: string;
  icon: React.ElementType;
  labelKey: string;
  color: string;
  bgColor: string;
  action: (text: string, cursor: number) => { newText: string, newCursor: number };
}

const COMMANDS: Command[] = [
  { id: 'h1', icon: Heading1, labelKey: 'heading1', color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/30', action: (t, c) => insertBlock(t, c, '# ') },
  { id: 'h2', icon: Heading2, labelKey: 'heading2', color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/30', action: (t, c) => insertBlock(t, c, '## ') },
  { id: 'h3', icon: Heading3, labelKey: 'heading3', color: 'text-amber-500', bgColor: 'bg-amber-50 dark:bg-amber-900/30', action: (t, c) => insertBlock(t, c, '### ') },
  { id: 'bullet', icon: List, labelKey: 'bulletList', color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/30', action: (t, c) => insertBlock(t, c, '- ') },
  { id: 'number', icon: ListOrdered, labelKey: 'numberedList', color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/30', action: (t, c) => insertBlock(t, c, '1. ') },
  { id: 'task', icon: CheckSquare, labelKey: 'taskList', color: 'text-emerald-500', bgColor: 'bg-emerald-50 dark:bg-emerald-900/30', action: (t, c) => insertBlock(t, c, '- [ ] ') },
  { id: 'quote', icon: Quote, labelKey: 'quote', color: 'text-cyan-500', bgColor: 'bg-cyan-50 dark:bg-cyan-900/30', action: (t, c) => insertBlock(t, c, '> ') },
  { id: 'code', icon: Terminal, labelKey: 'codeBlock', color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/30', action: (t, c) => insertBlock(t, c, '```\n', '\n```') },
  { id: 'divider', icon: Minus, labelKey: 'divider', color: 'text-gray-500', bgColor: 'bg-gray-100 dark:bg-gray-800', action: (t, c) => insertBlock(t, c, '---', '', true) },
  { id: 'ai', icon: Sparkles, labelKey: 'aiAssistant', color: 'text-pink-500', bgColor: 'bg-pink-50 dark:bg-pink-900/30', action: (t, c) => ({ newText: t, newCursor: c }) }, 
];

// Helper to insert markdown block at start of line
const insertBlock = (text: string, cursor: number, prefix: string, suffix: string = '', newLine: boolean = false) => {
  const beforeCursor = text.slice(0, cursor);
  const afterCursor = text.slice(cursor);
  
  // Find start of current line
  const lastNewLine = beforeCursor.lastIndexOf('\n');
  const insertAt = lastNewLine === -1 ? 0 : lastNewLine + 1;
  
  // Remove the '/' that triggered the menu if it exists
  const lineContent = beforeCursor.slice(insertAt);
  const slashIndex = lineContent.lastIndexOf('/');
  
  let newTextBefore = text.slice(0, insertAt + slashIndex);
  let newTextAfter = text.slice(cursor);

  // For replace, we construct the new line
  const insertion = `${prefix}${suffix}`;
  
  return {
    newText: newTextBefore + insertion + (newLine ? '\n' : '') + newTextAfter,
    newCursor: newTextBefore.length + prefix.length
  };
};

const Editor: React.FC<EditorProps> = ({ doc, space, allDocs = [], lang, onBack, onUpdate, onOpenShare, onNavigate }) => {
  const t = TRANSLATIONS[lang];
  const [title, setTitle] = useState(doc.title);
  const [content, setContent] = useState(doc.content);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showRightSidebar, setShowRightSidebar] = useState(true);
  const [isFullWidth, setIsFullWidth] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Slash Menu State
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [slashFilter, setSlashFilter] = useState('');
  const [selectedCmdIndex, setSelectedCmdIndex] = useState(0);

  // Wiki Menu State
  const [showWikiMenu, setShowWikiMenu] = useState(false);
  const [wikiFilter, setWikiFilter] = useState('');
  const [selectedWikiIndex, setSelectedWikiIndex] = useState(0);

  // AI Palette State
  const [showAIPalette, setShowAIPalette] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    setTitle(doc.title);
    setContent(doc.content);
  }, [doc.id]);

  // 优化高度计算：使用requestAnimationFrame避免阻塞主线程
  useEffect(() => {
    const updateHeight = () => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
      }
    };
    requestAnimationFrame(updateHeight);
  }, [content]);

  // Statistics - 降低计算频率
  const stats = useMemo(() => {
    // 仅在内容长度变化超过50字符时重新计算
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    const chars = content.length;
    return { words, chars };
  }, [content.length > 0 ? Math.floor(content.length / 50) : 0]);

  // Breadcrumbs Calculation
  const breadcrumbs = useMemo(() => {
    const path = [];
    let current = doc;
    // Add current doc
    path.unshift({ id: current.id, title: current.title || t.untitled, active: true, type: 'doc' as const });
    
    // Find parents
    let parentId = current.parentId;
    while (parentId) {
        const parent = allDocs.find(d => d.id === parentId);
        if (parent) {
            path.unshift({ id: parent.id, title: parent.title || t.untitled, active: false, type: parent.type as 'folder' | 'doc' });
            parentId = parent.parentId;
        } else {
            break;
        }
    }
    
    // Add Space
    if (space) {
        path.unshift({ id: space.id, title: space.name, active: false, type: 'space' as const });
    }
    
    return path;
  }, [doc, allDocs, space]);

  // 防抖保存：300ms内无新输入才真正保存
  const handleSave = useCallback((newContent = content, newTitle = title) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onUpdate(doc.id, { title: newTitle, content: newContent, lastModified: Date.now() });
    }, 300);
  }, [doc.id, onUpdate]);

  // --- Caret Position Logic ---
  const getCaretCoordinates = () => {
    const element = textareaRef.current;
    if (!element) return { top: 0, left: 0 };

    const { selectionStart } = element;
    const div = document.createElement('div');
    const style = getComputedStyle(element);
    
    // Copy styles to mirror div
    Array.from(style).forEach((prop) => {
      div.style.setProperty(prop, style.getPropertyValue(prop));
    });

    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.left = '-9999px';
    div.style.overflow = 'hidden';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';

    div.textContent = content.substring(0, selectionStart);
    
    const span = document.createElement('span');
    span.textContent = content.substring(selectionStart) || '.';
    div.appendChild(span);

    document.body.appendChild(div);
    
    const { offsetTop: spanTop, offsetLeft: spanLeft } = span;
    
    document.body.removeChild(div);

    // Adjust relative to the textarea's current position on screen
    const rect = element.getBoundingClientRect();
    
    return {
      top: rect.top + spanTop - element.scrollTop + 24, // +24 for line height offset
      left: rect.left + spanLeft
    };
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Slash Menu Navigation
    if (showSlashMenu) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCmdIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCmdIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeCommand(filteredCommands[selectedCmdIndex]);
      } else if (e.key === 'Escape') {
        setShowSlashMenu(false);
      }
      return;
    }

    // Wiki Menu Navigation
    if (showWikiMenu) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedWikiIndex(prev => (prev + 1) % filteredWikiDocs.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedWikiIndex(prev => (prev - 1 + filteredWikiDocs.length) % filteredWikiDocs.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            insertWikiLink(filteredWikiDocs[selectedWikiIndex]);
        } else if (e.key === 'Escape') {
            setShowWikiMenu(false);
        }
        return;
    }

    // AI Palette Navigation
    if (showAIPalette) {
      if (e.key === 'Escape') {
        setShowAIPalette(false);
      } else if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleGenerateAI();
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const cursor = e.target.selectionStart;
    setContent(val);
    handleSave(val);

    // --- Slash Menu Trigger ---
    const charBefore = val.slice(cursor - 1, cursor);
    const lineStart = val.lastIndexOf('\n', cursor - 2) + 1;
    const textAfterLineStart = val.slice(lineStart, cursor);
    
    // Check for Slash
    if (charBefore === '/' && (textAfterLineStart.trim() === '/' || textAfterLineStart.endsWith(' /'))) {
       const coords = getCaretCoordinates();
       setSlashMenuPos(coords);
       setShowSlashMenu(true);
       setSlashFilter('');
       setSelectedCmdIndex(0);
       setShowWikiMenu(false); // Exclusive
       setShowAIPalette(false);
    } else if (showSlashMenu) {
       const slashIndex = textAfterLineStart.lastIndexOf('/');
       if (slashIndex === -1) {
         setShowSlashMenu(false);
       } else {
         setSlashFilter(textAfterLineStart.slice(slashIndex + 1));
       }
    }

    // --- Wiki Link Trigger [[ ---
    const twoCharsBefore = val.slice(cursor - 2, cursor);
    if (twoCharsBefore === '[[') {
        const coords = getCaretCoordinates();
        setSlashMenuPos(coords);
        setShowWikiMenu(true);
        setWikiFilter('');
        setSelectedWikiIndex(0);
        setShowSlashMenu(false);
        setShowAIPalette(false);
    } else if (showWikiMenu) {
        const wikiStart = textAfterLineStart.lastIndexOf('[[');
        if (wikiStart === -1) {
            setShowWikiMenu(false);
        } else {
            setWikiFilter(textAfterLineStart.slice(wikiStart + 2));
        }
    }
  };

  // Filter commands and Wiki results
  const filteredCommands = COMMANDS.filter(cmd => 
     // @ts-ignore
    t[cmd.labelKey].toLowerCase().includes(slashFilter.toLowerCase())
  );

  const filteredWikiDocs = allDocs.filter(d => 
    d.title.toLowerCase().includes(wikiFilter.toLowerCase())
  ).slice(0, 5); // Limit 5

  const executeCommand = (cmd: Command) => {
     if (!textareaRef.current) return;
     
     // Handle AI Command specially
     if (cmd.id === 'ai') {
        const coords = getCaretCoordinates();
        // Remove the slash command text before opening AI
        const cursor = textareaRef.current.selectionStart;
        const { newText, newCursor } = insertBlock(content, cursor, ''); // removes slash
        setContent(newText);
        setSlashMenuPos(coords);
        setShowSlashMenu(false);
        setShowAIPalette(true);
        setAiPrompt('');
        setTimeout(() => {
          if (textareaRef.current) textareaRef.current.setSelectionRange(newCursor, newCursor);
        }, 0);
        return;
     }

     const cursor = textareaRef.current.selectionStart;
     const { newText, newCursor } = cmd.action(content, cursor);
     
     setContent(newText);
     handleSave(newText);
     setShowSlashMenu(false);
     
     setTimeout(() => {
        if(textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
     }, 0);
  };

  const insertWikiLink = (targetDoc?: Doc) => {
    if (!textareaRef.current) return;
    const cursor = textareaRef.current.selectionStart;
    const lineStart = content.lastIndexOf('\n', cursor - 1) + 1;
    const lineContent = content.slice(lineStart, cursor);
    const triggerIndex = lineContent.lastIndexOf('[[');
    
    const absoluteTriggerIndex = lineStart + triggerIndex;
    
    // Replace [[filter with [Title](#id)
    const linkTitle = targetDoc ? targetDoc.title : wikiFilter;
    const linkText = `[${linkTitle}](#${targetDoc?.id || ''})`;
    
    const before = content.slice(0, absoluteTriggerIndex);
    const after = content.slice(cursor);
    const newText = before + linkText + after;
    
    setContent(newText);
    handleSave(newText);
    setShowWikiMenu(false);
    
    setTimeout(() => {
        if(textareaRef.current) {
            textareaRef.current.focus();
            const newCursor = absoluteTriggerIndex + linkText.length;
            textareaRef.current.setSelectionRange(newCursor, newCursor);
        }
     }, 0);
  }

  // --- Right Sidebar Formatting Actions ---
  const applyFormat = (prefix: string, suffix: string = prefix, newLine: boolean = false) => {
    if (!textareaRef.current) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    
    const selectedText = content.substring(start, end);
    const before = content.substring(0, start);
    const after = content.substring(end);
    
    const newText = `${before}${prefix}${selectedText}${suffix}${newLine ? '\n' : ''}${after}`;
    setContent(newText);
    handleSave(newText);
    
    setTimeout(() => {
        if(textareaRef.current) {
            textareaRef.current.focus();
            const newCursorPos = start + prefix.length + selectedText.length + suffix.length + (newLine ? 1 : 0);
            textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
        }
    }, 0);
  };

  // --- AI Generation Logic ---
  const handleGenerateAI = async (presetPrompt?: string) => {
      const promptToUse = presetPrompt || aiPrompt;
      if (!promptToUse) return;

      setIsAiLoading(true);

      // Get context (up to 1000 chars before cursor)
      const cursor = textareaRef.current?.selectionStart || 0;
      const context = content.substring(Math.max(0, cursor - 1000), cursor);

      try {
          const generatedText = await generateCompletion(promptToUse, context);
          
          if (generatedText) {
             const before = content.substring(0, cursor);
             const after = content.substring(cursor);
             const newText = before + generatedText + after;
             
             setContent(newText);
             handleSave(newText);
             setShowAIPalette(false);
             
             // Move cursor to end of inserted text
             setTimeout(() => {
                 if (textareaRef.current) {
                     textareaRef.current.focus();
                     const newPos = cursor + generatedText.length;
                     textareaRef.current.setSelectionRange(newPos, newPos);
                 }
             }, 0);
          }
      } catch (e) {
          console.error(e);
      } finally {
          setIsAiLoading(false);
      }
  };

  // --- Animation Variants (Craft Style - 干脆流畅) ---
  const containerVariants = {
    hidden: { opacity: 0, y: 4 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.12,
        ease: [0.4, 0, 0.2, 1],
        staggerChildren: 0.02,
        delayChildren: 0.05
      }
    },
    exit: { 
        opacity: 0, 
        y: -4,
        transition: { duration: 0.1, ease: [0.4, 0, 1, 1] } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 3 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.1,
        ease: [0.4, 0, 0.2, 1]
      } 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full bg-gray-50/20 dark:bg-black/30 relative overflow-hidden font-sans"
    >
      {/* Top Nav */}
      <div className="h-14 flex items-center justify-between px-6 border-b border-gray-100/50 dark:border-white/5 bg-gray-50/40 dark:bg-black/40 backdrop-blur-xl z-30 shrink-0">
         <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
            <button onClick={() => { handleSave(); onBack(); }} className="hover:bg-white/60 dark:hover:bg-white/10 p-2 rounded-xl transition-all hover:scale-105 active:scale-95 text-gray-700 dark:text-gray-200">
                <ArrowLeft className="w-4 h-4" />
            </button>
            
            {/* Interactive Breadcrumbs */}
            <div className="flex items-center gap-1.5 opacity-80">
                {breadcrumbs.map((crumb, idx) => (
                    <div key={crumb.id || idx} className="flex items-center gap-1.5">
                        {idx > 0 && <span className="text-gray-300 dark:text-gray-600">/</span>}
                        <button 
                            onClick={() => onNavigate && onNavigate({ id: crumb.id, type: crumb.type })}
                            className={`truncate max-w-[150px] px-2 py-1 rounded-lg hover:bg-white/40 cursor-pointer transition-colors text-left ${crumb.active ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-600 dark:text-gray-400'}`}
                            disabled={crumb.active}
                        >
                            {crumb.title}
                        </button>
                    </div>
                ))}
            </div>
         </div>

         <div className="flex items-center gap-3">
             <div className="hidden md:flex items-center bg-gray-100/50 dark:bg-white/5 rounded-lg p-0.5 border border-white/20">
                 <button onClick={() => setIsFullWidth(false)} className={`p-1.5 rounded-md transition-colors ${!isFullWidth ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-gray-50' : 'text-gray-400'}`} title={t.standardWidth}>
                     <Minimize2 className="w-3.5 h-3.5" />
                 </button>
                 <button onClick={() => setIsFullWidth(true)} className={`p-1.5 rounded-md transition-colors ${isFullWidth ? 'bg-white dark:bg-gray-700 shadow-sm text-indigo-600 dark:text-gray-50' : 'text-gray-400'}`} title={t.fullWidth}>
                     <Maximize2 className="w-3.5 h-3.5" />
                 </button>
             </div>
             <div className="h-5 w-px bg-gray-300/30 dark:bg-gray-700/50 mx-1"></div>
             
             <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenShare}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-white/80 dark:bg-white/10 hover:bg-white dark:hover:bg-white/20 text-indigo-600 dark:text-white hover:shadow-sm transition-all border border-white/50"
             >
                <Share2 className="w-3.5 h-3.5" />
                <span>{t.shared}</span>
             </motion.button>
             <button onClick={() => setShowRightSidebar(!showRightSidebar)} className={`p-2 rounded-xl transition-colors ${showRightSidebar ? 'text-indigo-600 dark:text-gray-300 bg-indigo-50 dark:bg-gray-800/20' : 'text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                 <PanelRight className="w-5 h-5" />
             </button>
         </div>
      </div>

      {/* Workspace */}
      <div className="flex flex-1 overflow-y-auto relative custom-scrollbar">
          <div className="flex-1 flex justify-center bg-transparent relative min-h-full">
              <motion.div 
                 variants={containerVariants}
                 initial="hidden"
                 animate="visible"
                 exit="exit"
                 style={{ maxWidth: isFullWidth ? '95%' : '850px' }}
                 className={`w-full my-8 bg-[#fafafa]/90 dark:bg-gray-900/80 min-h-[calc(100vh-100px)] shadow-2xl shadow-gray-200/50 dark:shadow-black/20 backdrop-blur-xl rounded-[24px] relative px-16 py-16 border border-white/60 dark:border-white/5 transition-all duration-500`}
              >
                  {/* Cover */}
                  <motion.div 
                    variants={childVariants}
                    className="group relative w-full h-48 -mt-16 -mx-16 mb-10 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900/30 dark:to-gray-900/10 hover:opacity-100 transition-all duration-300 flex items-center justify-center border-b border-gray-200/50 dark:border-gray-800/50 cursor-pointer overflow-hidden"
                  >
                       <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                       <div className="flex items-center gap-2 text-gray-500 text-sm font-medium bg-white/90 dark:bg-gray-800/90 px-4 py-2 rounded-full shadow-lg backdrop-blur-md hover:scale-105 transition-transform z-10">
                           <ImageIcon className="w-4 h-4" />
                           {t.addCover}
                       </div>
                  </motion.div>

                  {/* Title */}
                  <motion.div variants={childVariants} className="mb-8">
                      <div className="text-5xl mb-6 w-20 h-20 flex items-center justify-center rounded-2xl bg-white dark:bg-gray-800 shadow-xl shadow-gray-100 dark:shadow-none border border-gray-100 dark:border-gray-700">{doc.type === 'folder' ? '📁' : '📄'}</div>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); handleSave(content, e.target.value); }}
                        placeholder={t.untitled}
                        className="w-full text-5xl font-extrabold text-gray-900 dark:text-gray-50 placeholder-gray-200 dark:placeholder-gray-700 border-none outline-none bg-transparent leading-tight tracking-tight"
                      />
                  </motion.div>

                  {/* Editor Textarea */}
                  <motion.textarea
                    variants={childVariants}
                    ref={textareaRef}
                    value={content}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Type '/' for commands..."
                    className="w-full h-full text-lg text-gray-700 dark:text-gray-300 leading-8 resize-none outline-none border-none bg-transparent placeholder-gray-300 dark:placeholder-gray-700 font-normal selection:bg-indigo-100 selection:text-indigo-900"
                    spellCheck={false}
                  />

                  {/* FAB */}
                  <motion.div variants={childVariants} className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-full shadow-2xl shadow-indigo-500/10 border border-white/50 dark:border-white/10 p-2 flex items-center gap-2 z-40 scale-90 hover:scale-100 transition-all duration-300">
                      <button onClick={() => {
                          const coords = getCaretCoordinates();
                          setSlashMenuPos({ top: window.innerHeight / 2 - 100, left: window.innerWidth / 2 - 200 }); // Center if clicked
                          setShowAIPalette(true);
                      }} className="p-3 hover:bg-pink-50 dark:hover:bg-white/5 rounded-full text-pink-500 hover:scale-110 transition-transform"><Sparkles className="w-5 h-5" /></button>
                      <div className="w-px h-6 bg-gray-300/50 dark:bg-gray-600/50"></div>
                      <button className="p-3 hover:bg-indigo-50 dark:hover:bg-white/5 rounded-full text-indigo-500 hover:scale-110 transition-transform"><PlusCircle className="w-5 h-5" /></button>
                      <button className="p-3 hover:bg-blue-50 dark:hover:bg-white/5 rounded-full text-blue-500 hover:scale-110 transition-transform"><MessageSquare className="w-5 h-5" /></button>
                  </motion.div>
              </motion.div>
          </div>

          {/* Slash Menu Popup */}
          <AnimatePresence>
            {showSlashMenu && (
               <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="fixed z-50 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col ring-1 ring-black/5"
                  style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
               >
                  <div className="px-4 py-2.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
                    <span>{t.insert}</span>
                    <span className="bg-gray-200 dark:bg-gray-700 px-1.5 rounded text-[9px] text-gray-500">ESC</span>
                  </div>
                  <div className="max-h-[320px] overflow-y-auto p-2 custom-scrollbar space-y-0.5">
                     {filteredCommands.length > 0 ? filteredCommands.map((cmd, idx) => (
                        <button
                           key={cmd.id}
                           onClick={() => executeCommand(cmd)}
                           className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group ${idx === selectedCmdIndex ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-900 dark:text-indigo-100 scale-[1.02] shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                        >
                           <div className={`p-2 rounded-lg ${cmd.bgColor} ${cmd.color} shadow-sm group-hover:scale-110 transition-transform`}>
                              <cmd.icon className="w-4 h-4" />
                           </div>
                           <span className="font-semibold tracking-tight">{t[cmd.labelKey]}</span>
                           {idx === selectedCmdIndex && <motion.div layoutId="cmdActive" className="ml-auto text-indigo-500"><Check className="w-4 h-4" /></motion.div>}
                        </button>
                     )) : (
                        <div className="px-3 py-2 text-xs text-gray-400 text-center">No commands found</div>
                     )}
                  </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Wiki Link Menu Popup */}
          <AnimatePresence>
            {showWikiMenu && (
               <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="fixed z-50 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col ring-1 ring-black/5"
                  style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
               >
                  <div className="px-4 py-2.5 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                    {t.linkToDoc}
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar space-y-0.5">
                     {filteredWikiDocs.length > 0 ? filteredWikiDocs.map((doc, idx) => (
                        <button
                           key={doc.id}
                           onClick={() => insertWikiLink(doc)}
                           className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-sm ${idx === selectedWikiIndex ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                        >
                           <div className={`p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-sm`}>
                              <LinkIcon className="w-4 h-4" />
                           </div>
                           <span className="font-semibold truncate">{doc.title || t.untitled}</span>
                        </button>
                     )) : (
                         <button onClick={() => insertWikiLink()} className="w-full text-left px-3 py-2 text-xs text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                             Create "{wikiFilter}"...
                         </button>
                     )}
                  </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* AI Assistant Palette */}
          <AnimatePresence>
            {showAIPalette && (
               <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="fixed z-50 w-[400px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/60 dark:border-gray-700 ring-2 ring-indigo-500/20 overflow-hidden flex flex-col"
                  style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
               >
                   <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-0.5">
                       <div className="bg-white dark:bg-gray-900 p-3">
                           <div className="flex items-center gap-2 mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 font-bold text-sm">
                               <Sparkles className="w-4 h-4 text-indigo-500" />
                               {t.aiAssistant}
                           </div>
                           <div className="flex gap-2">
                               <input 
                                  autoFocus
                                  value={aiPrompt}
                                  onChange={(e) => setAiPrompt(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  placeholder={isAiLoading ? t.aiThinking : "Tell AI what to do..."}
                                  disabled={isAiLoading}
                                  className="flex-1 bg-gray-50 dark:bg-gray-800 border-none outline-none rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400"
                               />
                               <button 
                                  disabled={isAiLoading || !aiPrompt}
                                  onClick={() => handleGenerateAI()}
                                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                               >
                                   {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowLeft className="w-4 h-4 rotate-90" />}
                               </button>
                           </div>
                       </div>
                   </div>

                   {!isAiLoading && (
                       <div className="p-2 bg-gray-50/50 dark:bg-black/20 space-y-1">
                           <div className="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick Actions</div>
                           <button onClick={() => handleGenerateAI(t.aiContinue)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-2 transition-colors">
                               <Wand2 className="w-3.5 h-3.5 text-indigo-500" /> {t.aiContinue}
                           </button>
                           <button onClick={() => handleGenerateAI(t.aiSummarize)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-2 transition-colors">
                               <AlignLeft className="w-3.5 h-3.5 text-orange-500" /> {t.aiSummarize}
                           </button>
                           <button onClick={() => handleGenerateAI(t.aiPolish)} className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-white/10 flex items-center gap-2 transition-colors">
                               <RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> {t.aiPolish}
                           </button>
                       </div>
                   )}
               </motion.div>
            )}
          </AnimatePresence>

          {/* Right Sidebar */}
          <AnimatePresence>
            {showRightSidebar && (
              <motion.div 
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="absolute right-6 top-6 bottom-6 w-72 z-40"
              >
                  <div className="w-full h-full glass-panel dark:bg-gray-900/80 rounded-[28px] shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/60 dark:ring-white/10 backdrop-blur-2xl">
                    <div className="p-5 border-b border-gray-100/50 dark:border-gray-800/30 flex items-center justify-between bg-gray-50/40 dark:bg-black/20">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">{t.format}</span>
                        <button onClick={() => setShowRightSidebar(false)} className="p-1 hover:bg-gray-200/50 dark:hover:bg-white/10 rounded-md text-gray-400"><X className="w-4 h-4"/></button>
                    </div>
                    <div className="p-5 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                        {/* Typography */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t.typography}</label>
                            <div className="flex p-1 bg-white/50 dark:bg-white/5 rounded-xl mb-3 border border-white/60 dark:border-white/5 shadow-sm">
                                <button onClick={() => applyFormat('**')} className="flex-1 py-2 flex justify-center text-gray-700 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><Bold className="w-4 h-4"/></button>
                                <button onClick={() => applyFormat('*')} className="flex-1 py-2 flex justify-center text-gray-700 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><Italic className="w-4 h-4"/></button>
                                <button onClick={() => applyFormat('~~')} className="flex-1 py-2 flex justify-center text-gray-700 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><Strikethrough className="w-4 h-4"/></button>
                                <button onClick={() => applyFormat('`')} className="flex-1 py-2 flex justify-center text-gray-700 dark:text-gray-100 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors"><Code className="w-4 h-4"/></button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <button onClick={() => applyFormat('### ')} className="py-2.5 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 border border-white/40 dark:border-white/5 transition-colors">Small</button>
                                <button onClick={() => applyFormat('## ')} className="py-2.5 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 border border-white/40 dark:border-white/5 transition-colors">Medium</button>
                                <button onClick={() => applyFormat('# ')} className="py-2.5 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-xs font-bold text-gray-900 dark:text-white border border-white/40 dark:border-white/5 transition-colors">Large</button>
                            </div>
                        </div>

                        {/* Lists */}
                        <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t.lists}</label>
                            <div className="space-y-2">
                                <button onClick={() => applyFormat('- ')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors group">
                                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 group-hover:scale-110 transition-transform"><List className="w-4 h-4" /></div>
                                    {t.bulletList}
                                </button>
                                <button onClick={() => applyFormat('1. ')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors group">
                                    <div className="p-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 group-hover:scale-110 transition-transform"><ListOrdered className="w-4 h-4" /></div>
                                    {t.numberedList}
                                </button>
                                <button onClick={() => applyFormat('- [ ] ')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-white/5 text-gray-700 dark:text-gray-200 text-sm font-medium transition-colors group">
                                    <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 group-hover:scale-110 transition-transform"><CheckSquare className="w-4 h-4" /></div>
                                    {t.taskList}
                                </button>
                            </div>
                        </div>

                         {/* Insert */}
                         <div>
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block">{t.insert}</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => applyFormat('> ')} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 border border-white/40 transition-colors">
                                    <Quote className="w-3 h-3 text-gray-400" /> Quote
                                </button>
                                <button onClick={() => applyFormat('---', '', true)} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/40 dark:bg-white/5 hover:bg-white/60 dark:hover:bg-white/10 text-xs font-bold text-gray-700 dark:text-gray-200 border border-white/40 transition-colors">
                                    <Minus className="w-3 h-3 text-gray-400" /> Divider
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="p-4 border-t border-gray-100/50 dark:border-gray-800/30 bg-gray-50/40 dark:bg-black/20 text-xs text-gray-500 dark:text-gray-400 font-bold font-mono flex justify-between tracking-tight">
                         <span>{stats.words} {t.words.toUpperCase()}</span>
                         <span>{stats.chars} {t.chars.toUpperCase()}</span>
                    </div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Editor;