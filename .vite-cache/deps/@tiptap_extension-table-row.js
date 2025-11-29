import {
  Node,
  mergeAttributes
} from "./chunk-6PXAZMSB.js";
import "./chunk-CQKIUDK6.js";
import "./chunk-EWFAMD4O.js";
import "./chunk-B4TIPZG3.js";
import "./chunk-7G5SGB4X.js";
import "./chunk-WZRAXKK4.js";
import "./chunk-2TUXWMP5.js";

// node_modules/@tiptap/extension-table-row/dist/index.js
var TableRow = Node.create({
  name: "tableRow",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  content: "(tableCell | tableHeader)*",
  tableRole: "row",
  parseHTML() {
    return [
      { tag: "tr" }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["tr", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  }
});
export {
  TableRow,
  TableRow as default
};
//# sourceMappingURL=@tiptap_extension-table-row.js.map
