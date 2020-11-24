import { webID } from '../src/jwt'

test(`WebID to be extracted from JWT`, async () => {
    expect(webID(".eyJibGEiOiJibGEiLCJ3ZWJpZCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vdGVzdF93ZWJpZCNtZSJ9.")).toBe("https://example.com/test_webid#me");
});
