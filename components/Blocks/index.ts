/**
 * 区块组件导出
 * 
 * 包含所有已实现的区块 NodeView 组件
 */

export { BlockWrapper } from './BlockWrapper';

// P0 核心区块（已完成）
// ParagraphNodeView 已移至 components/Editor/BlockComponents/
export { HeadingNodeView } from './HeadingBlock';
export { TaskItemNodeView } from './TaskListBlock';
export { QuoteNodeView } from './QuoteBlock';
export { CodeBlockNodeView } from './CodeBlockBlock';

// P1 高级区块（已完成）
export { CalloutNodeView } from './CalloutBlock';
export { ImageNodeView } from './ImageBlock';

// P2 扩展区块（待实现）
// export { TableNodeView } from './TableBlock';
// export { VideoNodeView } from './VideoBlock';
// export { FileNodeView } from './FileBlock';

// 拖拽控制器
export { useDragController } from './DragController';

// 飞书风格块级操作手柄
export { FeishuBlockHandle } from './FeishuBlockHandle';

// Craft 风格放置指示器
export { DropIndicator } from './DropIndicator';
