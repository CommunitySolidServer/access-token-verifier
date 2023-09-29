import { isNotNullOrUndefined } from "ts-guards/dist/primitive-type";
import { verifySolidAccessToken } from "../algorithm/verifySolidAccessToken";
import type { SolidAccessTokenPayload, DPoPOptions } from "../type";
import { DPoPJTICache } from "./DPoPJTICache";
import { IssuerKeySetCache } from "./IssuerKeySetCache";
import { WebIDIssuersCache } from "./WebIDIssuersCache";

export class SolidTokenVerifier {
  private dpopJtiCache: DPoPJTICache;

  private issuerKeySetCache: IssuerKeySetCache;

  private webIDIssuersCache: WebIDIssuersCache;

  public constructor(
    dpopJtiCache?: DPoPJTICache,
    issuerKeySetCache?: IssuerKeySetCache,
    webIDIssuersCache?: WebIDIssuersCache
  ) {
    this.dpopJtiCache = dpopJtiCache ?? new DPoPJTICache();
    this.issuerKeySetCache = issuerKeySetCache ?? new IssuerKeySetCache();
    this.webIDIssuersCache = webIDIssuersCache ?? new WebIDIssuersCache();
  }

  public async verify(
    authorizationHeader: string,
    dpop?: DPoPOptions
  ): Promise<SolidAccessTokenPayload> {
    let dpopArgs;
    if (isNotNullOrUndefined(dpop)) {
      dpopArgs = {
        header: dpop.header,
        method: dpop.method,
        url: dpop.url,
        isDuplicateJTI: (
          dpop.isDuplicateJTI ?? this.dpopJtiCache.isDuplicateJTI
        ).bind(this.dpopJtiCache),
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
