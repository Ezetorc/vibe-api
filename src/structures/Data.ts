import { DataError } from "./DataError"
import { DataValue } from "./DataValue"

abstract class Data<T> {
  abstract isSuccess(): this is Success<T>
  abstract isFailure(): this is Failure
}

export class Success<T> extends Data<T> {
  constructor(public readonly value: DataValue<T>) {
    super()
  }

  isSuccess(): this is Success<T> {
    return true
  }

  isFailure(): this is Failure {
    return false
  }
}

export class Failure extends Data<never> {
  constructor(public readonly error: DataError) {
    super()
  }

  isSuccess(): this is Success<never> {
    return false
  }

  isFailure(): this is Failure {
    return true
  }
}

export function dataSuccess<T>(value: DataValue<T>): Success<T> {
  return new Success(value)
}

export function dataFailure(error: DataError): Failure {
  return new Failure(error)
}
