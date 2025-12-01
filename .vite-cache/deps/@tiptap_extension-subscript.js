import {
  Mark,
  mergeAttributes
} from "./chunk-PCDHUFE2.js";
import "./chunk-EWFAMD4O.js";
import "./chunk-L4FL6F5P.js";
import "./chunk-LZ3HBHBL.js";
import "./chunk-DLJ4GP37.js";

// node_modules/@tiptap/extension-subscript/dist/index.js
var Subscript = Mark.create({
  name: "subscript",
  addOptions() {
    return {
      HTMLAttributes: {}
    };
  },
  parseHTML() {
    return [
      {
        tag: "sub"
      },
      {
        style: "vertical-align",
        getAttrs(value) {
          if (value !== "sub") {
            return false;
          }
          return null;
        }
      }
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["sub", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
  },
  addCommands() {
    return {
      setSubscript: () => ({ commands }) => {
        return commands.setMark(this.name);
      },
      toggleSubscript: () => ({ commands }) => {
        return commands.toggleMark(this.name);
      },
      unsetSubscript: () => ({ commands }) => {
        return commands.unsetMark(this.name);
      }
    };
  },
  addKeyboardShortcuts() {
    return {
      "Mod-,": () => this.editor.commands.toggleSubscript()
    };
  }
});
export {
  Subscript,
  Subscript as default
};
//# sourceMappingURL=@tiptap_extension-subscript.js.map
