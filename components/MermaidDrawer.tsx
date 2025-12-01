import React, { useState, useCallback } from 'react';
import { Excalidraw, exportToBlob, MainMenu, Footer } from '@excalidraw/excalidraw';
import { X, Save, FileCode, Download, Trash2, Info } from 'lucide-react';
import { testMermaidCode } from '../utils/testMermaid';

interface MermaidDrawerProps {
  onClose: () => void;
  onSave: (code: string) => void;
  initialCode?: string;
}

// 将 Mermaid 代码解析为 Excalidraw 初始元素
const parseMermaidToElements = (code: string): any[] => {
  if (!code || !code.trim()) return [];
  
  const elements: any[] = [];
  const lines = code.split('\n').filter(line => line.trim() && !line.trim().startsWith('flowchart') && !line.trim().startsWith('graph'));
  
  const nodePositions = new Map<string, { x: number; y: number; elementId: string; isDiamond?: boolean; isCircle?: boolean }>();
  let yOffset = 100;
  let xOffset = 200;
  
  // 第一遍：处理所有节点
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // 匹配节点定义：N1[文本] 或 N1((文本)) 或 N1{文本}
    const nodeMatch = trimmed.match(/([A-Za-z]\w*)\[([^\]]+)\]|([A-Za-z]\w*)\(\(([^)]+)\)\)|([A-Za-z]\w*)\{([^}]+)\}/);
    
    if (nodeMatch) {
      const nodeId = nodeMatch[1] || nodeMatch[3] || nodeMatch[5];
      const nodeLabel = nodeMatch[2] || nodeMatch[4] || nodeMatch[6];
      const isCircle = !!nodeMatch[3];
      const isDiamond = !!nodeMatch[5];
      
      const x = xOffset + (index % 3) * 250;
      const y = yOffset + Math.floor(index / 3) * 200;
      
      nodePositions.set(nodeId, { x, y, elementId: `element-${nodeId}`, isDiamond, isCircle });
      
      // 创建形状元素
      const shapeElement = {
        id: `element-${nodeId}`,
        type: isDiamond ? 'diamond' : (isCircle ? 'ellipse' : 'rectangle'),
        x,
        y,
        width: 150,
        height: isDiamond ? 150 : (isCircle ? 100 : 80),
        angle: 0,
        strokeColor: '#6366f1',
        backgroundColor: '#e0e7ff',
        fillStyle: 'solid',
        strokeWidth: 2,
        strokeStyle: 'solid',
        roughness: 1,
        opacity: 100,
        groupIds: [],
        roundness: isCircle ? { type: 3 } : (isDiamond ? null : { type: 3 }),
        seed: Math.floor(Math.random() * 1000000),
        version: 1,
        versionNonce: Math.floor(Math.random() * 1000000),
        isDeleted: false,
        boundElements: [],
        updated: Date.now(),
        link: null,
        locked: false,
      };
      
      elements.push(shapeElement);
      
      // 创建文本元素
      if (nodeLabel) {
        const textElement = {
          id: `text-${nodeId}`,
          type: 'text',
          x: x + 20,
          y: y + (isDiamond ? 60 : (isCircle ? 35 : 25)),
          width: 110,
          height: 25,
          angle: 0,
          strokeColor: '#1e293b',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          strokeWidth: 1,
          strokeStyle: 'solid',
          roughness: 0,
          opacity: 100,
          groupIds: [],
          roundness: null,
          seed: Math.floor(Math.random() * 1000000),
          version: 1,
          versionNonce: Math.floor(Math.random() * 1000000),
          isDeleted: false,
          boundElements: [],
          updated: Date.now(),
          link: null,
          locked: false,
          text: nodeLabel,
          fontSize: 16,
          fontFamily: 1,
          textAlign: 'center',
          verticalAlign: 'middle',
          baseline: 18,
          containerId: null,
          originalText: nodeLabel,
        };
        
        elements.push(textElement);
      }
    }
  });
  
  // 第二遍：处理所有连接
  lines.forEach((line) => {
    const trimmed = line.trim();
    
    // 匹配连接：A --> B 或 A --|文本|--> B
    const connectionMatch = trimmed.match(/([A-Za-z]\w*)\s*-->\s*([A-Za-z]\w*)|([A-Za-z]\w*)\s*--\|([^|]+)\|-->\s*([A-Za-z]\w*)/);
    
    if (connectionMatch) {
      let fromId, toId, label;
      
      // 处理两种格式
      if (connectionMatch[1]) {
        // 格式1: A --> B
        fromId = connectionMatch[1];
        toId = connectionMatch[2];
        label = '';
      } else {
        // 格式2: A --|文本|--> B
        fromId = connectionMatch[3];
        label = connectionMatch[4];
        toId = connectionMatch[5];
      }
      
      const fromPos = nodePositions.get(fromId);
      const toPos = nodePositions.get(toId);
      
      if (fromPos && toPos) {
        // 计算箭头的起点和终点
        const startX = fromPos.x + 75;
        const startY = fromPos.y + (fromPos.isDiamond ? 75 : (fromPos.isCircle ? 50 : 40));
        const endX = toPos.x + 75;
        const endY = toPos.y + (toPos.isDiamond ? 75 : (toPos.isCircle ? 50 : 40));
        
        // 创建箭头元素
        const arrowElement = {
          id: `arrow-${fromId}-${toId}`,
          type: 'arrow',
          x: Math.min(startX, endX),
          y: Math.min(startY, endY),
          width: Math.abs(endX - startX),
          height: Math.abs(endY - startY),
          angle: 0,
          strokeColor: '#6366f1',
          backgroundColor: 'transparent',
          fillStyle: 'solid',
          strokeWidth: 2,
          strokeStyle: 'solid',
          roughness: 1,
          opacity: 100,
          groupIds: [],
          roundness: { type: 2 },
          seed: Math.floor(Math.random() * 1000000),
          version: 1,
          versionNonce: Math.floor(Math.random() * 1000000),
          isDeleted: false,
          boundElements: [],
          updated: Date.now(),
          link: null,
          locked: false,
          points: [
            [startX - Math.min(startX, endX), startY - Math.min(startY, endY)],
            [endX - Math.min(startX, endX), endY - Math.min(startY, endY)]
          ],
          lastCommittedPoint: null,
          startBinding: {
            elementId: fromPos.elementId,
            focus: 0,
            gap: 1,
          },
          endBinding: {
            elementId: toPos.elementId,
            focus: 0,
            gap: 1,
          },
          startArrowhead: null,
          endArrowhead: 'arrow',
        };
        
        elements.push(arrowElement);
        
        // 如果有标签，创建文本元素
        if (label) {
          const labelElement = {
            id: `label-${fromId}-${toId}`,
            type: 'text',
            x: (startX + endX) / 2 - 30,
            y: (startY + endY) / 2 - 15,
            width: 60,
            height: 25,
            angle: 0,
            strokeColor: '#1e293b',
            backgroundColor: 'transparent',
            fillStyle: 'solid',
            strokeWidth: 1,
            strokeStyle: 'solid',
            roughness: 0,
            opacity: 100,
            groupIds: [],
            roundness: null,
            seed: Math.floor(Math.random() * 1000000),
            version: 1,
            versionNonce: Math.floor(Math.random() * 1000000),
            isDeleted: false,
            boundElements: [],
            updated: Date.now(),
            link: null,
            locked: false,
            text: label,
            fontSize: 14,
            fontFamily: 1,
            textAlign: 'center',
            verticalAlign: 'middle',
            baseline: 16,
            containerId: null,
            originalText: label,
          };
          
          elements.push(labelElement);
        }
      }
    }
  });
  
  return elements;
};

