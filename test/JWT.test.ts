import { decode } from '../src/lib/JWT'

describe("JSON Web Token decoder", () => {
  it("Correctly decodes JWT", async () => {
    const token = decode(".eyJibGEiOiJibGEiLCJ3ZWJpZCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdGVzdF93ZWJpZCNtZSJ9.");
    expect(token).toBe("{\"bla\":\"bla\",\"webid\":\"https://example.com/test_webid#me\"}")
    expect(JSON.parse(token).webid).toBe("https://example.com/test_webid#me");
  });
});
