import {
  flowRendererV2,
  flowStyles
} from "./chunk-MI2YNQN4.js";
import {
  flowDb,
  parser$1
} from "./chunk-HPIZWNOS.js";
import "./chunk-6TK36OIS.js";
import "./chunk-MOCY5GXW.js";
import "./chunk-A6ZYKXX4.js";
import "./chunk-FFZQFHZL.js";
import "./chunk-PYYARZT7.js";
import {
  require_dayjs_min,
  require_dist,
  setConfig
} from "./chunk-MGV2J3ZR.js";
import "./chunk-W2HZVVEF.js";
import {
  __toESM
} from "./chunk-2TUXWMP5.js";

// node_modules/mermaid/dist/flowDiagram-v2-4f6560a1.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_sanitize_url = __toESM(require_dist(), 1);
var diagram = {
  parser: parser$1,
  db: flowDb,
  renderer: flowRendererV2,
  styles: flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    flowRendererV2.setConf(cnf.flowchart);
    flowDb.clear();
    flowDb.setGen("gen-2");
  }
};
export {
  diagram
};
//# sourceMappingURL=flowDiagram-v2-4f6560a1-RTMWGUYP.js.map
