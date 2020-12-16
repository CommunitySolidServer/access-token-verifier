import { fetch as crossFetch } from "cross-fetch";
import createRemoteJWKSet from "jose/jwks/remote";
import { isString } from "ts-guards/dist/primitive-type";
import { isObjectPropertyOf } from "ts-guards/dist/standard-object";
import type { GetKeySetFunction } from "../types";
import { SolidIdentityError } from "./SolidIdentityError";

/* eslint-disable @typescript-eslint/naming-convention */
const requestInit = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};
/* eslint-enable @typescript-eslint/naming-convention */

function configUrl(iss: string): string {
  return iss.replace(/\/$/, "").concat("/.well-known/openid-configuration");
}

async function config(iss: URL): Promise<JSON> {
  const response = await crossFetch(configUrl(iss.toString()), requestInit);

  if (response.ok) {
    return (await response.json()) as JSON;
  }

  throw new SolidIdentityError(
    "SolidIdentityHTTPError",
    `Failed fetching identity issuer configuration at URL ${iss.toString()}, got HTTP status code ${
      response.status
    }`
  );
}

async function jwksUri(iss: URL): Promise<string> {
  const issuerConfig = await config(iss);

  if (
    isObjectPropertyOf(issuerConfig, "jwks_uri") &&
    isString(issuerConfig.jwks_uri)
  ) {
    return issuerConfig.jwks_uri;
  }

  throw new SolidIdentityError(
    "SolidIdentityIssuerConfigError",
    `Failed extracting jwks_uri from identity issuer configuration at URL ${iss.toString()}`
  );
}

export const keySet: GetKeySetFunction = async function (iss: URL) {
  return createRemoteJWKSet(new URL(await jwksUri(iss)));
};
