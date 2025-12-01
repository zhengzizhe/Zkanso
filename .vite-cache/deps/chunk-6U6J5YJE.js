import {
  __commonJS
} from "./chunk-DLJ4GP37.js";

// node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/erb.js
var require_erb = __commonJS({
  "node_modules/react-syntax-highlighter/node_modules/highlight.js/lib/languages/erb.js"(exports, module) {
    function erb(hljs) {
      return {
        name: "ERB",
        subLanguage: "xml",
        contains: [
          hljs.COMMENT("<%#", "%>"),
          {
            begin: "<%[%=-]?",
            end: "[%-]?%>",
            subLanguage: "ruby",
            excludeBegin: true,
            excludeEnd: true
          }
        ]
      };
    }
    module.exports = erb;
  }
});

export {
  require_erb
};
//# sourceMappingURL=chunk-6U6J5YJE.js.map
