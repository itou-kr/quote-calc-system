import * as OpenApiValidator from 'express-openapi-validator';
import * as path from 'path';
import { RootLogger } from '@quote-calc-system/commons/logger';
import operationHandlerResolver from '@quote-calc-system/commons/operationHandlerResolver';

const OPENAPI_SPEC = process.env.OPENAPI_SPEC || path.join(__dirname, '../../openapi/openapi.yml');

export function middleware(logger: RootLogger) {
    return OpenApiValidator.middleware({
        apiSpec: OPENAPI_SPEC,
        validateRequests: true,
        validateResponses: {
            onError: (error, body) => {
                // エラーレスポンスの場合は無視
                // （各 API のレスポンス定義にエラーレスポンスを定義していない
                //   バリデーションエラーになってしまうため）
                if ('status' in body && 'message' in body) {
                    return;
                }
                // エラーレスポンス以外のバリデーションエラーは そのままスロー
                throw error;
            },
        },
        operationHandlers: {
            basePath: '-',
            resolver: operationHandlerResolver(logger),
        },
        serDes: [
            OpenApiValidator.serdes.date,
            OpenApiValidator.serdes.dateTime,
            {
                format: 'byte',
                serialize: (b) => (b instanceof Buffer ? b.toString('base64') : ''),
                deserialize: (s) => Buffer.from(s, 'base64'),
            },
        ],
    })
}