// 将 Excalidraw 元素转换为 Mermaid 代码
const convertToMermaid = (elements: readonly any[]): string => {
  // 筛选出矩形、椭圆、菱形作为节点
  const nodes = elements.filter(el => 
    el.type === 'rectangle' || el.type === 'ellipse' || el.type === 'diamond'
  );
  
  // 筛选出箭头作为连接
  const arrows = elements.filter(el => el.type === 'arrow');
  
  // 筛选出文本
  const texts = elements.filter(el => el.type === 'text');

  // 生成节点ID映射
  const nodeMap = new Map<string, { id: string; label: string; shape: string }>();
  
  nodes.forEach((node, index) => {
    const nodeId = `N${index + 1}`;
    
    // 查找关联的文本（在节点内部或附近的文本）
    const relatedText = texts.find((text: any) => {
      if (!node.x || !node.y || !node.width || !node.height) return false;
      if (!text.x || !text.y) return false;
      
      return text.x >= node.x - 10 && 
             text.x <= node.x + node.width + 10 &&
             text.y >= node.y - 10 && 
             text.y <= node.y + node.height + 10;
    });
    
    const label = relatedText?.text || `节点${index + 1}`;
    
    // 根据形状确定 Mermaid 语法
    let shape = '[]';
    if (node.type === 'ellipse') shape = '(())';
    if (node.type === 'diamond') shape = '{}';
    
    nodeMap.set(node.id, { id: nodeId, label, shape });
  });

  // 生成 Mermaid 代码
  let code = 'flowchart TD\n';
  
  // 添加节点定义
  nodeMap.forEach(({ id, label, shape }) => {
    if (shape === '[]') {
      code += `    ${id}[${label}]\n`;
    } else if (shape === '(())') {
      code += `    ${id}((${label}))\n`;
    } else if (shape === '{}') {
      code += `    ${id}{${label}}\n`;
    }
  });
  
  // 添加连接
  arrows.forEach((arrow: any) => {
    const startBinding = arrow.startBinding;
    const endBinding = arrow.endBinding;
    
    if (startBinding?.elementId && endBinding?.elementId) {
      const fromNode = nodeMap.get(startBinding.elementId);
      const toNode = nodeMap.get(endBinding.elementId);
      
      if (fromNode && toNode) {
        // 查找箭头附近的文本作为标签
        const arrowLabel = texts.find((text: any) => {
          if (!text.x || !text.y || !arrow.x || !arrow.y) return false;
          
          const distance = Math.sqrt(
            Math.pow(text.x - arrow.x, 2) + 
            Math.pow(text.y - arrow.y, 2)
          );
          return distance < 50;
        });
        
        const label = arrowLabel?.text ? `|${arrowLabel.text}|` : '';
        code += `    ${fromNode.id} -->${label} ${toNode.id}\n`;
      }
    }
  });
  
  return code || 'flowchart TD\n    A[开始] --> B[结束]';
};

