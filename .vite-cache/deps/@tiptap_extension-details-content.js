import {
  Node,
  defaultBlockAt,
  findParentNode,
  mergeAttributes
} from "./chunk-6PXAZMSB.js";
import "./chunk-CQKIUDK6.js";
import "./chunk-EWFAMD4O.js";
import "./chunk-B4TIPZG3.js";
import "./chunk-7G5SGB4X.js";
import {
  Selection
} from "./chunk-WZRAXKK4.js";
import "./chunk-2TUXWMP5.js";

// node_modules/@tiptap/extension-details-content/dist/index.js
var DetailsContent = Node.create({
  name: "detailsContent",
  content: "block+",
  defining: true,
  selectable: false,
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: `div[data-type="${this.name}"]`
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, { "data-type": this.name }),
      0
    ];
  },
  addNodeView() {
    return ({ HTMLAttributes }) => {
      const dom = document.createElement("div");
      const attributes = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        "data-type": this.name,
        hidden: "hidden"
      });
      Object.entries(attributes).forEach(([key, value]) => dom.setAttribute(key, value));
      dom.addEventListener("toggleDetailsContent", () => {
        dom.toggleAttribute("hidden");
      });
      return {
        dom,
        contentDOM: dom,
        ignoreMutation(mutation) {
          if (mutation.type === "selection") {
            return false;
          }
          return !dom.contains(mutation.target) || dom === mutation.target;
        },
        update: (updatedNode) => {
          if (updatedNode.type !== this.type) {
            return false;
          }
          return true;
        }
      };
    };
  },
  addKeyboardShortcuts() {
    return {
      // Escape node on double enter
      Enter: ({ editor }) => {
        const { state, view } = editor;
        const { selection } = state;
        const { $from, empty } = selection;
        const detailsContent = findParentNode((node2) => node2.type === this.type)(selection);
        if (!empty || !detailsContent || !detailsContent.node.childCount) {
          return false;
        }
        const fromIndex = $from.index(detailsContent.depth);
        const { childCount } = detailsContent.node;
        const isAtEnd = childCount === fromIndex + 1;
        if (!isAtEnd) {
          return false;
        }
        const defaultChildType = detailsContent.node.type.contentMatch.defaultType;
        const defaultChildNode = defaultChildType === null || defaultChildType === void 0 ? void 0 : defaultChildType.createAndFill();
        if (!defaultChildNode) {
          return false;
        }
        const $childPos = state.doc.resolve(detailsContent.pos + 1);
        const lastChildIndex = childCount - 1;
        const lastChildNode = detailsContent.node.child(lastChildIndex);
        const lastChildPos = $childPos.posAtIndex(lastChildIndex, detailsContent.depth);
        const lastChildNodeIsEmpty = lastChildNode.eq(defaultChildNode);
        if (!lastChildNodeIsEmpty) {
          return false;
        }
        const above = $from.node(-3);
        if (!above) {
          return false;
        }
        const after = $from.indexAfter(-3);
        const type = defaultBlockAt(above.contentMatchAt(after));
        if (!type || !above.canReplaceWith(after, after, type)) {
          return false;
        }
        const node = type.createAndFill();
        if (!node) {
          return false;
        }
        const { tr } = state;
        const pos = $from.after(-2);
        tr.replaceWith(pos, pos, node);
        const $pos = tr.doc.resolve(pos);
        const newSelection = Selection.near($pos, 1);
        tr.setSelection(newSelection);
        const deleteFrom = lastChildPos;
        const deleteTo = lastChildPos + lastChildNode.nodeSize;
        tr.delete(deleteFrom, deleteTo);
        tr.scrollIntoView();
        view.dispatch(tr);
        return true;
      }
    };
  }
});
export {
  DetailsContent,
  DetailsContent as default
};
//# sourceMappingURL=@tiptap_extension-details-content.js.map
