import { Response, NextFunction } from 'express';
import { OpenApiRequest, OpenAPIV3 } from 'express-openapi-validator/dist/framework/types';
import { HttpError } from 'http-errors';
import { RootLogger } from './logger';

function sendResponse(response: Response, payload: { code?: number; payload?: unknown }) {
    response.status(payload.code || 200);
    const responsePayload = payload.payload !== undefined ? payload.payload : payload;
    if (responsePayload instanceof Object) {
        response.json(responsePayload);
    } else {
        response.end(responsePayload);
    }
}

function getRequestBpdyName(request: OpenApiRequest) {
    if (request.openapi === undefined) return 'body';

    if('x-codegen-request-body-name' in request.openapi.schema) {
        const codegenRequestBodyName = request.openapi.schema['x-codegen-request-body-name'];
        if (typeof codegenRequestBodyName === 'string') {
            return codegenRequestBodyName;
        }
    }

    if('operationId' in request.openapi.schema) {
        const { operationId } = request.openapi.schema;
        if (operationId) {
            return `${operationId}Request`;
        }
    }

    return 'body';
}

function collectRequestParams(request: OpenApiRequest) {
    const requestParams: { [key: string]: unknown } = {};

    if (request.openapi === null || request.openapi === undefined) return requestParams;

    if (isRequestBodyObject(request.openapi.schema.requestBody)) {
        const { content } = request.openapi.schema.requestBody;
        if (content['application/json'] !== undefined) {
            const requestBodyName = getRequestBpdyName(request);
            requestParams[requestBodyName] = request.body;
        }
    }

    request.openapi.schema.parameters?.forEach((param) => {
        if (isParameterObject(param)) {
            if (param.in === 'path') {
                requestParams[param.name] = request.openapi?.pathParams[param.name];
            } else if (param.in === 'query') {
                requestParams[param.name] = request.query[param.name];
            } else if (param.in === 'header') {
                requestParams[param.name] = request.headers[param.name];
            }
        }
    });

    return requestParams;
}

function isParameterObject(value: unknown): value is OpenAPIV3.ParameterObject {
    if (value === null) return false;
    if (typeof value !== 'object') return false;

    if(!('name' in value) || typeof value.name !== 'string') return false;
    if(!('in' in value) || typeof value.name !== 'string') return false;

    return true;
}

function isRequestBodyObject(value: unknown): value is OpenAPIV3.RequestBodyObject {
    if (value === null) return false;
    if (typeof value !== 'object') return false;
    if(!('content' in value) || typeof value.content !== 'object') return false;
    return true;
}

export async function handleRequest(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    api: Function,
    rootLogger: RootLogger,
    request: OpenApiRequest,
    response: Response,
    next: NextFunction
) {
    let moduleName;
    let functionName;

    const logger = rootLogger.createChild(`${request.method} ${request.openapi?.openApiRoute || 'UNKNOWN'}`);

    try {
        moduleName = `${request.openapi?.schema?.tags?.[0]}Api`;
        functionName = api.name;

        const params = collectRequestParams(request);

        logger.info('START: %s#%s %O', moduleName, functionName, params);

        const start = Date.now();
        const result = Object.keys(params).length === 0 ? await api() : await api(params);
        const end = Date.now();

        logger.info('END: %s#%s (%ds)', moduleName, functionName, (end - start) / 1000.0);

        sendResponse(response, result);
    } catch (e) {
        if(e instanceof Error) {
            if (e instanceof HttpError && e.status < 500) {
                logger.error('ERROR: %s#%s - %s', moduleName, functionName, e.message);
            } else {
                logger.error(`${e}`, 'ERROR: %s#%s - %s', moduleName, functionName, e.message);
            }
        }

        next(e);
    }
}