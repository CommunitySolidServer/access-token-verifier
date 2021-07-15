import { fetch as crossFetch } from "cross-fetch";
import createRemoteJWKSet from "jose/jwks/remote";
import { keySet } from "../src/lib/Issuer";

jest.mock("cross-fetch");
jest.mock("jose/jwks/remote");

/* eslint-disable @typescript-eslint/naming-convention */
describe("Issuer key set", () => {
  const issuer = new URL("https://example-issuer.com/");
  const jwksUri = "https://example.com/JWKS_URI";

  it("Returns a function", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ jwks_uri: jwksUri }),
    });
    (createRemoteJWKSet as jest.Mock).mockReturnValueOnce(() => true);

    expect(
      await (
        await keySet(issuer)
      )({}, { payload: "", signature: "" })
    ).toBe(true);

    expect(crossFetch).toHaveBeenCalledTimes(1);
    expect(crossFetch).toHaveBeenCalledWith(
      `${issuer.toString()}.well-known/openid-configuration`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }
    );
    expect(createRemoteJWKSet).toHaveBeenCalledTimes(1);
    expect(createRemoteJWKSet).toHaveBeenCalledWith(new URL(jwksUri));
  });

  it("Throws when Issuer's JWKS URI is missing", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({}),
    });

    await expect(keySet(issuer)).rejects.toThrow(
      "Failed extracting jwks_uri from identity issuer configuration at URL https://example-issuer.com/"
    );
  });

  it("Throws when Issuer's JWKS URI is not a URL", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => ({ jwks_uri: "not_a_URI" }),
    });

    await expect(keySet(issuer)).rejects.toThrow(
      "Failed parsing jwks_uri from identity issuer configuration at URL https://example-issuer.com/ as a URL"
    );
  });

  it("Throws when Issuer config fetch fails", async () => {
    (crossFetch as jest.Mock).mockResolvedValueOnce({
      status: 400,
      json: () => ({}),
    });

    await expect(keySet(issuer)).rejects.toThrow(
      "Failed fetching identity issuer configuration at URL https://example-issuer.com/, got HTTP status code 400"
    );
  });
});
/* eslint-enable @typescript-eslint/naming-convention */
