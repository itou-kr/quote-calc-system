import { isRouteErrorResponse } from "react-router-dom";
import { isAxiosError } from "axios";

export function errorMessage(error: unknown): { status?: number; message: string } | undefined {
    if (error) {
        let status: number | undefined = undefined;
        let message: string | undefined = undefined;
        let stack: string | undefined = undefined;

        if (isAxiosError(error)) {
            const data = error.response?.data;
            if(data) {
                if ('message' in data) {
                    message = data.message;
                }
                if ('status' in data) {
                    status = data.status;
                } else {
                    status = error.status;
                }
                if (message) {
                    if (import.meta.env.DEV) {
                        stack = error.stack;
                        message = `${message}\n${stack}`;
                    }
                    return { status, message };
                }
            }   
        }
        if (isRouteErrorResponse(error)) {
            //
        }
        if (error instanceof Error) {
            message = error.message;
            if (import.meta.env.DEV) {
                stack = error.stack;
                message = `${message}\n${stack}`;
            }
            return { message };
        }
        if (typeof error === 'object' && 'message' in error) {
            return { message: `${error.message}`};
        }
        return { message: 'unexpected error' };
        }
    return undefined;
}