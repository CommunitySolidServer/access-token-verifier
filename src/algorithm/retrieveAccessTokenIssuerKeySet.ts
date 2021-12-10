import { fetch as crossFetch } from "cross-fetch";
import { createRemoteJWKSet } from "jose";
import { isString } from "ts-guards/dist/primitive-type";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import { IssuerConfigurationDereferencingError } from "../error/IssuerConfigurationDereferencingError";
import { SolidOidcIssuerJwksUriParsingError } from "../error/SolidOidcIssuerJwksUriParsingError";
import type { RetrieveIssuerKeySetFunction } from "../type";

function getWellKnownOpenidConfigurationUrl(iss: string): string {
  return iss.replace(/\/$/, "").concat("/.well-known/openid-configuration");
}

async function dereferenceIssuerConfiguration(iss: string): Promise<JSON> {
  const configUrl = getWellKnownOpenidConfigurationUrl(iss);
  const response = await crossFetch(configUrl, {
    method: "GET",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "Content-Type": "application/json" },
  });

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

  if (!isObjectPropertyOf(issuerConfig, "jwks_uri")) {
    throw new SolidOidcIssuerJwksUriParsingError(
      `JWKS URI field missing in issuer configuration at ${iss.toString()}`
    );
  }

  if (!isString(issuerConfig.jwks_uri)) {
    throw new SolidOidcIssuerJwksUriParsingError(
      `JWKS URI field is not a string in issuer configuration at ${iss.toString()}`
    );
  }

  try {
    return new URL(issuerConfig.jwks_uri);
  } catch (_) {
    throw new SolidOidcIssuerJwksUriParsingError(
      `JWKS URI field could not be parsed as a valid URL in issuer configuration at ${iss.toString()}`
    );
  }
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
