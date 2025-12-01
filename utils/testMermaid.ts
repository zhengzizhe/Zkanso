// 测试 Mermaid 代码解析功能
export const testMermaidCode = `
flowchart TD
    A[开始] --> B[处理]
    B --> C[结束]
    A --|条件|--> D[分支]
    D --> C
`;

export const testComplexMermaidCode = `
flowchart TD
    A[开始] --> B(处理)
    B --> C{判断}
    C -->|是| D[结果1]
    C -->|否| E[结果2]
    D --> F[结束]
    E --> F
`;