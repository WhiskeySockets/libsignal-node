// vim: ts=4:sw=4:expandtab

const noopLogger = {
  info: () => console.log,
  warn: () => console.warn,
  error: () => console.error,
  debug: () => console.debug,
  trace: () => console.trace,
};

module.exports = noopLogger;
