import { DPoPError } from './DPoPError'

/**
 * Generic Error class for everything DPoP
 */
export class InvalidSolidDPoPAcccessToken extends DPoPError {
  /**
   * Creates a new HTTP error. Subclasses should call this with their fixed status code.
   * @param name - Error name. Useful for logging and stack tracing.
   * @param message - Message to be thrown.
   */
  public constructor(message?: string) {
    super('InvalidSolidDPoPAcccessToken', `Invalid Solid DPoP Access Token ${message}`);
  }
}
