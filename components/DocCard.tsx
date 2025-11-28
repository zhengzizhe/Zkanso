
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { FileText, Folder, Heart, Star, MoreHorizontal, Calendar, Clock, Hash, RefreshCcw, Trash2, Image as ImageIcon } from 'lucide-react';
import { Doc, Language, TRANSLATIONS } from '../types';

// 相对时间格式化（与App.tsx共享逻辑）
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
    return new Date(timestamp).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  } else {
    if (seconds < 60) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

interface DocCardProps {
  doc: Doc;
  lang: Language;
  layout: 'grid' | 'list';
  onClick: (doc: Doc) => void;
  onToggleFavorite: (doc: Doc, e: React.MouseEvent) => void;
  onToggleLike: (doc: Doc, e: React.MouseEvent) => void;
  onOpenSettings: (doc: Doc, e: React.MouseEvent) => void;
  onRestore?: (doc: Doc, e: React.MouseEvent) => void;
  onDeleteForever?: (doc: Doc, e: React.MouseEvent) => void;
}

const DocCard: React.FC<DocCardProps> = React.memo(({ 
  doc, lang, layout, onClick, onToggleFavorite, onToggleLike, onOpenSettings, onRestore, onDeleteForever
}) => {
  const t = TRANSLATIONS[lang];
  const isFolder = doc.type === 'folder';
  const isDeleted = doc.isDeleted;

  // Calculate Tasks Progress - CRDT 格式不支持
  const progress = useMemo(() => {
    return null;
  }, []);

  // Mock Word Count / Read Time
  const readTime = useMemo(() => {
     // CRDT 格式不再计算字数
     return '1 min';
  }, []);

  const itemVariants = {
    hidden: { opacity: 0, y: 2, scale: 0.99 },
    visible: { 
        opacity: 1, 
        y: 0,
        scale: 1,
        transition: { 
          type: "spring",
          stiffness: 450,
          damping: 28,
          mass: 0.7
        } 
    },
    exit: { 
      opacity: 0,
      y: -2,
      scale: 0.99,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 32
      } 
    }
  };

  // --- LIST LAYOUT ---
  if (layout === 'list') {
    return (
        <motion.div 
            onClick={() => !isDeleted && onClick(doc)}
            className={`group relative flex items-center w-full p-3 bg-transparent hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-sm border border-transparent hover:border-white/30 dark:hover:border-white/10 rounded-xl will-change-transform ${isDeleted ? 'opacity-70 grayscale-[0.5] hover:opacity-100 hover:grayscale-0 cursor-default' : 'cursor-pointer'}`}
            whileHover={!isDeleted ? { 
              scale: 1.01, 
              x: 2,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            } : {}}
            whileTap={!isDeleted ? { 
              scale: 0.99,
              transition: { type: "spring", stiffness: 600, damping: 30 }
            } : {}}
            style={{ transform: 'translate3d(0,0,0)' }}
        >
            {/* Icon with Color */}
            <div className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center mr-4 transition-transform duration-300 group-hover:scale-110 border border-gray-200/30 dark:border-gray-700/30 ${
                isDeleted ? 'bg-gray-100/50 dark:bg-gray-700/30 text-gray-400' :
                isFolder ? 'bg-gradient-to-br from-amber-100/60 to-amber-200/60 text-amber-700 dark:from-amber-900/30 dark:to-amber-900/20 dark:text-amber-500' : 'bg-gradient-to-br from-indigo-50/60 to-blue-100/60 text-indigo-600 dark:from-indigo-900/30 dark:to-blue-900/20 dark:text-indigo-400'
            }`}>
                {isFolder ? <Folder className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>

            {/* Title & Progress */}
            <div className="flex-1 min-w-0 mr-4">
                <h3 className={`text-sm font-semibold truncate transition-colors ${isDeleted ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`}>{doc.title || t.untitled}</h3>
                <div className="flex items-center gap-2 mt-1">
                    {!isDeleted && progress && (
                         <div className="flex items-center gap-2 w-32">
                             <div className="flex-1 h-1.5 bg-gray-200/50 dark:bg-gray-700 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                                 <motion.div 
                                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress.percent}%` }}
                                    transition={{ 
                                      type: "spring",
                                      stiffness: 200,
                                      damping: 20
                                    }}
                                 />
                             </div>
                             <span className="text-[10px] text-indigo-600/70 dark:text-indigo-400 font-bold font-mono">{progress.percent}%</span>
                         </div>
                    )}
                    <p className="text-[10px] text-gray-400 truncate max-w-[200px]">
                        {isDeleted && doc.deletedAt 
                            ? `Deleted ${new Date(doc.deletedAt).toLocaleDateString()}` 
                            : (isFolder ? `${t.items}` : 'No content')}
                    </p>
                </div>
            </div>

            {/* Metadata Columns */}
            <div className="hidden md:flex items-center gap-6 text-xs text-gray-500 dark:text-gray-400 mr-4">
                {/* Tags */}
                {doc.tags && doc.tags.slice(0, 2).map(tag => (
                     <span key={tag} className="flex items-center px-1.5 py-0.5 rounded-md bg-white/30 dark:bg-gray-700/30 border border-gray-200/30 dark:border-gray-600/30 text-[10px] font-medium">
                         <Hash className="w-2 h-2 mr-1 opacity-50" />
                         {tag}
                     </span>
                ))}
                
                <span className="flex items-center gap-1 w-20">
                    <Clock className="w-3 h-3 opacity-50" />
                    {formatRelativeTime(doc.lastModified, lang)}
                </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {isDeleted ? (
                    <>
                        <button onClick={(e) => onRestore && onRestore(doc, e)} className="p-1.5 rounded-lg hover:bg-emerald-100 text-emerald-500 transition-colors" title={t.restore}>
                            <RefreshCcw className="w-4 h-4" />
                        </button>
                         <button onClick={(e) => onDeleteForever && onDeleteForever(doc, e)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500 transition-colors" title={t.deleteForever}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={(e) => onToggleFavorite(doc, e)} className={`p-1.5 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors ${doc.isFavorite ? 'text-amber-500' : 'text-gray-300 dark:text-gray-600 hover:text-amber-500'}`}>
                            <Star className={`w-4 h-4 ${doc.isFavorite ? 'fill-amber-500' : ''}`} />
                        </button>
                        <button onClick={(e) => onOpenSettings(doc, e)} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-gray-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </motion.div>
    );
  }

  // --- GRID LAYOUT ---
  return (
    <motion.div
        onClick={() => !isDeleted && onClick(doc)}
        className={`group relative bg-transparent rounded-[20px] overflow-visible flex flex-col h-[220px] will-change-transform ${isDeleted ? 'opacity-75 grayscale-[0.8] hover:opacity-100 hover:grayscale-0' : 'cursor-pointer'}`}
        whileHover={!isDeleted ? {
          y: -3,
          scale: 1.02,
          transition: { type: "spring", stiffness: 350, damping: 20 }
        } : {}}
        whileTap={!isDeleted ? {
          scale: 0.98,
          transition: { type: "spring", stiffness: 600, damping: 30 }
        } : {}}
        style={{ transform: 'translate3d(0,0,0)' }}
    >
        {/* Cover Image Area - 带微妙边框 */}
        <div className="h-20 w-full bg-gradient-to-br from-gray-100/40 to-gray-200/40 dark:from-gray-800/40 dark:to-gray-900/40 relative overflow-hidden flex-shrink-0 rounded-t-[20px] border border-gray-200/30 dark:border-gray-700/30">
             {doc.coverImage ? (
                 <img src={doc.coverImage} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
             ) : (
                 <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)]"></div>
             )}
             
             {/* Icon Badge */}
             <div className="absolute top-2 left-3 w-8 h-8 rounded-lg bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm flex items-center justify-center border border-gray-200/40 dark:border-gray-700/40 z-10 group-hover:scale-110 transition-transform duration-300">
                 {isFolder ? <Folder className="w-4 h-4 text-amber-400 fill-amber-400/20" /> : (doc.isDeleted ? <Trash2 className="w-4 h-4 text-gray-400" /> : <FileText className="w-4 h-4 text-indigo-500" />)}
             </div>

             {/* Top Right Actions */}
             <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-[-5px] group-hover:translate-y-0">
                  {isDeleted ? (
                       <button onClick={(e) => { e.stopPropagation(); onRestore && onRestore(doc, e) }} className="p-1.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg text-emerald-500 hover:bg-emerald-50 border border-gray-200/30 dark:border-gray-700/30">
                           <RefreshCcw className="w-3.5 h-3.5" />
                       </button>
                  ) : (
                    <>
                        <button onClick={(e) => onToggleFavorite(doc, e)} className={`p-1.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg border border-gray-200/30 dark:border-gray-700/30 transition-colors ${doc.isFavorite ? 'text-amber-400' : 'text-gray-400 hover:text-amber-400'}`}>
                            <Star className={`w-3.5 h-3.5 ${doc.isFavorite ? 'fill-amber-400' : ''}`} />
                        </button>
                        <button onClick={(e) => onOpenSettings(doc, e)} className="p-1.5 bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-lg text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 border border-gray-200/30 dark:border-gray-700/30">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                    </>
                  )}
             </div>
        </div>

        {/* Content Area - 卡片视图保留灰色背景 */}
        <div className="p-3 flex flex-col flex-1 min-h-0 gap-2 bg-white/80 dark:bg-gray-800/50 backdrop-blur-md rounded-b-[20px] border-x border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg transition-colors">
            {/* 标题 - 最多2行 */}
            <h3 className={`font-bold text-sm line-clamp-2 leading-tight ${isDeleted ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'}`}>
                {doc.title || t.untitled}
            </h3>
            
            {/* 内容预览 - 最多2行 */}
            <p className="text-[11px] text-gray-400 dark:text-gray-500 font-medium line-clamp-2 leading-relaxed flex-shrink-0">
                {isDeleted && doc.deletedAt 
                    ? `Deleted ${new Date(doc.deletedAt).toLocaleDateString()}` 
                    : t.createFirst}
            </p>

            {/* 弹性空间 */}
            <div className="flex-1 min-h-0"></div>

            {/* Progress Bar - 固定在底部上方 */}
            {!isDeleted && progress && (
                <div className="flex-shrink-0">
                    <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                        <span>Progress</span>
                        <span className="tabular-nums">{progress.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200/30 dark:bg-gray-700/30 rounded-full overflow-hidden">
                        <motion.div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percent}%` }}
                            transition={{ 
                              type: "spring",
                              stiffness: 200,
                              damping: 20
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Footer - 固定在底部 */}
            <div className="flex-shrink-0 pt-2 border-t border-gray-200/30 dark:border-gray-700/30 flex items-center justify-between text-[10px] text-gray-400">
                <div className="flex items-center gap-1.5">
                   <Clock className="w-3 h-3" />
                   <span className="font-medium tabular-nums">{readTime}</span>
                </div>
                <span className="font-mono opacity-70 tabular-nums">{formatRelativeTime(doc.lastModified, lang)}</span>
            </div>
        </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  // 自定义比较函数：仅在关键属性变化时重新渲染
  return (
    prevProps.doc.id === nextProps.doc.id &&
    prevProps.doc.title === nextProps.doc.title &&
    prevProps.doc.content === nextProps.doc.content &&
    prevProps.doc.lastModified === nextProps.doc.lastModified &&
    prevProps.doc.isFavorite === nextProps.doc.isFavorite &&
    prevProps.doc.isDeleted === nextProps.doc.isDeleted &&
    prevProps.layout === nextProps.layout &&
    prevProps.lang === nextProps.lang
  );
});

export default DocCard;
