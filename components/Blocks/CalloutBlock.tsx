import React from 'react';
import { NodeViewProps, NodeViewContent } from '@tiptap/react';
import { BlockWrapper } from './BlockWrapper';
import { Info, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

type CalloutType = 'info' | 'success' | 'warning' | 'error';

interface CalloutConfig {
  bg: string;
  border: string;
  icon: React.ReactNode;
  iconColor: string;
  titleColor: string;
  title: string;
}

/**
 * 提示块 NodeView
 * 
 * 设计规范：
 * - 外边距: margin: 12px 0
 * - 内边距: padding: 16px
 * - 圆角: border-radius: 8px
 * - 图标大小: 20px
 */
export const CalloutNodeView: React.FC<NodeViewProps> = ({ node, updateAttributes }) => {
  const type = (node.attrs.type || 'info') as CalloutType;

  const configs: Record<CalloutType, CalloutConfig> = {
    info: {
      bg: '#EFF6FF',
      border: '#3B82F6',
      icon: <Info className="w-5 h-5" />,
      iconColor: '#3B82F6',
      titleColor: '#1E40AF',
      title: '信息'
    },
    success: {
      bg: '#ECFDF5',
      border: '#10B981',
      icon: <CheckCircle className="w-5 h-5" />,
      iconColor: '#10B981',
      titleColor: '#047857',
      title: '成功'
    },
    warning: {
      bg: '#FFFBEB',
      border: '#F59E0B',
      icon: <AlertTriangle className="w-5 h-5" />,
      iconColor: '#F59E0B',
      titleColor: '#D97706',
      title: '警告'
    },
    error: {
      bg: '#FEF2F2',
      border: '#EF4444',
      icon: <AlertCircle className="w-5 h-5" />,
      iconColor: '#EF4444',
      titleColor: '#DC2626',
      title: '错误'
    }
  };

  const config = configs[type];

  return (
    <BlockWrapper style={{ margin: '12px 0' }}>
      <div 
        className="kanso-callout"
        style={{
          margin: 0,
          padding: '16px',
          backgroundColor: config.bg,
          border: `1px solid ${config.border}`,
          borderRadius: '8px',
          display: 'flex',
          gap: '12px'
        }}
      >
        {/* 图标 */}
        <div style={{ color: config.iconColor, flexShrink: 0 }}>
          {config.icon}
        </div>

        {/* 内容 */}
        <div style={{ flex: 1 }}>
          {/* 标题栏 */}
          <div style={{
            fontWeight: 600,
            color: config.titleColor,
            marginBottom: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px'
          }}>
            {config.title}

            {/* 类型选择器 */}
            <select
              value={type}
              onChange={(e) => updateAttributes({ type: e.target.value })}
              style={{
                marginLeft: 'auto',
                fontSize: '12px',
                padding: '2px 6px',
                borderRadius: '4px',
                border: `1px solid ${config.border}`,
                background: 'white',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="info">信息</option>
              <option value="success">成功</option>
              <option value="warning">警告</option>
              <option value="error">错误</option>
            </select>
          </div>

          {/* 内容 */}
          <NodeViewContent 
            style={{
              outline: 'none',
              color: '#1F2937'
            }}
          />
        </div>
      </div>
    </BlockWrapper>
  );
};
