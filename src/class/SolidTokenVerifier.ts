import { isNotNullOrUndefined } from "ts-guards/dist/primitive-type";
import { verifySolidAccessToken } from "../algorithm/verifySolidAccessToken";
import type { SolidAccessTokenPayload, RequestMethod } from "../type";
import { DPoPJTICache } from "./DPoPJTICache";
import { IssuerKeySetCache } from "./IssuerKeySetCache";
import { WebIDIssuersCache } from "./WebIDIssuersCache";

export class SolidTokenVerifier {
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
    return verifySolidAccessToken(
      {
        header: authorizationHeader,
        issuers: this.webIDIssuersCache.getIssuers.bind(this.webIDIssuersCache),
        keySet: this.issuerKeySetCache.getKeySet.bind(this.issuerKeySetCache),
      },
      dpopArgs
    );
  }
}
