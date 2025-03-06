export class Data {
    value;
    error;
    success;
    constructor(error, success, value) {
        this.value = value;
        this.error = error;
        this.success = success;
    }
    static failure(error) {
        return new Data(error, false, null);
    }
    static success(value) {
        return new Data(null, true, value);
    }
}
