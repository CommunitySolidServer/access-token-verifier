import { jwks, jwks_uri } from '../src/issuer'

test(`JWKS to be retrieved`, async () => {
    const issuerJWKS = await jwks('https://broker.demo-ess.inrupt.com');
    expect(typeof issuerJWKS).toBe('object');
    expect(Array.isArray((issuerJWKS as any).keys)).toBe(true);
});

test(`JWKS URI to be retrieved`, async () => {
    const issuerJWKSURI = await jwks_uri('https://broker.demo-ess.inrupt.com');
    expect(issuerJWKSURI).toBe('https://broker.demo-ess.inrupt.com/jwk');
});
