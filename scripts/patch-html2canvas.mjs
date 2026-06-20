/**
 * Patches html2canvas v1.x to support modern CSS color functions
 * (lab, oklch, lch, color) that Tailwind CSS v4 uses.
 *
 * html2canvas only supports rgb/rgba/hsl/hsla. This patch:
 * 1. Adds a canvas-based fallback resolver for unsupported color functions
 * 2. Wraps getComputedStyle in ElementContainer to intercept lab/oklch values
 *
 * Run automatically via `postinstall` in package.json.
 */

import { readFileSync, writeFileSync } from "fs"
import { resolve } from "path"

const filePath = resolve("node_modules/html2canvas/dist/html2canvas.esm.js")

let content
try {
  content = readFileSync(filePath, "utf8")
} catch {
  console.warn("[patch-html2canvas] html2canvas not found, skipping.")
  process.exit(0)
}

// Skip if already patched
if (content.includes("resolveUnsupportedColor") && content.includes("resolveViaCanvas")) {
  console.log("[patch-html2canvas] Already patched, skipping.")
  process.exit(0)
}

let patched = content

// ── Patch 1: Inject canvas-based color resolver before SUPPORTED_COLOR_FUNCTIONS ──
const RESOLVER_FN = `var resolveUnsupportedColor = function(_ctx, _args, colorStr) { try { var c = document.createElement("canvas"); c.width = c.height = 1; var x = c.getContext("2d"); x.fillStyle = colorStr; x.fillRect(0,0,1,1); var d = x.getImageData(0,0,1,1).data; return pack(d[0],d[1],d[2],d[3]/255); } catch(e) { return pack(0,0,0,1); } };
var SUPPORTED_COLOR_FUNCTIONS = {`

patched = patched.replace(
  "var SUPPORTED_COLOR_FUNCTIONS = {",
  RESOLVER_FN
)

// ── Patch 2: Replace throw for unsupported color functions with fallback ──
patched = patched.replace(
  `            if (typeof colorFunction === 'undefined') {
                throw new Error("Attempting to parse an unsupported color function \\"" + value.name + "\\"");
            }`,
  `            if (typeof colorFunction === 'undefined') {
                return resolveUnsupportedColor(context, value.values, value.name);
            }`
)

// ── Patch 3: Wrap getComputedStyle in ElementContainer with Proxy ──
const OLD_COMPUTED = `this.styles = new CSSParsedDeclaration(context, window.getComputedStyle(element, null));`
const NEW_COMPUTED = `this.styles = new CSSParsedDeclaration(context, (function(el) {
            var cs = window.getComputedStyle(el, null);
            var UNSUPPORTED_RE = /\\b(lab|oklch|lch|color)\\s*\\(/i;
            var COLOR_PROPS = ['color','background-color','border-color','border-top-color','border-right-color','border-bottom-color','border-left-color','outline-color','text-decoration-color','fill','stroke'];
            var resolveViaCanvas = function(val) {
                try { var cv = document.createElement('canvas'); cv.width = cv.height = 1; var ctx = cv.getContext('2d'); ctx.fillStyle = val; ctx.fillRect(0,0,1,1); var d = ctx.getImageData(0,0,1,1).data; return 'rgb(' + d[0] + ',' + d[1] + ',' + d[2] + ')'; } catch(e) { return 'rgb(0,0,0)'; }
            };
            return new Proxy(cs, {
                get: function(t, p) {
                    var v = t[p];
                    if (typeof v === 'function') {
                        if (p === 'getPropertyValue') {
                            return function(name) {
                                var raw = t.getPropertyValue(name);
                                if (COLOR_PROPS.indexOf(name) !== -1 && UNSUPPORTED_RE.test(raw)) return resolveViaCanvas(raw);
                                return raw;
                            };
                        }
                        return v.bind(t);
                    }
                    if (typeof p === 'string' && typeof v === 'string' && UNSUPPORTED_RE.test(v)) {
                        var cssProp = p.replace(/([A-Z])/g, '-$1').toLowerCase();
                        if (COLOR_PROPS.indexOf(cssProp) !== -1) return resolveViaCanvas(v);
                    }
                    return v;
                }
            });
        })(element));`

patched = patched.replace(OLD_COMPUTED, NEW_COMPUTED)

if (patched === content) {
  console.warn("[patch-html2canvas] No changes applied — html2canvas source may have changed.")
  process.exit(0)
}

writeFileSync(filePath, patched, "utf8")
console.log("[patch-html2canvas] Patched html2canvas successfully.")
