# Solid Token Verifier

[![build](https://github.com/matthieubosquet/ts-dpop/workflows/build/badge.svg?branch=main)](https://github.com/matthieubosquet/ts-dpop/actions?query=workflow%3A"build")
[![coverage](https://codecov.io/gh/matthieubosquet/ts-dpop/branch/main/graph/badge.svg)](https://codecov.io/gh/matthieubosquet/ts-dpop)
[![npm](https://img.shields.io/npm/v/ts-dpop)](https://www.npmjs.com/package/ts-dpop)

This library verifies Solid access tokens via their WebID claim, and thus asserts ownership of WebIDs.

It conforms to the [Solid Identity specification](https://solid.github.io/authentication-panel/solid-oidc/).

See also: [Solid OIDC Primer Request Flow](https://solid.github.io/authentication-panel/solid-oidc-primer/#request-flow)

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
import type { RequestMethod, SolidTokenVerifierFunction } from 'ts-dpop';
import { createSolidTokenVerifier } from 'ts-dpop';

const solidTokenVerifier: SolidTokenVerifierFunction = createSolidTokenVerifier();

try {
  const { client_id: clientId, webid: webId } = await solidTokenVerifier(
    authorizationHeader as string,
    dpopHeader as string,
    method as RequestMethod,
    requestURL as string
  );

  console.log(`Verified Access Token via WebID: ${webId} and for client: ${clientId}`);

  return { webId, clientId };
} catch (error: unknown) {
  const message = `Error verifying Access Token via WebID: ${(error as Error).message}`;

  console.log(message);

  throw new Error(message);
}
```

## TODO

- Further sanitation of inputs? For example a maximum authorization header size. Needs further discussions before resolution.
- Improve default caching? Assess other libraries that might be used.
- Evolve the type guards and the type guard library.
