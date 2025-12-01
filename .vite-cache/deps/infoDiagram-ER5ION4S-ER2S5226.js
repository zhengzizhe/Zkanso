import {
  parse
} from "./chunk-RIPGF73Q.js";
import "./chunk-CYUO7GWN.js";
import "./chunk-OQCCQT7U.js";
import "./chunk-HOS56SPM.js";
import "./chunk-KXRUHASG.js";
import "./chunk-EKFBIVSV.js";
import "./chunk-J3A6DYJU.js";
import "./chunk-E5OSKWNT.js";
import "./chunk-2SDB3624.js";
import "./chunk-QIRGA75Z.js";
import {
  package_default
} from "./chunk-AG2D4KHT.js";
import {
  selectSvgElement
} from "./chunk-FTNFDTMQ.js";
import "./chunk-MJJOFYPD.js";
import {
  configureSvgSize
} from "./chunk-DX77NYPT.js";
import "./chunk-RR4LMUAQ.js";
import "./chunk-HAA2HLZB.js";
import {
  __name,
  log
} from "./chunk-47FK2BYT.js";
import "./chunk-4WIEDHM3.js";
import "./chunk-DLJ4GP37.js";

// node_modules/mermaid/dist/chunks/mermaid.core/infoDiagram-ER5ION4S.mjs
var parser = {
  parse: __name(async (input) => {
    const ast = await parse("info", input);
    log.debug(ast);
  }, "parse")
};
var DEFAULT_INFO_DB = {
  version: package_default.version + (true ? "" : "-tiny")
};
var getVersion = __name(() => DEFAULT_INFO_DB.version, "getVersion");
var db = {
  getVersion
};
var draw = __name((text, id, version) => {
  log.debug("rendering info diagram\n" + text);
  const svg = selectSvgElement(id);
  configureSvgSize(svg, 100, 400, true);
  const group = svg.append("g");
  group.append("text").attr("x", 100).attr("y", 40).attr("class", "version").attr("font-size", 32).style("text-anchor", "middle").text(`v${version}`);
}, "draw");
var renderer = { draw };
var diagram = {
  parser,
  db,
  renderer
};
export {
  diagram
};
//# sourceMappingURL=infoDiagram-ER5ION4S-ER2S5226.js.map
