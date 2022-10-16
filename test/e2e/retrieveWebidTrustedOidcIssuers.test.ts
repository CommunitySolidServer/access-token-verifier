import { retrieveWebidTrustedOidcIssuers } from "../../src/algorithm/retrieveWebidTrustedOidcIssuers";

describe("retrieveWebidTrustedOidcIssuers", () => {
  it("returns expected issuer set via id.inrupt.com", async () => {
    expect(
      await retrieveWebidTrustedOidcIssuers("https://id.inrupt.com/matthieu")
    ).toEqual(["https://login.inrupt.com"]);
  });

  it("returns expected issuer set via inrupt.net", async () => {
    expect(
      await retrieveWebidTrustedOidcIssuers(
        "https://matthieubosquet.inrupt.net/profile/card#me"
      )
    ).toEqual(["https://inrupt.net/"]);
  });

  it("returns expected issuer set via solidcommunity.net", async () => {
    expect(
      await retrieveWebidTrustedOidcIssuers(
        "https://matthieubi.solidcommunity.net/profile/card#me"
      )
    ).toEqual(["https://solidcommunity.net"]);
  });

  it("returns expected issuer set via solidweb.org", async () => {
    expect(
      await retrieveWebidTrustedOidcIssuers(
        "https://matthieubosquet.solidweb.org/profile/card#me"
      )
    ).toEqual(["https://solidweb.org"]);
  });

  // TODO: Sign-up again, profile disappeared.
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("returns expected issuer set via trinpod.us", async () => {
    expect(
      await retrieveWebidTrustedOidcIssuers("https://matthieu.trinpod.us/i")
    ).toEqual(["https://trinpod.us"]);
  });
});
