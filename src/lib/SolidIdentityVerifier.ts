import type {
  AccessTokenPayload,
  RequestMethod,
  VerifyIdentityFunction,
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
      this.WebIDIssuersCache.getIssuers.bind(this),
      this.IssuerKeySetCache.getKeySet.bind(this),
      this.DPoPJTICache.isDuplicateJTI.bind(this)
    );
  }
}

export function createSolidIdentityVerifier(): VerifyIdentityFunction {
  const cache = new SolidIdentityVerifier();
  return cache.verify.bind(cache);
}
