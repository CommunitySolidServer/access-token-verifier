import { JWK } from 'jose';
import { encode } from 'querystring';
import { checkDPoPClaims, decodeDPoP, encodeDPoP } from '../src/index';


test(`Encode DPoP`, async () => {
    const jwk: JWK.Key = await JWK.generate('EC');
    const data = await encodeDPoP({ alg: "ES256", htm: "GET", htu: "https://localhost:3000", jwk: jwk});
    console.log(data)
    let token = await decodeDPoP({encodedDPoP: data})
    console.log(token)
    expect(typeof data).toBe('string');
    expect(await checkDPoPClaims({ dpop: await decodeDPoP({encodedDPoP: data}), htm: "GET", htu: "https://localhost:3000" })).toBe(true);
});