import { fetch as crossFetch } from "cross-fetch";
import { createRemoteJWKSet } from "jose";
import { isString } from "ts-guards/dist/primitive-type";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import { IssuerConfigurationDereferencingError } from "../error/IssuerConfigurationDereferencingError";
import type { RetrieveIssuerKeySetFunction } from "../type";

function getWellKnownOpenidConfigurationUrl(iss: string): string {
  return iss.replace(/\/$/, "").concat("/.well-known/openid-configuration");
}

async function dereferenceIssuerConfiguration(iss: string): Promise<JSON> {
  const configUrl = getWellKnownOpenidConfigurationUrl(iss);
  /* eslint-disable @typescript-eslint/naming-convention */
  const response = await crossFetch(configUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  /* eslint-enable @typescript-eslint/naming-convention */

  if (response.ok) {
    return (await response.json()) as JSON;
  }

  throw new IssuerConfigurationDereferencingError(
    response.status.toString(),
    configUrl
  );
}

async function getJwksUri(iss: string): Promise<URL> {
  const issuerConfig = await dereferenceIssuerConfiguration(iss);

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

  return createRemoteJWKSet(await getJwksUri(iss));
}
