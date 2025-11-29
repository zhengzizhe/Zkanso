import {
  Extension
} from "./chunk-6PXAZMSB.js";
import {
  dist_exports
} from "./chunk-CQKIUDK6.js";
import "./chunk-EWFAMD4O.js";
import "./chunk-B4TIPZG3.js";
import "./chunk-7G5SGB4X.js";
import {
  Fragment,
  NodeSelection,
  Plugin,
  PluginKey,
  Slice,
  TextSelection
} from "./chunk-WZRAXKK4.js";
import "./chunk-2TUXWMP5.js";

// node_modules/tiptap-extension-global-drag-handle/dist/index.js
function getPmView() {
  try {
    return dist_exports;
  } catch (error) {
    return null;
  }
}
function serializeForClipboard(view, slice) {
  if (view && typeof view.serializeForClipboard === "function") {
    return view.serializeForClipboard(slice);
  }
  const proseMirrorView = getPmView();
  if (proseMirrorView && typeof (proseMirrorView == null ? void 0 : proseMirrorView.__serializeForClipboard) === "function") {
    return proseMirrorView.__serializeForClipboard(view, slice);
  }
  throw new Error("No supported clipboard serialization method found.");
}
function absoluteRect(node) {
  const data = node.getBoundingClientRect();
  const modal = node.closest('[role="dialog"]');
  if (modal && window.getComputedStyle(modal).transform !== "none") {
    const modalRect = modal.getBoundingClientRect();
    return {
      top: data.top - modalRect.top,
      left: data.left - modalRect.left,
      width: data.width
    };
  }
  return {
    top: data.top,
    left: data.left,
    width: data.width
  };
}
function nodeDOMAtCoords(coords, options) {
  const selectors = [
    "li",
    "p:not(:first-child)",
    "pre",
    "blockquote",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    ...options.customNodes.map((node) => `[data-type=${node}]`)
  ].join(", ");
  return document.elementsFromPoint(coords.x, coords.y).find((elem) => {
    var _a, _b;
    return ((_b = (_a = elem.parentElement) == null ? void 0 : _a.matches) == null ? void 0 : _b.call(_a, ".ProseMirror")) || elem.matches(selectors);
  });
}
function nodePosAtDOM(node, view, options) {
  var _a;
  const boundingRect = node.getBoundingClientRect();
  return (_a = view.posAtCoords({
    left: boundingRect.left + 50 + options.dragHandleWidth,
    top: boundingRect.top + 1
  })) == null ? void 0 : _a.inside;
}
function calcNodePos(pos, view) {
  const $pos = view.state.doc.resolve(pos);
  if ($pos.depth > 1)
    return $pos.before($pos.depth);
  return pos;
}
function DragHandlePlugin(options) {
  let listType = "";
  function handleDragStart(event, view) {
    view.focus();
    if (!event.dataTransfer)
      return;
    const node = nodeDOMAtCoords({
      x: event.clientX + 50 + options.dragHandleWidth,
      y: event.clientY
    }, options);
    if (!(node instanceof Element))
      return;
    let draggedNodePos = nodePosAtDOM(node, view, options);
    if (draggedNodePos == null || draggedNodePos < 0)
      return;
    draggedNodePos = calcNodePos(draggedNodePos, view);
    const { from, to } = view.state.selection;
    const diff = from - to;
    const fromSelectionPos = calcNodePos(from, view);
    let differentNodeSelected = false;
    const nodePos = view.state.doc.resolve(fromSelectionPos);
    if (nodePos.node().type.name === "doc")
      differentNodeSelected = true;
    else {
      const nodeSelection = NodeSelection.create(view.state.doc, nodePos.before());
      differentNodeSelected = !(draggedNodePos + 1 >= nodeSelection.$from.pos && draggedNodePos <= nodeSelection.$to.pos);
    }
    let selection = view.state.selection;
    if (!differentNodeSelected && diff !== 0 && !(view.state.selection instanceof NodeSelection)) {
      const endSelection = NodeSelection.create(view.state.doc, to - 1);
      selection = TextSelection.create(view.state.doc, draggedNodePos, endSelection.$to.pos);
    } else {
      selection = NodeSelection.create(view.state.doc, draggedNodePos);
      if (selection.node.type.isInline || selection.node.type.name === "tableRow") {
        let $pos = view.state.doc.resolve(selection.from);
        selection = NodeSelection.create(view.state.doc, $pos.before());
      }
    }
    view.dispatch(view.state.tr.setSelection(selection));
    if (view.state.selection instanceof NodeSelection && view.state.selection.node.type.name === "listItem") {
      listType = node.parentElement.tagName;
    }
    const slice = view.state.selection.content();
    const { dom, text } = serializeForClipboard(view, slice);
    event.dataTransfer.clearData();
    event.dataTransfer.setData("text/html", dom.innerHTML);
    event.dataTransfer.setData("text/plain", text);
    event.dataTransfer.effectAllowed = "copyMove";
    event.dataTransfer.setDragImage(node, 0, 0);
    view.dragging = { slice, move: event.ctrlKey };
  }
  let dragHandleElement = null;
  function hideDragHandle() {
    if (dragHandleElement) {
      dragHandleElement.classList.add("hide");
    }
  }
  function showDragHandle() {
    if (dragHandleElement) {
      dragHandleElement.classList.remove("hide");
    }
  }
  function hideHandleOnEditorOut(event) {
    if (event.target instanceof Element) {
      const relatedTarget = event.relatedTarget;
      const isInsideEditor = (relatedTarget == null ? void 0 : relatedTarget.classList.contains("tiptap")) || (relatedTarget == null ? void 0 : relatedTarget.classList.contains("drag-handle"));
      if (isInsideEditor)
        return;
    }
    hideDragHandle();
  }
  return new Plugin({
    key: new PluginKey(options.pluginKey),
    view: (view) => {
      var _a, _b, _c, _d;
      const handleBySelector = options.dragHandleSelector ? document.querySelector(options.dragHandleSelector) : null;
      dragHandleElement = handleBySelector ?? document.createElement("div");
      dragHandleElement.draggable = true;
      dragHandleElement.dataset.dragHandle = "";
      dragHandleElement.classList.add("drag-handle");
      function onDragHandleDragStart(e) {
        handleDragStart(e, view);
      }
      dragHandleElement.addEventListener("dragstart", onDragHandleDragStart);
      function onDragHandleDrag(e) {
        hideDragHandle();
        let scrollY = window.scrollY;
        if (e.clientY < options.scrollTreshold) {
          window.scrollTo({ top: scrollY - 30, behavior: "smooth" });
        } else if (window.innerHeight - e.clientY < options.scrollTreshold) {
          window.scrollTo({ top: scrollY + 30, behavior: "smooth" });
        }
      }
      dragHandleElement.addEventListener("drag", onDragHandleDrag);
      hideDragHandle();
      if (!handleBySelector) {
        (_b = (_a = view == null ? void 0 : view.dom) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.appendChild(dragHandleElement);
      }
      (_d = (_c = view == null ? void 0 : view.dom) == null ? void 0 : _c.parentElement) == null ? void 0 : _d.addEventListener("mouseout", hideHandleOnEditorOut);
      return {
        destroy: () => {
          var _a2, _b2, _c2;
          if (!handleBySelector) {
            (_a2 = dragHandleElement == null ? void 0 : dragHandleElement.remove) == null ? void 0 : _a2.call(dragHandleElement);
          }
          dragHandleElement == null ? void 0 : dragHandleElement.removeEventListener("drag", onDragHandleDrag);
          dragHandleElement == null ? void 0 : dragHandleElement.removeEventListener("dragstart", onDragHandleDragStart);
          dragHandleElement = null;
          (_c2 = (_b2 = view == null ? void 0 : view.dom) == null ? void 0 : _b2.parentElement) == null ? void 0 : _c2.removeEventListener("mouseout", hideHandleOnEditorOut);
        }
      };
    },
    props: {
      handleDOMEvents: {
        mousemove: (view, event) => {
          if (!view.editable) {
            return;
          }
          const node = nodeDOMAtCoords({
            x: event.clientX + 50 + options.dragHandleWidth,
            y: event.clientY
          }, options);
          const notDragging = node == null ? void 0 : node.closest(".not-draggable");
          const excludedTagList = options.excludedTags.concat(["ol", "ul"]).join(", ");
          if (!(node instanceof Element) || node.matches(excludedTagList) || notDragging) {
            hideDragHandle();
            return;
          }
          const compStyle = window.getComputedStyle(node);
          const parsedLineHeight = parseInt(compStyle.lineHeight, 10);
          const lineHeight = isNaN(parsedLineHeight) ? parseInt(compStyle.fontSize) * 1.2 : parsedLineHeight;
          const paddingTop = parseInt(compStyle.paddingTop, 10);
          const rect = absoluteRect(node);
          rect.top += (lineHeight - 24) / 2;
          rect.top += paddingTop;
          if (node.matches("ul:not([data-type=taskList]) li, ol li")) {
            rect.left -= options.dragHandleWidth;
          }
          rect.width = options.dragHandleWidth;
          if (!dragHandleElement)
            return;
          dragHandleElement.style.left = `${rect.left - rect.width}px`;
          dragHandleElement.style.top = `${rect.top}px`;
          showDragHandle();
        },
        keydown: () => {
          hideDragHandle();
        },
        mousewheel: () => {
          hideDragHandle();
        },
        // dragging class is used for CSS
        dragstart: (view) => {
          view.dom.classList.add("dragging");
        },
        drop: (view, event) => {
          var _a;
          view.dom.classList.remove("dragging");
          hideDragHandle();
          let droppedNode = null;
          const dropPos = view.posAtCoords({
            left: event.clientX,
            top: event.clientY
          });
          if (!dropPos)
            return;
          if (view.state.selection instanceof NodeSelection) {
            droppedNode = view.state.selection.node;
          }
          if (!droppedNode)
            return;
          const resolvedPos = view.state.doc.resolve(dropPos.pos);
          const isDroppedInsideList = resolvedPos.parent.type.name === "listItem";
          if (view.state.selection instanceof NodeSelection && view.state.selection.node.type.name === "listItem" && !isDroppedInsideList && listType == "OL") {
            const newList = (_a = view.state.schema.nodes.orderedList) == null ? void 0 : _a.createAndFill(null, droppedNode);
            const slice = new Slice(Fragment.from(newList), 0, 0);
            view.dragging = { slice, move: event.ctrlKey };
          }
        },
        dragend: (view) => {
          view.dom.classList.remove("dragging");
        }
      }
    }
  });
}
var GlobalDragHandle = Extension.create({
  name: "globalDragHandle",
  addOptions() {
    return {
      dragHandleWidth: 20,
      scrollTreshold: 100,
      excludedTags: [],
      customNodes: []
    };
  },
  addProseMirrorPlugins() {
    return [
      DragHandlePlugin({
        pluginKey: "globalDragHandle",
        dragHandleWidth: this.options.dragHandleWidth,
        scrollTreshold: this.options.scrollTreshold,
        dragHandleSelector: this.options.dragHandleSelector,
        excludedTags: this.options.excludedTags,
        customNodes: this.options.customNodes
      })
    ];
  }
});
export {
  DragHandlePlugin,
  GlobalDragHandle as default
};
//# sourceMappingURL=tiptap-extension-global-drag-handle.js.map
