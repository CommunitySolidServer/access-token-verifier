import { fetch as crossFetch } from "cross-fetch";
import createRemoteJWKSet from "jose/jwks/remote";
import { retrieveAccessTokenIssuerKeySet } from "../../src/algorithm/retrieveAccessTokenIssuerKeySet";
import { IssuerConfigurationDereferencingError } from "../../src/error";

jest.mock("cross-fetch");
jest.mock("jose/jwks/remote");

/* eslint-disable @typescript-eslint/naming-convention */
describe("Issuer key set", () => {
  const iss = "https://example-issuer.com/";
  const jwksUri = "https://example.com/JWKS_URI";

  it("Returns a function", async () => {
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
        headers: { "Content-Type": "application/json" },
      }
    );
    expect(createRemoteJWKSet).toHaveBeenCalledTimes(1);
    expect(createRemoteJWKSet).toHaveBeenCalledWith(new URL(jwksUri));
  });

  it("Returns the createRemoteJWKSet via the RetrieveIssuerKeySetFunction function", async () => {
    expect(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await, @typescript-eslint/no-explicit-any
      await retrieveAccessTokenIssuerKeySet(iss, async () => "" as any)
    ).toStrictEqual("");
  });

  it("Throws when Issuer's JWKS URI is missing", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({}),
    });

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      "Failed extracting jwks_uri from identity issuer configuration at URL https://example-issuer.com/"
    );
  });

  it("Throws when Issuer's JWKS URI is not a URL", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ jwks_uri: "not_a_URI" }),
    });

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      "Failed parsing jwks_uri from identity issuer configuration at URL https://example-issuer.com/ as a URL"
    );
  });

  it("Throws when Issuer config fetch fails", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: () => ({}),
    });

    await expect(retrieveAccessTokenIssuerKeySet(iss)).rejects.toThrow(
      IssuerConfigurationDereferencingError
    );
  });
});
/* eslint-enable @typescript-eslint/naming-convention */
