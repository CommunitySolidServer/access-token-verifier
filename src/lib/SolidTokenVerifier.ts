import { isNotNullOrUndefined } from "ts-guards/dist/primitive-type";
import type {
  SolidAccessTokenPayload,
  RequestMethod,
  SolidTokenVerifierFunction,
} from "../types";
import { DPoPJTICache } from "./DPoPJTICache";
import { IssuerKeySetCache } from "./IssuerKeySetCache";
import { verify as verifyToken } from "./Verify";
import { WebIDIssuersCache } from "./WebIDIssuersCache";

class SolidTokenVerifier {
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
    dpop?: { header: string; method: RequestMethod; url: string }
  ): Promise<SolidAccessTokenPayload> {
    let dpopArgs;
    if (isNotNullOrUndefined(dpop)) {
      dpopArgs = {
        header: dpop.header,
        method: dpop.method,
        url: dpop.url,
        isDuplicateJTI: this.dpopJtiCache.isDuplicateJTI.bind(
          this.dpopJtiCache
        ),
      };
    }
    return verifyToken(
      {
        header: authorizationHeader,
        issuers: this.webIDIssuersCache.getIssuers.bind(this.webIDIssuersCache),
        keySet: this.issuerKeySetCache.getKeySet.bind(this.issuerKeySetCache),
      },
      dpopArgs
    );
  }
}

export function createSolidTokenVerifier(): SolidTokenVerifierFunction {
  const cache = new SolidTokenVerifier();
  return cache.verify.bind(cache);
}
