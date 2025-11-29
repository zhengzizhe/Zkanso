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

// node_modules/@tiptap/extension-details-summary/dist/index.js
var DetailsSummary = Node.create({
  name: "detailsSummary",
  content: "text*",
  defining: true,
  selectable: false,
  isolating: true,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "summary"
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "summary",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0
    ];
  }
});
export {
  DetailsSummary,
  DetailsSummary as default
};
//# sourceMappingURL=@tiptap_extension-details-summary.js.map
