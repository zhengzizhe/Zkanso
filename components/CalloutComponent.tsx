import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { AlertCircle, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface CalloutComponentProps {
  node: {
    attrs: {
      type: 'info' | 'warning' | 'success' | 'error';
    };
  };
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
}

const CalloutComponent: React.FC<CalloutComponentProps> = ({ node, updateAttributes, selected }) => {
  const type = node.attrs.type;

  const icons = {
    info: <Info className="w-5 h-5" />,
    warning: <AlertTriangle className="w-5 h-5" />,
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
  };

  const colors = {
    info: 'border-blue-400 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-100',
    warning: 'border-yellow-400 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/20 dark:text-yellow-100',
    success: 'border-green-400 bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100',
    error: 'border-red-400 bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100',
  };

  const iconColors = {
    info: 'text-blue-500 dark:text-blue-400',
    warning: 'text-yellow-500 dark:text-yellow-400',
    success: 'text-green-500 dark:text-green-400',
    error: 'text-red-500 dark:text-red-400',
  };

  return (
    <NodeViewWrapper
      as="div"
      className={`border-l-4 p-4 rounded-md my-2 ${colors[type]} ${selected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="flex gap-3">
        <div className={`flex-shrink-0 mt-0.5 ${iconColors[type]}`}>
          {icons[type]}
        </div>
        <div className="flex-1">
          <NodeViewContent />
        </div>
        <select
          value={type}
          onChange={(e) => updateAttributes({ type: e.target.value })}
          className="text-xs bg-transparent border rounded px-2 py-1 cursor-pointer opacity-0 hover:opacity-100 transition-opacity"
        >
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="success">Success</option>
          <option value="error">Error</option>
        </select>
      </div>
    </NodeViewWrapper>
  );
};

export default CalloutComponent;
