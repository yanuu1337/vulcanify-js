const messages = new Map();
const kCode = Symbol("code");

// This piece was heavily inspired by node's `internal/errors` + `Discord.JS` modules

/**
 * Extend any lib-related error into a form of VulcanifyError
 * @param {Error} Base
 * @returns {VulcanifyError}
 */
function makeVulcanifyError(Base) {
  return class VulcanifyError extends Base {
    constructor(key, ...args) {
      super(formatMessage(key, args));
      this[kCode] = key;
      if (Error.captureStackTrace)
        Error.captureStackTrace(this, VulcanifyError);
    }
    get name() {
      return `${super.name} [${this[kCode]}]`;
    }

    get code() {
      return this[kCode];
    }
  };
}

/**
 *
 * @param {string} key The error key
 * @param {Array<*>} args Optional Arguments to format the error
 * @returns {string} The error message string
 */
function formatMessage(key, args) {
  if (typeof key !== "string")
    throw new Error(
      `Error key must be of type \`string\`, received ${typeof key} instead.`
    );
  const message = messages.get(key);
  if (!message)
    throw new Error(
      `There is no error message value with the key of \`${key}\`!`
    );
  if (typeof message === "function") return message(...args);
  if (!args?.length) return message;
  args.unshift(message);
  return String(...args);
}

/**
 * Register an error code and message.
 * @param {string} sym Unique name for the error
 * @param {*} val Value of the error
 */
function register(sym, val) {
  messages.set(sym, typeof val === "function" ? val : String(val));
}

module.exports = {
  register,
  Error: makeVulcanifyError(Error),
  TypeError: makeVulcanifyError(TypeError),
  RangeError: makeVulcanifyError(RangeError),
};
