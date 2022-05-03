
/**
 * Throw an error if a key is missing from the env
 * @param {Array<string> | string} keys The required env keys
 * @returns {null}
 */
function envalidate(keys: Array<string> | string) {
  if (!Array.isArray(keys)) keys = [keys];
  keys.forEach(key => {
    if (!process.env[key]) throw new Error(`Missing env var: "${key}"`)
    return null;
  });
};

export default envalidate;
