import { Request, Response, NextFunction } from 'express';
import { OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { RouteMetadata } from 'express-openapi-validator/dist/framework/openapi.spec.loader';
import * as calcApi from '@quote-calc-system/apis/calcApi';
// import * as testApi from '@quote-calc-system/apis/testApi';
import { RootLogger } from '@quote-calc-system/commons/logger';
import { handleRequest } from './requestHandler';

type HttpMethod = 'get' | 'post' | 'put' | 'delete';

export default function operationHandlerResolver(logger: RootLogger) {
    return function resolve(
        handlerPath: string,
        route: RouteMetadata,
        apiDoc: OpenAPIV3.DocumentV3 | OpenAPIV3.DocumentV3_1
    ) {
        const paths = apiDoc.paths;
        if (!paths) {
        throw new Error(`"paths" Field Not Defined. (OpenAPI version: ${apiDoc.openapi})`);
        }

        const apiPath = route.openApiRoute.replace(/^\/api/, '');
        const apiMethod = route.method.toLowerCase() as HttpMethod;

        const apiDef = paths[apiPath]?.[apiMethod];
        if (!apiDef) {
        throw new Error(`API Definition NotFound. (${apiMethod.toUpperCase()} ${apiPath})`);
        }

        const tag = apiDef.tags?.[0];
        if (!tag) throw new Error(`"tags" Field Not Defined. (${apiMethod.toUpperCase()} ${apiPath})`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let handlers: Record<string, any>;

        try {
        if (tag === 'calc') handlers = calcApi;
        // else if (tag === 'test') handlers = testApi;
        else throw new Error(`Module Not Found for tag: ${tag}`);
        } catch (e) {
        if (e instanceof Error) logger.error(`${e}`, e.message);
        throw new Error(`Module Not Found. (tag: ${tag})`);
        }

        const handlerName = apiDef.operationId as keyof typeof handlers;
        if (!handlerName) throw new Error(`"operationId" Field Not Defined. (${apiMethod.toUpperCase()} ${apiPath})`);

        const handler = handlers[handlerName];
        if (!handler) throw new Error(`Function Not Found. (${handlerName})`);

        return async (req: Request, res: Response, next: NextFunction) => {
        handleRequest(handler, logger, req, res, next);
        };
    };
}



// export default function operationHandlerResolver(logger: RootLogger) {
//     return function resolve(handlerPath: string, route: RouteMetadata, apiDoc: OpenAPIV3.DocumentV3 | OpenAPIV3.DocumentV3_1) {

//         const paths = apiDoc.paths;
//         if (!paths) {
//             throw new Error(`"paths" Field Not Defined. (OpenAPI version: ${apiDoc.openapi})`);
//         }

//         const apiPath = route.openApiRoute.replace(/^\/api/, '').replace(/\/$/, '');
//         const apiMethod = route.method.toLowerCase() as HttpMethod;

//         const apiDef = paths[apiPath]?.[apiMethod];
//         if (!apiDef) {
//             throw new Error(`API Definition NotFound. (${apiMethod.toUpperCase()} ${apiPath})`);
//         }
//         const tag = apiDef.tags?.[0];

//         if (tag === undefined) throw new Error(`"tags" Field Not Defined. (${apiMethod.toUpperCase()} ${apiPath})`);

//         const modulePath = `../apis/${tag.charAt(0).toLowerCase()}${tag.slice(1)}Api`;

//         const moduleName = `${tag}Api` as keyof typeof calcApi;

//         try {
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             let handlers: Record<string, any>;
//             if (tag === 'calc') handlers = calcApi;
//             else if (tag === 'test') handlers = testApi;
//             else throw new Error(`Module Not Found for tag: ${tag}`);

//             if (!handlers) throw new Error(`Module Not Found. (${moduleName})`);
//         } catch (e) {
//             if (e instanceof Error) logger.error(`${e}`, e.message);
//             throw new Error(`Module Not Found. (${modulePath})`);
//         }

//         if (handlers === undefined) throw new Error(`Module Not Found. (${moduleName})`);

//         const handlerName = apiDef.operationId as keyof typeof handlers;
//         if (handlerName === undefined)
//             throw new Error(`"operationId" Field Not Defined. (${apiMethod.toUpperCase()} ${apiPath})`);

//         const handler = handlers[handlerName];
//         if (!handler) throw new Error(`Function Not Found. (${handlerName})`);
//         if (handler === undefined) throw new Error(`Function Not Found. (${handlerName})`);

//         return async (req: Request, res: Response, next: NextFunction) => {
//             handleRequest(handler, logger, req, res, next);
//         };
//     };
// }