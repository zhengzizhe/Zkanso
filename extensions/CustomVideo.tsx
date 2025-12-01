import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper } from '@tiptap/react';
import React, { useState, useCallback } from 'react';
import { Trash2, Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

// 视频卡片组件
const VideoCard = ({ node, updateAttributes, deleteNode, selected }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { src, poster = '', controls = true } = node.attrs;

  const handlePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const handleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  }, [isMuted]);

  const handleFullscreen = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.requestFullscreen();
    }
  }, []);

  const handleDelete = useCallback(() => {
    if (deleteNode) deleteNode();
  }, [deleteNode]);

  return (
    <NodeViewWrapper 
      className="video-block-card my-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative max-w-4xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg">
        {/* 工具栏 */}
        {isHovered && (
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-sm rounded-lg p-2">
            <button
              onClick={handlePlayPause}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title={isPlaying ? '暂停' : '播放'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 text-white" />
              ) : (
                <Play className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={handleMute}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title={isMuted ? '取消静音' : '静音'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white" />
              ) : (
                <Volume2 className="w-4 h-4 text-white" />
              )}
            </button>
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-white/20 rounded transition-colors"
              title="全屏"
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </button>
            <div className="w-px h-4 bg-white/30 mx-1" />
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-red-500/20 rounded transition-colors"
              title="删除"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        {/* 视频播放器 */}
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls={controls}
          className="w-full h-auto"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      </div>
    </NodeViewWrapper>
  );
};

// 自定义视频节点
export const CustomVideo = Node.create({
  name: 'customVideo',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: {
        default: null,
        parseHTML: (element) => element.getAttribute('src'),
        renderHTML: (attributes) => {
          if (!attributes.src) return {};
          return { src: attributes.src };
        },
      },
      poster: {
        default: null,
        parseHTML: (element) => element.getAttribute('poster'),
        renderHTML: (attributes) => {
          if (!attributes.poster) return {};
          return { poster: attributes.poster };
        },
      },
      controls: {
        default: true,
        parseHTML: (element) => element.hasAttribute('controls'),
        renderHTML: (attributes) => {
          if (!attributes.controls) return {};
          return { controls: '' };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video[src]',
      },
      {
        tag: 'div[data-type="custom-video"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'custom-video' }), ['video', HTMLAttributes]];
  },

  addNodeView() {
    return ReactNodeViewRenderer(VideoCard);
  },
});

export default CustomVideo;
