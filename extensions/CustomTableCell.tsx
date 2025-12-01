import TableCell from '@tiptap/extension-table-cell';

/**
 * 自定义表格单元格扩展
 * 支持背景色、文本颜色等自定义属性
 */
export const CustomTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: element => element.style.backgroundColor || null,
        renderHTML: attributes => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
      colwidth: {
        default: null,
        parseHTML: element => {
          const colwidth = element.getAttribute('colwidth');
          return colwidth ? [parseInt(colwidth, 10)] : null;
        },
        renderHTML: attributes => {
          if (!attributes.colwidth) {
            return {};
          }
          return {
            colwidth: attributes.colwidth,
            style: `width: ${attributes.colwidth}px`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      ...this.parent?.(),
      setCellAttribute: (name: string, value: any) => ({ commands }: any) => {
        return commands.updateAttributes(this.name, { [name]: value });
      },
      clearCells: () => ({ tr, state, dispatch }: any) => {
        const { selection } = state;
        const { $anchorCell } = selection as any;
        
        if (!$anchorCell) return false;
        
        const cells: any[] = [];
        selection.forEachCell((cell: any, pos: number) => {
          cells.push({ pos, cell });
        });
        
        if (cells.length === 0) return false;
        
        cells.forEach(({ pos }) => {
          const node = state.doc.nodeAt(pos);
          if (node) {
            const from = pos + 1;
            const to = pos + node.nodeSize - 1;
            tr.delete(from, to);
          }
        });
        
        if (dispatch) dispatch(tr);
        return true;
      },
    };
  },
});

export default CustomTableCell;
