import type {
  AccessTokenPayload,
  RequestMethod,
  VerifySolidIdentityFunction,
} from "../types";
import { DPoPJTICache } from "./DPoPJTICache";
import { IssuerKeySetCache } from "./IssuerKeySetCache";
import { verify as verifyIdentity } from "./Verify";
import { WebIDIssuersCache } from "./WebIDIssuersCache";

class SolidIdentityVerifier {
  private dpopJtiCache: DPoPJTICache;

  private issuerKeySetCache: IssuerKeySetCache;

  private webIDIssuersCache: WebIDIssuersCache;

  public constructor() {
    this.dpopJtiCache = new DPoPJTICache();
    this.issuerKeySetCache = new IssuerKeySetCache();
    this.webIDIssuersCache = new WebIDIssuersCache();
  }

  public async verify(
    authorizationHeader: string,
    dpopHeader: string,
    method: RequestMethod,
    url: string
  ): Promise<AccessTokenPayload> {
    return verifyIdentity(
      authorizationHeader,
      dpopHeader,
      method,
      url,
      this.webIDIssuersCache.getIssuers.bind(this.webIDIssuersCache),
      this.issuerKeySetCache.getKeySet.bind(this.issuerKeySetCache),
      this.dpopJtiCache.isDuplicateJTI.bind(this.dpopJtiCache)
    );
  }
}

export function createSolidIdentityVerifier(): VerifySolidIdentityFunction {
  const cache = new SolidIdentityVerifier();
  return cache.verify.bind(cache);
}
