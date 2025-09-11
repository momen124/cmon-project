"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.winstonLogger = void 0;
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize, align } = winston_1.format;
const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
exports.winstonLogger = (0, winston_1.createLogger)({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(colorize(), timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), align(), logFormat),
    transports: [new winston_1.transports.Console()],
});
//# sourceMappingURL=winston.config.js.map