# Solid OIDC Access Token Verifier

[![Project Solid](https://img.shields.io/badge/Project-Solid-7C4DFF.svg)](https://solidproject.org/)
[![Test workflow](https://github.com/solid/access-token-verifier/workflows/Unit%20Tests/badge.svg?branch=main)](https://github.com/solid/access-token-verifier/actions/workflows/test-unit.yml?query=workflow%3Atest+branch%3Amain)
[![npm package](https://img.shields.io/npm/v/@solid/access-token-verifier)](https://www.npmjs.com/package/@solid/access-token-verifier)

This library verifies Solid OIDC access tokens via their `webid` claim, and thus asserts ownership of a [WebID](https://www.w3.org/2005/Incubator/webid/spec/).

It conforms to the [Solid OIDC specification](https://solid.github.io/solid-oidc/).

See also: [Solid OIDC Primer Request Flow](https://solid.github.io/solid-oidc/primer/#request-flow)

## Supports

- DPoP Bound Access Tokens
- Bearer Access Tokens
- Caching of:
  - WebID Identity Providers
  - Identity Providers JSON Web Key Sets
  - A minimalistic version of DPoP tokens identifiers to mitigate replays otherwise mostly
    mitigated by the 60 seconds maximum DPoP Token age, should be improved to take a configurable
    max requests per seconds to avoid overflow of cache before replay. But de facto, if someone really
    wanted to mitigate this attack, they should plug a cache that can support high numbers of requests.
    Someone could easily overflow a lru cache by logging lots of requests as themselves before replaying
    the token. That is if the server can answer fast enough...
- Custom Identity Verification Classes to extend to specific caching strategies if needed

## How to?

Verify Solid Access Tokens with a simple function:

```javascript
import type { RequestMethod, SolidTokenVerifierFunction } from '@solid/access-token-verifier';
import { createSolidTokenVerifier } from '@solid/access-token-verifier';

const solidOidcAccessTokenVerifier: SolidTokenVerifierFunction = createSolidTokenVerifier();

try {
  const { client_id: clientId, webid: webId } = await solidOidcAccessTokenVerifier(
    authorizationHeader as string,
    {
      header: dpopHeader as string,
      method: requestMethod as RequestMethod,
      url: requestURL as string
    }
  );

  console.log(`Verified Access Token via WebID: ${webId} and for client: ${clientId}`);

  return { webId, clientId };
} catch (error: unknown) {
  const message = `Error verifying Access Token via WebID: ${(error as Error).message}`;

  console.log(message);

  throw new Error(message);
}
```

The `solidOidcAccessTokenVerifier` function takes an authorization header which can be an encoded Bearer or DPoP bound access token and optional DPoP parameters.

## TODO

- Further sanitation of inputs? For example a maximum authorization header size. Needs further discussions before resolution.
- Improve default caching? Assess other libraries that might be used.
- Evolve the type guards and the type guard library.
- Allow http over tls on all WebIDs instead of enforcing https as per: https://github.com/solid/authentication-panel/issues/114.
- ~~Enforce client ID when support is wide enough as per: https://solid.github.io/solid-oidc/#tokens-access~~
- Enforce `azp` claim in the next library which should target ID tokens as opposed to Access tokens as per the [updated Solid-OIDC spec](https://solid.github.io/solid-oidc/#tokens-id)
- Enforce DPoP ath claim when support is wide enough as per: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-dpop-04#section-4.2
