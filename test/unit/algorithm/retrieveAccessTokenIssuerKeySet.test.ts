// eslint-disable-next-line no-shadow
import { URL } from "url";
import type * as Jose from "jose";
import { createRemoteJWKSet } from "jose";
// eslint-disable-next-line no-shadow
import fetch from "node-fetch";
import { retrieveAccessTokenIssuerKeySet } from "../../../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { IssuerConfigurationDereferencingError } from "../../../src/error/IssuerConfigurationDereferencingError";
import { SolidOidcIssuerJwksUriParsingError } from "../../../src/error/SolidOidcIssuerJwksUriParsingError";

jest.mock("node-fetch", () => jest.fn());
jest.mock("jose", () => {
  return {
    ...jest.requireActual("jose"),
    createRemoteJWKSet: jest.fn(),
  } as typeof Jose;
});

describe("retrieveAccessTokenIssuerKeySet", () => {
  const iss = "https://example-issuer.com/";

  it("returns a function", async () => {
    const jwksUri = "https://example.com/JWKS_URI";
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        // eslint-disable-next-line camelcase
        json: () => ({ jwks_uri: jwksUri }),
      })
    );
    (createRemoteJWKSet as jest.Mock).mockReturnValueOnce(() => true);

    expect(
      await (
        await retrieveAccessTokenIssuerKeySet(iss)
      )({}, { payload: "", signature: "" })
    ).toBe(true);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      `${iss.toString()}.well-known/openid-configuration`,
      {
        method: "GET",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { Accept: "application/json" },
      }
    );
    expect(createRemoteJWKSet).toHaveBeenCalledTimes(1);
    expect(createRemoteJWKSet).toHaveBeenCalledWith(new URL(jwksUri));
  });

  it("returns the createRemoteJWKSet via the RetrieveIssuerKeySetFunction function", async () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await, @typescript-eslint/no-explicit-any
      await retrieveAccessTokenIssuerKeySet(iss, async () => "" as any)
    ).toBe("");
  });

  it("throws when Issuer's JWKS URI is missing", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => ({}),
      })
    );

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      SolidOidcIssuerJwksUriParsingError
    );
  });

  it("throws when Issuer's JWKS URI is not a string", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        // eslint-disable-next-line camelcase
        json: () => ({ jwks_uri: 1 }),
      })
    );

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      SolidOidcIssuerJwksUriParsingError
    );
  });

  it("throws when Issuer's JWKS URI is not a URL", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        // eslint-disable-next-line camelcase
        json: () => ({ jwks_uri: "not_a_URI" }),
      })
    );

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      SolidOidcIssuerJwksUriParsingError
    );
  });

  it("throws when Issuer config fetch fails", async () => {
    (fetch as unknown as jest.Mock).mockImplementationOnce(() =>
      Promise.resolve({
        status: 400,
        json: () => ({}),
      })
    );

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      IssuerConfigurationDereferencingError
    );
  });
});
