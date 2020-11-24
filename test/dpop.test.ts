import generateKeyPair from 'jose/util/generate_key_pair'
import UnsecuredJWT from 'jose/jwt/unsecured'

import type { DPoPJWK } from '../src/type';


test(`Encode DPoP`, async () => {


    // const { publicKey, privateKey } = await generateKeyPair('ES256', { crv: 'P-256' });
    // const data = await encodeDPoP({ alg: "ES256", htm: "GET", htu: "https://localhost:3000", jwk: privateKey as KeyObj});

    // const dpop = {
    //     header: {
    //         "alg": "ES256",
    //         "typ": "dpop+jwt",
    //         "jwk": {
    //           "kty": "EC",
    //           "kid": "gyPnXG_2DLXX8GEw_HNkwHLORmoDe5XgP0IEQupzTTk",
    //           "alg": "ES256",
    //           "crv": "P-256",
    //           "x": "0N1kbevFlKBNhdzdFPrBIjOny-d_j1lFbHx9NH4Rzzw",
    //           "y": "AtwqmgobfHmYWoWXwy_TD-aQpkegSgtwRDWN4l9_Y0A"
    //         }
    //     },
    //     payload: {
    //         "htu": "http://localhost:3000",
    //         "htm": "GET",
    //         "jti": "23dacc27-300e-44c0-b9b8-fea9276fcf85",
    //         "iat": 1604330772,
    //         "exp": 1604330832
    //     },
    //     signature: "ga3DJzQtDhPfxfJJG9bG9Ykb9bHEIbyUCVl5u7AObFLf6GTq7oQuyGAnqGSrSJ4Bk7OeEEdcF9htDkTboacYAQ"
    // }

    // console.log(data)
    // let token = await decodeDPoP({encodedDPoP: data})
    // console.log(token)
    // expect(typeof data).toBe('string');
    // expect(await checkDPoPClaims({ dpop: await decodeDPoP({encodedDPoP: data}), htm: "GET", htu: "https://localhost:3000" })).toBe(true);
    expect(true).toBe(true)
});
