const loggerPino = require('pino');

const _logger = loggerPino();

function getLogger(){
    return _logger;
}


module.exports = { getLogger }

