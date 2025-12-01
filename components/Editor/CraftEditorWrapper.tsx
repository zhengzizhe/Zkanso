import React, { useState } from 'react';
import { CraftEditor } from './CraftEditor';
import { ArrowLeft, Share2, Maximize2, Minimize2, User, Calendar, Radio, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';

interface CraftEditorWrapperProps {
  docId: string;
  onBack: () => void;
  pageTitle?: string;
  spaceName?: string;
  coverImage?: string;  // 头图URL
  author?: {
    name: string;
    avatar?: string;
  };
  createdAt?: string;  // 创建时间
  updatedAt?: string;  // 更新时间
  collaborationUrl?: string;
  onShare?: () => void;
}

/**
 * Craft 编辑器包装组件
 * 
 * 适配原 TiptapEditor 接口，添加顶部工具栏
 */
export const CraftEditorWrapper: React.FC<CraftEditorWrapperProps> = ({
  docId,
  onBack,
  pageTitle = 'Untitled',
  spaceName = 'Personal',
  coverImage,
  author = { name: 'Anonymous', avatar: undefined },
  createdAt,
  updatedAt,
  onShare,
}) => {
  const [content, setContent] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 格式化日期
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`craft-editor-page ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* 顶部工具栏 - 完全按照 CRAFT_EDITOR_USER_GUIDE.md 2.1-2.4 节规范 */}
      <header className="craft-editor-header">
        <div className="craft-header-container">
          {/* 2.1 返回按钮 (左侧) - 只有图标 */}
          <motion.button
            className="craft-back-button"
            onClick={onBack}
            whileHover={{ 
              scale: 1.05,
              transition: { type: 'spring', stiffness: 400, damping: 25 }
            }}
            whileTap={{ 
              scale: 0.95,
              transition: { type: 'spring', stiffness: 600, damping: 30 }
            }}
            aria-label="返回"
          >
            <ArrowLeft className="craft-icon" />
          </motion.button>

          {/* 2.2 文档标题 (中间) */}
          <div className="craft-title-section">
            <h1 className="craft-doc-title">{pageTitle}</h1>
            <p className="craft-space-name">{spaceName}</p>
          </div>

          {/* 右侧操作按钮组 */}
          <div className="craft-actions">
            {/* 协同图标 (WiFi样式) */}
            <motion.button
              className="craft-icon-button"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.15 }
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="协同编辑"
              title="协同编辑"
            >
              <Radio className="craft-icon" />
            </motion.button>

            {/* 标记图标 */}
            <motion.button
              className="craft-icon-button"
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.15 }
              }}
              whileTap={{ scale: 0.95 }}
              aria-label="标记"
              title="标记"
            >
              <Bookmark className="craft-icon" />
            </motion.button>

            {/* 2.3 全屏按钮 */}
            <motion.button
              className="craft-icon-button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.15 }
              }}
              whileTap={{ scale: 0.95 }}
              aria-label={isFullscreen ? '退出全屏' : '全屏'}
              title={isFullscreen ? '退出全屏' : '全屏'}
            >
              {isFullscreen ? (
                <Minimize2 className="craft-icon" />
              ) : (
                <Maximize2 className="craft-icon" />
              )}
            </motion.button>

            {/* 2.4 分享按钮 - 只有图标 */}
            {onShare && (
              <motion.button
                className="craft-icon-button craft-share-button"
                onClick={onShare}
                whileHover={{ 
                  scale: 1.05,
                  transition: { type: 'spring', stiffness: 400, damping: 25 }
                }}
                whileTap={{ 
                  scale: 0.95,
                  transition: { type: 'spring', stiffness: 600, damping: 30 }
                }}
                aria-label="分享"
                title="分享"
              >
                <Share2 className="craft-icon" />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Craft 编辑器主体 */}
      <main className="craft-editor-body">
        <div className="craft-document-container">
          {/* 头图 */}
          {coverImage && (
            <div className="craft-cover-image">
              <img src={coverImage} alt="文档封面" />
            </div>
          )}

          {/* 文档标题区域 */}
          <div className="craft-document-header">
            <h1 className="craft-document-title">{pageTitle}</h1>
            
            {/* 文档元信息 */}
            <div className="craft-document-meta">
              {/* 作者信息 */}
              <div className="craft-meta-item">
                <div className="craft-author">
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name} className="craft-avatar" />
                  ) : (
                    <div className="craft-avatar-placeholder">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="craft-author-name">{author.name}</span>
                </div>
              </div>

              {/* 创建时间 */}
              {createdAt && (
                <div className="craft-meta-item">
                  <Calendar className="craft-meta-icon" />
                  <span className="craft-meta-text">创建于 {formatDate(createdAt)}</span>
                </div>
              )}

              {/* 更新时间 */}
              {updatedAt && updatedAt !== createdAt && (
                <div className="craft-meta-item">
                  <Calendar className="craft-meta-icon" />
                  <span className="craft-meta-text">更新于 {formatDate(updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* 编辑器内容 */}
          <div className="craft-content-wrapper">
            <CraftEditor
              content={content}
              onChange={setContent}
              placeholder="输入 / 召唤命令菜单，或者开始输入..."
            />
          </div>
        </div>
      </main>

      <style jsx>{`
        /* ===== 页面容器 ===== */
        .craft-editor-page {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--craft-gray-100, #F5F5F5); /* 浅灰背景 */
        }

        .craft-editor-page.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
        }

        /* ===== 顶部工具栏 - 透明背景 ===== */
        .craft-editor-header {
          flex-shrink: 0;
          height: 64px;
          background: transparent; /* 透明背景 */
          border-bottom: none; /* 去掉底部边框 */
          box-shadow: none; /* 去掉阴影 */
        }

        .craft-header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          padding: 0 24px;
          max-width: 100%;
        }

        /* ===== 2.1 返回按钮 - 只有图标 ===== */
        .craft-back-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          padding: 0;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--craft-gray-600, #757575);
          cursor: pointer;
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .craft-back-button:hover {
          background: var(--craft-gray-200, #EEEEEE);
          color: var(--craft-gray-900, #212121);
        }

        .craft-icon {
          width: 20px;
          height: 20px;
        }

        /* ===== 2.2 文档标题 ===== */
        .craft-title-section {
          flex: 1;
          min-width: 0;
          margin: 0 16px;
        }

        .craft-doc-title {
          font-size: 20px;
          font-weight: 700;
          color: var(--craft-gray-900, #212121);
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (min-width: 640px) {
          .craft-doc-title {
            font-size: 24px;
          }
        }

        .craft-space-name {
          font-size: 12px;
          color: var(--craft-gray-500, #9E9E9E);
          margin: 4px 0 0 0;
        }

        /* ===== 右侧操作区 ===== */
        .craft-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ===== 2.3 全屏按钮 ===== */
        .craft-icon-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--craft-gray-600, #757575);
          cursor: pointer;
          transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
        }

        .craft-icon-button:hover {
          background: var(--craft-gray-200, #EEEEEE);
          color: var(--craft-gray-900, #212121);
        }

        /* ===== 2.4 分享按钮 - 只有图标 ===== */
        .craft-share-button {
          /* 与其他图标按钮样式统一 */
        }

        /* ===== 编辑器主体 ===== */
        .craft-editor-body {
          flex: 1;
          overflow-y: auto;
          position: relative;
          background: var(--craft-gray-100, #F5F5F5); /* 与页面背景一致 */
          padding: 32px 0; /* 添加上下内边距 */
        }

        /* ===== 文档容器 ===== */
        .craft-document-container {
          max-width: 768px;
          margin: 0 auto;
          padding: 0;
          background: #FFFFFF; /* 白色背景，与灰色背景形成对比 */
          min-height: calc(100vh - 128px);
          border-radius: 12px; /* 添加圆角 */
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); /* 添加阴影 */
        }

        /* ===== 头图 ===== */
        .craft-cover-image {
          width: 100%;
          height: 320px;
          overflow: hidden;
          background: var(--craft-gray-100, #F5F5F5);
        }

        .craft-cover-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ===== 文档标题区域 ===== */
        .craft-document-header {
          padding: 48px 64px 24px;
        }

        @media (max-width: 768px) {
          .craft-document-header {
            padding: 32px 24px 16px;
          }
        }

        .craft-document-title {
          font-size: 48px;
          font-weight: 700;
          line-height: 1.2;
          color: var(--craft-gray-900, #212121);
          margin: 0 0 24px 0;
          word-wrap: break-word;
        }

        @media (max-width: 768px) {
          .craft-document-title {
            font-size: 36px;
          }
        }

        /* ===== 文档元信息 ===== */
        .craft-document-meta {
          display: flex;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .craft-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* ===== 作者信息 ===== */
        .craft-author {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .craft-avatar,
        .craft-avatar-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
        }

        .craft-avatar {
          object-fit: cover;
          border: 2px solid var(--craft-gray-200, #EEEEEE);
        }

        .craft-avatar-placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--craft-gray-200, #EEEEEE);
          color: var(--craft-gray-600, #757575);
        }

        .craft-author-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--craft-gray-700, #616161);
        }

        /* ===== 元信息图标和文字 ===== */
        .craft-meta-icon {
          width: 16px;
          height: 16px;
          color: var(--craft-gray-500, #9E9E9E);
        }

        .craft-meta-text {
          font-size: 14px;
          color: var(--craft-gray-600, #757575);
        }

        /* ===== 内容包装器 ===== */
        .craft-content-wrapper {
          padding: 0 64px 64px;
        }

        @media (max-width: 768px) {
          .craft-content-wrapper {
            padding: 0 24px 48px;
          }
        }

        /* ===== 暗色模式 ===== */
        @media (prefers-color-scheme: dark) {
          .craft-editor-page {
            background: #1A1A1A;
          }

          .craft-editor-header {
            background: #2D2D2D;
            border-bottom-color: #404040;
          }

          .craft-back-button,
          .craft-icon-button {
            color: #A0A0A0;
          }

          .craft-back-button:hover,
          .craft-icon-button:hover {
            background: #353535;
            color: #E0E0E0;
          }

          .craft-doc-title {
            color: #E0E0E0;
          }

          .craft-space-name {
            color: #707070;
          }

          .craft-editor-body {
            background: #1A1A1A;
          }

          .craft-document-container {
            background: #2D2D2D;
          }

          .craft-document-title {
            color: #E0E0E0;
          }

          .craft-cover-image {
            background: #353535;
          }

          .craft-author-name,
          .craft-meta-text {
            color: #A0A0A0;
          }

          .craft-avatar {
            border-color: #404040;
          }

          .craft-avatar-placeholder {
            background: #353535;
            color: #A0A0A0;
          }
        }
      `}</style>
    </div>
  );
};

export default CraftEditorWrapper;
