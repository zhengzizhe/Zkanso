import {
  Commands,
  subsetToBinary
} from "./chunk-CU3WREAY.js";
import "./chunk-MIOPU5SF.js";
import "./chunk-V7CHMSI4.js";
import "./chunk-DLJ4GP37.js";

// node_modules/@excalidraw/excalidraw/dist/dev/subset-worker.chunk.js
var WorkerUrl = import.meta.url ? new URL(import.meta.url) : void 0;
if (typeof window === "undefined" && typeof self !== "undefined") {
  self.onmessage = async (e) => {
    switch (e.data.command) {
      case Commands.Subset:
        const buffer = await subsetToBinary(
          e.data.arrayBuffer,
          e.data.codePoints
        );
        self.postMessage(buffer, { transfer: [buffer] });
        break;
    }
  };
}
export {
  WorkerUrl
};
//# sourceMappingURL=subset-worker.chunk-SJZRSI3I.js.map