export const MermaidDrawer: React.FC<MermaidDrawerProps> = ({ onClose, onSave, initialCode }) => {
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // 解析初始代码为 Excalidraw 元素
  const initialElements = React.useMemo(() => {
    return initialCode ? parseMermaidToElements(initialCode) : [];
  }, [initialCode]);

  // 生成代码预览
  const handleGenerateCode = useCallback(() => {
    if (!excalidrawAPI) return;
    
    const elements = excalidrawAPI.getSceneElements();
    const code = convertToMermaid(elements);
    setGeneratedCode(code);
    setShowCode(true);
  }, [excalidrawAPI]);

  // 保存并关闭
  const handleSave = useCallback(() => {
    if (!excalidrawAPI) return;
    
    const elements = excalidrawAPI.getSceneElements();
    const code = convertToMermaid(elements);
    onSave(code);
    onClose();
  }, [excalidrawAPI, onSave, onClose]);

  // 导出PNG
  const handleExportPNG = useCallback(async () => {
    if (!excalidrawAPI) return;
    
    try {
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const files = excalidrawAPI.getFiles();
      
      const blob = await exportToBlob({
        elements,
        appState,
        files,
        getDimensions: () => ({ width: 1920, height: 1080 }),
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'mermaid-diagram.png';
      link.click();
      URL.revokeObjectURL(url);
      
      // 使用自定义弹窗
      if ((window as any).customDialog) {
        (window as any).customDialog.alert('图片已成功导出！', '导出成功');
      } else {
        alert('图片已成功导出！');
      }
    } catch (error) {
      console.error('导出失败:', error);
      if ((window as any).customDialog) {
        (window as any).customDialog.alert('导出失败，请重试', '导出失败');
      } else {
        alert('导出失败，请重试');
      }
    }
  }, [excalidrawAPI]);

  // 清空画布
  const handleClear = useCallback(() => {
    if (!excalidrawAPI) return;
    
    const showConfirm = async () => {
      let result;
      if ((window as any).customDialog) {
        result = await (window as any).customDialog.confirm('确定要清空画布吗？所有内容将丢失。', '确认清空');
      } else {
        result = confirm('确定要清空画布吗？所有内容将丢失。');
      }
      
      if (result) {
        excalidrawAPI.resetScene();
      }
    };
    
    showConfirm();
  }, [excalidrawAPI]);

  return (
    <div className="excalidraw-drawer-overlay">
      <div className="excalidraw-drawer-container">
        {/* 顶部工具栏 */}
        <div className="excalidraw-toolbar">
          <div className="toolbar-left">
            <h3 className="toolbar-title">🎨 Mermaid 手绘流程图</h3>
            <span className="toolbar-hint">使用专业手绘工具创作 · 自动转换为 Mermaid 代码</span>
          </div>
          
          <div className="toolbar-right">
            <button className="toolbar-btn" onClick={() => {
              if (excalidrawAPI) {
                const elements = parseMermaidToElements(testMermaidCode);
                excalidrawAPI.updateScene({ elements });
              }
            }} title="测试连接线加载">
              <Info size={18} />
              测试
            </button>
            <button className="toolbar-btn" onClick={handleGenerateCode} title="预览代码">
              <FileCode size={18} />
              预览代码
            </button>
            <button className="toolbar-btn" onClick={handleExportPNG} title="导出PNG">
              <Download size={18} />
              导出图片
            </button>
            <button className="toolbar-btn" onClick={handleClear} title="清空画布">
              <Trash2 size={18} />
              清空
            </button>
            <button className="toolbar-btn primary" onClick={handleSave} title="保存到编辑器">
              <Save size={18} />
              保存
            </button>
            <button className="toolbar-btn close" onClick={onClose} title="关闭">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Excalidraw 画布 */}
        <div className="excalidraw-canvas">
          <Excalidraw
            excalidrawAPI={(api) => setExcalidrawAPI(api)}
            initialData={{
              appState: {
                viewBackgroundColor: '#ffffff',
                currentItemStrokeColor: '#6366f1',
                currentItemBackgroundColor: '#e0e7ff',
                currentItemFillStyle: 'solid',
                currentItemStrokeWidth: 2,
                currentItemRoughness: 1,
                gridSize: null,
              },
              elements: initialElements,
            }}
            UIOptions={{
              canvasActions: {
                changeViewBackgroundColor: true,
                clearCanvas: true,
                export: { saveFileToDisk: true },
                loadScene: false,
                saveToActiveFile: false,
                toggleTheme: true,
              },
            }}
          >
            <MainMenu>
              <MainMenu.DefaultItems.ClearCanvas />
              <MainMenu.DefaultItems.SaveAsImage />
              <MainMenu.DefaultItems.ChangeCanvasBackground />
              <MainMenu.DefaultItems.ToggleTheme />
            </MainMenu>
            <Footer>
              <div className="excalidraw-footer-hint">
                <Info size={14} />
                <span>
                  <strong>提示：</strong>
                  矩形→[文本] · 椭圆→((文本)) · 菱形→{'{'}文本{'}'} · 箭头→连接线
                </span>
              </div>
            </Footer>
          </Excalidraw>
        </div>

        {/* 代码预览模态框 */}
        {showCode && (
          <div className="code-modal-overlay" onClick={() => setShowCode(false)}>
            <div className="code-modal" onClick={(e) => e.stopPropagation()}>
              <div className="code-modal-header">
                <div>
                  <FileCode size={16} />
                  <span>Mermaid 代码预览</span>
                </div>
                <button onClick={() => setShowCode(false)}>
                  <X size={16} />
                </button>
              </div>
              <div className="code-modal-content">
                <pre>{generatedCode}</pre>
              </div>
              <div className="code-modal-footer">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    if ((window as any).customDialog) {
                      (window as any).customDialog.alert('代码已复制到剪贴板！', '复制成功');
                    } else {
                      alert('代码已复制到剪贴板！');
                    }
                    setShowCode(false);
                  }}
                  className="modal-btn primary"
                >
                  复制并关闭
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
