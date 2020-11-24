import fetch from 'cross-fetch';

function issuerConfigUrl(iss: string): string {
    const configPath = "/.well-known/openid-configuration";
    return iss.replace(/\/$/, "").concat(configPath);
}

async function config(iss: string): Promise<JSON> {
    return (await fetch(issuerConfigUrl(iss), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })).json();
}

export async function jwks_uri(iss: string): Promise<string> {
    return (await config(iss) as any).jwks_uri;
}

export async function jwks(iss: string): Promise<JSON> {
    return (await fetch((await jwks_uri(iss)), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })).json();
}
