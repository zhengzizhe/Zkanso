import {
  flowRendererV2,
  flowStyles
} from "./chunk-LYYO3E4P.js";
import {
  flowDb,
  parser$1
} from "./chunk-JYUZG4HS.js";
import "./chunk-GTUTBQPD.js";
import "./chunk-6PMEAMZU.js";
import "./chunk-YIUSZOKA.js";
import "./chunk-JN4UOB5T.js";
import "./chunk-JRPAQZTN.js";
import {
  require_dist,
  setConfig
} from "./chunk-4SC4TNIR.js";
import "./chunk-QIRGA75Z.js";
import "./chunk-GI4O4QL5.js";
import "./chunk-HZBED25T.js";
import "./chunk-MJJOFYPD.js";
import "./chunk-RR4LMUAQ.js";
import "./chunk-HAA2HLZB.js";
import {
  require_dayjs_min
} from "./chunk-4WIEDHM3.js";
import "./chunk-I5MJUUMA.js";
import {
  __toESM
} from "./chunk-DLJ4GP37.js";

// node_modules/@excalidraw/mermaid-to-excalidraw/node_modules/mermaid/dist/flowDiagram-v2-96b9c2cf.js
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
//# sourceMappingURL=flowDiagram-v2-96b9c2cf-FMUNPKKW.js.map
