import type { SolidOIDCErrorCode } from "../type/SolidOIDCError";
/**
 * Generic Error class for everything DPoP
 */
export class SolidOIDCError extends Error {
  // HTTP unauthorized client error status
  public code;

  public statusCode = 401;

  /**
   * Creates a new HTTP error. Subclasses should call this with their fixed status code.
   * @param name - Error name. Useful for logging and stack tracing.
   * @param message - Message to be thrown.
   */
  public constructor(code: SolidOIDCErrorCode, message?: string) {
    super(message);
    this.code = code;
  }
}
