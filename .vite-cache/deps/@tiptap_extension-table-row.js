import {
  Node,
  mergeAttributes
} from "./chunk-PCDHUFE2.js";
import "./chunk-EWFAMD4O.js";
import "./chunk-L4FL6F5P.js";
import "./chunk-LZ3HBHBL.js";
import "./chunk-DLJ4GP37.js";

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
