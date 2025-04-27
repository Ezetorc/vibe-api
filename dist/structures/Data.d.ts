import { DataError } from "./DataError";
import { DataValue } from "./DataValue";
declare abstract class Data<T> {
    abstract isSuccess(): this is Success<T>;
    abstract isFailure(): this is Failure;
}
export declare class Success<T> extends Data<T> {
    readonly value: DataValue<T>;
    constructor(value: DataValue<T>);
    isSuccess(): this is Success<T>;
    isFailure(): this is Failure;
}
export declare class Failure extends Data<never> {
    readonly error: DataError;
    constructor(error: DataError);
    isSuccess(): this is Success<never>;
    isFailure(): this is Failure;
}
export declare function dataSuccess<T>(value: DataValue<T>): Success<T>;
export declare function dataFailure(error: DataError): Failure;
export {};
