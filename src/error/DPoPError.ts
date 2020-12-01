/**
 * Generic Error class for everything DPoP
 */
export class DPoPError extends Error {
  // HTTP unauthorized client error status
  public statusCode: number = 401;

  /**
   * Creates a new HTTP error. Subclasses should call this with their fixed status code.
   * @param name - Error name. Useful for logging and stack tracing.
   * @param message - Message to be thrown.
   */
  public constructor(name: string, message?: string) {
    super(message);
    this.name = name;
  }
}
