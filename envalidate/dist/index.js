"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Throw an error if a key is missing from the env
 * @param {Array<string> | string} keys The required env keys
 * @returns {null}
 */
function envalidate(keys) {
    if (!Array.isArray(keys))
        keys = [keys];
    keys.forEach(function (key) {
        if (!process.env[key])
            throw new Error("Missing env var: \"".concat(key, "\""));
        return null;
    });
}
;
exports.default = envalidate;
//# sourceMappingURL=index.js.map