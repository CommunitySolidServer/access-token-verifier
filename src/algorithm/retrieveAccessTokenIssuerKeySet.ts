import { fetch as crossFetch } from "cross-fetch";
import createRemoteJWKSet from "jose/jwks/remote";
import { isString } from "ts-guards/dist/primitive-type";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import type { RetrieveIssuerKeySetFunction } from "../type";

function configUrl(iss: string): string {
  return iss.replace(/\/$/, "").concat("/.well-known/openid-configuration");
}

async function config(iss: URL): Promise<JSON> {
  /* eslint-disable @typescript-eslint/naming-convention */
  const response = await crossFetch(configUrl(iss.toString()), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  /* eslint-enable @typescript-eslint/naming-convention */

  if (response.ok) {
    return (await response.json()) as JSON;
  }

  throw new Error(
    `SolidIdentityHTTPError Failed fetching identity issuer configuration at URL ${iss.toString()}, got HTTP status code ${
      response.status
    }`
  );
}

async function jwksUri(iss: URL): Promise<URL> {
  const issuerConfig = await config(iss);

  if (
    isObjectPropertyOf(issuerConfig, "jwks_uri") &&
    isString(issuerConfig.jwks_uri)
  ) {
    try {
      return new URL(issuerConfig.jwks_uri);
    } catch (_) {
      throw new Error(
        `SolidIdentityIssuerConfigError Failed parsing jwks_uri from identity issuer configuration at URL ${iss.toString()} as a URL`
      );
    }
  }

  throw new Error(
    `SolidIdentityIssuerConfigError Failed extracting jwks_uri from identity issuer configuration at URL ${iss.toString()}`
  );
}

export async function retrieveAccessTokenIssuerKeySet(
  iss: string,
  getKeySet?: RetrieveIssuerKeySetFunction
): ReturnType<RetrieveIssuerKeySetFunction> {
  if (typeof getKeySet !== "undefined" && getKeySet !== null) {
    return getKeySet(iss);
  }

  return createRemoteJWKSet(await jwksUri(new URL(iss)));
}
