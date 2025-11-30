# Craft 编辑器拖拽功能完整技术规格

## 1. 拖拽手柄视觉规格

### 1.1 六个点（Drag Dots）
- **布局**: 2列 × 3行网格
- **单点尺寸**: 3px × 3px 圆形
- **点颜色**: #9CA3AF (gray-400)
- **点间距**: 水平3px, 垂直3px
- **容器尺寸**: 12px × 12px
- **位置**: 相对块左侧 -24px, 垂直居中
- **默认状态**: opacity: 0
- **悬停状态**: opacity: 0.6
- **拖拽状态**: opacity: 1
- **过渡动画**: opacity 150ms ease

### 1.2 块类型图标
- **段落(P)**: 字母 "T"
- **一级标题(H1)**: "H1"
- **二级标题(H2)**: "H2"
- **三级标题(H3)**: "H3"
- **引用块**: """ (左双引号 U+201C)
- **代码块**: "<>" 
- **位置**: 6个点右侧 +2px
- **字体**: -apple-system, BlinkMacSystemFont, "Segoe UI"
- **字号**: 10px (标题为9px)
- **字重**: 600 (semibold)
- **颜色**: #9CA3AF
- **默认状态**: opacity: 0
- **悬停状态**: opacity: 0.5

## 2. 拖拽镜像元素规格

### 2.1 视觉外观
- **透明度**: 0.92
- **背景**: 原块背景色 + rgba(255,255,255,0.95)叠加
- **边框**: 1px solid rgba(99, 102, 241, 0.3)
- **圆角**: 6px
- **阴影**: 
  - 主阴影: 0 20px 40px rgba(0,0,0,0.15)
  - 次阴影: 0 8px 16px rgba(0,0,0,0.08)
  - 发光: 0 0 0 1px rgba(99, 102, 241, 0.1)
- **缩放**: scale(1.02)
- **旋转**: rotate(1deg)
- **滤镜**: drop-shadow(0 4px 12px rgba(99, 102, 241, 0.15))

### 2.2 动画效果
- **拾取动画**: 
  - 持续时间: 150ms
  - 缓动: cubic-bezier(0.4, 0, 0.2, 1)
  - 变换: scale(1.0 → 1.02) + opacity(1 → 0.92)

## 3. 放置指示器规格

### 3.1 蓝线样式
- **高度**: 3px
- **宽度**: 100% (相对父容器)
- **背景**: linear-gradient(90deg, #6366F1 0%, #8B5CF6 50%, #6366F1 100%)
- **圆角**: 2px
- **阴影**: 
  - 0 0 8px rgba(99, 102, 241, 0.6)
  - 0 2px 6px rgba(99, 102, 241, 0.4)
- **位置**: 插入位置上方 -2px 或下方 +2px

### 3.2 两端圆点
- **直径**: 8px
- **背景**: linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)
- **阴影**: 
  - 0 0 8px rgba(99, 102, 241, 0.7)
  - 0 0 16px rgba(99, 102, 241, 0.4)
- **位置**: 线条两端，translateX(-50%) / translateX(50%)

### 3.3 发光动画
- **效果**: 白色光斑从左向右移动
- **宽度**: 50%线条宽度
- **背景**: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)
- **模糊**: blur(3px)
- **动画**: 
  - 持续时间: 1.2s
  - 循环: infinite
  - 缓动: linear
  - 移动: translateX(-100% → 200%)

### 3.4 入场/退场动画
- **入场**: 
  - scaleX(0.85 → 1.0)
  - opacity(0 → 1)
  - 持续时间: 120ms
  - 缓动: cubic-bezier(0.34, 1.56, 0.64, 1) (弹簧效果)
- **退场**:
  - scaleX(1.0 → 0.9)
  - opacity(1 → 0)
  - 持续时间: 100ms
  - 缓动: ease-out

## 4. 原始块拖拽状态

### 4.1 视觉反馈
- **透明度**: 0.4
- **轮廓**: 2px dashed rgba(99, 102, 241, 0.4)
- **轮廓偏移**: 2px
- **背景**: rgba(99, 102, 241, 0.02)
- **过渡**: all 120ms ease

### 4.2 拖拽开始
- **cursor**: grabbing
- **user-select**: none
- **transform**: scale(0.98)

## 5. 其他块实时重排动画

### 5.1 FLIP 动画参数
- **类型**: spring
- **刚度(stiffness)**: 380
- **阻尼(damping)**: 28
- **质量(mass)**: 0.8
- **初始速度**: 0

### 5.2 移动效果
- **位移**: 根据块高度自动计算
- **缓动**: 弹簧物理模拟
- **持续时间**: 300-500ms (根据距离)

## 6. 自动滚动规格

### 6.1 触发区域
- **顶部阈值**: 距离顶部 < 100px
- **底部阈值**: 距离底部 < 100px

### 6.2 滚动速度
- **最大速度**: 25px/frame
- **速度曲线**: easeInOutQuad
- **计算公式**: speed = maxSpeed × Math.pow(distance/threshold, 1.8)

### 6.3 平滑滚动
- **behavior**: smooth
- **帧率**: 60fps
- **加速度**: 渐进式

## 7. 块类型特定样式

### 7.1 段落块
- **padding**: 2px 4px
- **min-height**: 24px
- **line-height**: 1.6
- **font-size**: 16px

### 7.2 标题块
- **H1**: 30px / 700 / line-height 1.25
- **H2**: 24px / 600 / line-height 1.3
- **H3**: 20px / 600 / line-height 1.35
- **手柄位置**: top偏移 +6px (对齐大字号)

### 7.3 引用块
- **padding**: 12px 16px
- **border-left**: 4px solid #6366F1
- **background**: #F9FAFB
- **border-radius**: 6px
- **font-style**: italic
- **手柄位置**: top偏移 +14px

## 8. 交互状态时序

### 8.1 悬停序列
1. 鼠标进入 → 延迟0ms → 显示手柄 (150ms fade in)
2. 鼠标停留 → cursor: grab
3. 鼠标离开 → 延迟100ms → 隐藏手柄 (150ms fade out)

### 8.2 拖拽序列
1. mousedown → cursor: grabbing
2. 移动3px → 触发拖拽 → 生成镜像
3. 原块变半透明 (120ms)
4. 移动中 → 显示放置指示器
5. 其他块开始动画重排
6. drop → 执行位置交换
7. 所有块弹簧动画到新位置 (300ms)
8. mouseup → 恢复cursor → 清理状态

## 9. 性能优化

### 9.1 防抖节流
- **悬停检测**: debounce 50ms
- **拖拽位置更新**: throttle 16ms (60fps)
- **自动滚动**: requestAnimationFrame

### 9.2 渲染优化
- **will-change**: transform, opacity (拖拽元素)
- **transform**: translateZ(0) (硬件加速)
- **contain**: layout style paint (隔离重排)

## 10. 浏览器兼容性

- **Chrome/Edge**: 全功能支持
- **Safari**: 全功能支持 (需要-webkit-前缀)
- **Firefox**: 全功能支持
- **最低版本**: Chrome 90+, Safari 14+, Firefox 88+

---

**实现策略**: 
1. 使用 Tiptap Extension API + ProseMirror Plugin
2. Framer Motion 处理 FLIP 动画
3. 原生 HTML5 Drag & Drop API
4. React 组件封装视觉层
