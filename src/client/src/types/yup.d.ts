// import { StringSchema, NumberSchema, ObjectSchema, MixedSchema } from "yup";

import { NumberSchema } from 'yup';

declare module 'yup' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface NumberSchema {
        rangeCheck(minField: number, maxField: number): this;
    }
}