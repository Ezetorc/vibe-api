class Data {
}
export class Success extends Data {
    value;
    constructor(value) {
        super();
        this.value = value;
    }
    isSuccess() {
        return true;
    }
    isFailure() {
        return false;
    }
}
export class Failure extends Data {
    error;
    constructor(error) {
        super();
        this.error = error;
    }
    isSuccess() {
        return false;
    }
    isFailure() {
        return true;
    }
}
export function dataSuccess(value) {
    return new Success(value);
}
export function dataFailure(error) {
    return new Failure(error);
}
