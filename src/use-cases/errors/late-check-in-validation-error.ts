export class LateCheckInValidationError extends Error {
  constructor() {
    super('The check-in can only validate until 20 minutes of its creation.')
  }
}
