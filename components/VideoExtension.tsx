import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState } from 'react';
import { Video, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoComponent = ({ node, updateAttributes, deleteNode }: any) => {
  const { src } = node.attrs;
  const [isEditing, setIsEditing] = useState(!src);
  const [videoUrl, setVideoUrl] = useState(src || '');

  const handleSave = () => {
    if (!videoUrl.trim()) {
      deleteNode();
      return;
    }
    
    // 转换 YouTube/Bilibili 链接为嵌入格式
    let embedUrl = videoUrl;
    
    // YouTube
    if (videoUrl.includes('youtube.com/watch')) {
      const videoId = new URL(videoUrl).searchParams.get('v');
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (videoUrl.includes('youtu.be/')) {
      const videoId = videoUrl.split('youtu.be/')[1].split('?')[0];
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
    }
    // Bilibili
    else if (videoUrl.includes('bilibili.com/video/')) {
      const bvid = videoUrl.match(/video\/(BV[a-zA-Z0-9]+)/)?.[1];
      if (bvid) {
        embedUrl = `https://player.bilibili.com/player.html?bvid=${bvid}`;
      }
    }
    
    updateAttributes({ src: embedUrl });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!src) {
      deleteNode();
    } else {
      setVideoUrl(src);
      setIsEditing(false);
    }
  };

  return (
    <NodeViewWrapper>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="my-4"
      >
        {isEditing ? (
          <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                  <Video className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">嵌入视频</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg hover:shadow-xl"
                  title="保存"
                >
                  <Check className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="p-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-all"
                  title="取消"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
            
            <input
              type="text"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="粘贴 YouTube 或 Bilibili 视频链接..."
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              autoFocus
            />
            
            <div className="text-xs text-gray-500 dark:text-gray-400">
              支持 YouTube 和 Bilibili 视频链接
            </div>
          </div>
        ) : (
          <div className="relative group rounded-2xl overflow-hidden bg-black shadow-2xl">
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="absolute top-3 right-3 z-10 p-2.5 rounded-xl bg-black/60 backdrop-blur-sm shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/80"
              title="编辑"
            >
              <Edit2 className="w-4 h-4 text-white" />
            </motion.button>
            
            <div className="relative" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={src}
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </motion.div>
    </NodeViewWrapper>
  );
};

export const VideoExtension = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="video"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'video' }), 0];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoComponent);
  },
});
