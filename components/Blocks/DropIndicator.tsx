import React from 'react';
import { motion } from 'framer-motion';

interface DropIndicatorProps {
  position: 'before' | 'after';
}

/**
 * Craft 风格的放置指示器
 * 
 * 特性：
 * - 渐变蓝色线条
 * - 两端圆点
 * - 发光效果
 * - 入场动画
 */
export const DropIndicator: React.FC<DropIndicatorProps> = ({ position }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      exit={{ opacity: 0, scaleX: 0.8 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        duration: 0.15
      }}
      style={{
        position: 'absolute',
        left: '-8px',
        right: '-8px',
        height: '3px',
        top: position === 'before' ? '-2px' : 'calc(100% + 2px)',
        zIndex: 100,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* 左侧圆点 */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 0 8px rgba(99, 102, 241, 0.6), 0 0 16px rgba(99, 102, 241, 0.3)',
          position: 'absolute',
          left: '0',
          transform: 'translateX(-50%)'
        }}
      />
      
      {/* 渐变线条 */}
      <div
        style={{
          flex: 1,
          height: '3px',
          background: 'linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #6366F1 100%)',
          borderRadius: '2px',
          boxShadow: '0 0 12px rgba(99, 102, 241, 0.5), 0 2px 8px rgba(99, 102, 241, 0.3)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* 发光动画 */}
        <motion.div
          animate={{
            x: ['-100%', '200%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '50%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)',
            filter: 'blur(2px)'
          }}
        />
      </div>
      
      {/* 右侧圆点 */}
      <div
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          boxShadow: '0 0 8px rgba(99, 102, 241, 0.6), 0 0 16px rgba(99, 102, 241, 0.3)',
          position: 'absolute',
          right: '0',
          transform: 'translateX(50%)'
        }}
      />
    </motion.div>
  );
};
