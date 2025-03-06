import { DataError } from './DataError';
import { DataSuccess } from './DataSuccess';
import { DataValue } from './DataValue';
export declare class Data<T> {
    value: DataValue<T>;
    error: DataError;
    success: DataSuccess;
    constructor(error: DataError, success: DataSuccess, value: DataValue<T>);
    static failure(error: DataError): Data<null>;
    static success<T>(value: DataValue<T>): Data<T>;
}
