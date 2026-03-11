// import { StringSchema, NumberSchema, ObjectSchema, MixedSchema } from "yup";

import { NumberSchema, ObjectSchema } from 'yup';

declare module 'yup' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface NumberSchema {
        rangeCheck(minField: number, maxField: number): this;
    }
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    // export interface StringSchema {
    //     dataPairCheckName(): this;
    // }
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    export interface ObjectSchema {
        dataPairCheck(): this;
        transactionPairCheck(): this;
    }
}