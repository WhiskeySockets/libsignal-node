// vim: ts=4:sw=4:expandtab

const noopLogger = {
  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  trace: () => {},
};

module.exports = noopLogger;
