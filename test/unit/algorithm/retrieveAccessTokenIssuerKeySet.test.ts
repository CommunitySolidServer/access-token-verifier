import { fetch as crossFetch } from "cross-fetch";
import type * as Jose from "jose";
import { createRemoteJWKSet } from "jose";
import { retrieveAccessTokenIssuerKeySet } from "../../../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { IssuerConfigurationDereferencingError } from "../../../src/error/IssuerConfigurationDereferencingError";
import { SolidOidcIssuerJwksUriParsingError } from "../../../src/error/SolidOidcIssuerJwksUriParsingError";

jest.mock("cross-fetch");
jest.mock("jose", () => {
  return {
    ...jest.requireActual("jose"),
    createRemoteJWKSet: jest.fn(),
  } as typeof Jose;
});

describe("retrieveAccessTokenIssuerKeySet()", () => {
  const iss = "https://example-issuer.com/";
  const jwksUri = "https://example.com/JWKS_URI";

  it("returns a function", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ jwks_uri: jwksUri }),
    });
    (createRemoteJWKSet as jest.Mock).mockReturnValueOnce(() => true);

    expect(
      await (
        await retrieveAccessTokenIssuerKeySet(iss)
      )({}, { payload: "", signature: "" })
    ).toBe(true);

    expect(crossFetch).toHaveBeenCalledTimes(1);
    expect(crossFetch).toHaveBeenCalledWith(
      `${iss.toString()}.well-known/openid-configuration`,
      {
        method: "GET",
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { "Content-Type": "application/json" },
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
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({}),
    });

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      SolidOidcIssuerJwksUriParsingError
    );
  });

  it("throws when Issuer's JWKS URI is not a string", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ jwks_uri: 1 }),
    });

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      SolidOidcIssuerJwksUriParsingError
    );
  });

  it("throws when Issuer's JWKS URI is not a URL", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ jwks_uri: "not_a_URI" }),
    });

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      SolidOidcIssuerJwksUriParsingError
    );
  });

  it("throws when Issuer config fetch fails", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: () => ({}),
    });

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      IssuerConfigurationDereferencingError
    );
  });
});
