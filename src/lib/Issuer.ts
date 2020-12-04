import { fetch as crossFetch } from "cross-fetch";
import { isString } from "ts-guards/dist/primitive-type";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import { isAccessTokenPayload } from "../guard/AccessTokenGuard";
import { decode } from "./JWT";
import { SolidOIDCError } from "./SolidOIDCError";
import { oidcIssuer } from "./WebID";

/* eslint-disable @typescript-eslint/naming-convention */
const requestInit = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};
/* eslint-enable @typescript-eslint/naming-convention */

function configUrl(iss: string): string {
  const configPath = "/.well-known/openid-configuration";
  return iss.replace(/\/$/, "").concat(configPath);
}

async function config(iss: string): Promise<JSON> {
  const response = await crossFetch(configUrl(iss), requestInit);

  if (response.ok) {
    return (await response.json()) as JSON;
  }

  throw new SolidOIDCError(
    "SolidOIDCHTTPError",
    `Failed fetching OIDC issuer configuration at URL ${iss}, got HTTP status code ${response.status}`
  );
}

export async function jwksUri(accessToken: string): Promise<string> {
  const tokenPayload = decode(accessToken.split(".")[1]);

  isAccessTokenPayload(tokenPayload);

  const issuer = await oidcIssuer(tokenPayload.webid, tokenPayload.iss);

  const issuerConfig = await config(issuer);

  if (
    isObjectPropertyOf(issuerConfig, "jwks_uri") &&
    isString(issuerConfig.jwks_uri)
  ) {
    return issuerConfig.jwks_uri;
  }

  throw new SolidOIDCError(
    "SolidOIDCIssuerConfigError",
    `Failed extracting jwks_uri from OIDC issuer configuration at URL ${issuer}`
  );
}

export async function jwks(iss: string): Promise<JSON> {
  const JWKS_URI = await jwksUri(iss);
  const response = await crossFetch(JWKS_URI, requestInit);

  if (response.ok) {
    return (await response.json()) as JSON;
  }

  throw new SolidOIDCError(
    "SolidOIDCHTTPError",
    `Failed fetching JWK Set issuer configuration at URL ${JWKS_URI}, got HTTP status code ${response.status}`
  );
}
