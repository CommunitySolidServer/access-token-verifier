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
  private DPoPJTICache: DPoPJTICache;

  private IssuerKeySetCache: IssuerKeySetCache;

  private WebIDIssuersCache: WebIDIssuersCache;

  public constructor() {
    this.DPoPJTICache = new DPoPJTICache();
    this.IssuerKeySetCache = new IssuerKeySetCache();
    this.WebIDIssuersCache = new WebIDIssuersCache();
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
      this.WebIDIssuersCache.getIssuers.bind(this.WebIDIssuersCache),
      this.IssuerKeySetCache.getKeySet.bind(this.IssuerKeySetCache),
      this.DPoPJTICache.isDuplicateJTI.bind(this.DPoPJTICache)
    );
  }
}

export function createSolidIdentityVerifier(): VerifySolidIdentityFunction {
  const cache = new SolidIdentityVerifier();
  return cache.verify.bind(cache);
}
