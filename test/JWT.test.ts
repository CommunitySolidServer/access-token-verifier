import { decode } from "../src/lib/JWT";

describe("JSON Web Token decoder", () => {
  it("Correctly decodes JWT", () => {
    const token = decode(
      ".eyJibGEiOiJibGEiLCJ3ZWJpZCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdGVzdF93ZWJpZCNtZSJ9."
    );
    expect(token).toBe(
      '{"bla":"bla","webid":"https://example.com/test_webid#me"}'
    );
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(JSON.parse(token).webid).toBe("https://example.com/test_webid#me");
  });
});
