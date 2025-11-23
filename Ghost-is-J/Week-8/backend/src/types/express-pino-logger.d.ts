import {RequestHandler} from 'express';

declare module 'express-pino-logger' {
    interface LoggerOptions {
        logger?: any;
        serializers?: any;
        level?: string;
    }

    function expressPinoLogger(options?: LoggerOptions): RequestHandler;

    export = expressPinoLogger;
}