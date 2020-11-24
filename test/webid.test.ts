import { oidcIssuer } from '../src/webid'

test(`Retrieve WebID's Solid OIDC issuers`, async () => {
    const issuer: Array<String> = await oidcIssuer("https://ldp.demo-ess.inrupt.com/104473220984763280935/profile/card#me");
    expect(Array.isArray(issuer)).toBe(true);
    expect(issuer.length > 0).toBe(true);
    expect(issuer[0]).toBe('https://broker.demo-ess.inrupt.com/');
});
