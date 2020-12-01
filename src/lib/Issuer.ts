import { fetch as crossFetch } from "cross-fetch";

/* eslint-disable @typescript-eslint/naming-convention */
const requestInit = {
  method: "GET",
  headers: { "Content-Type": "application/json" },
};
/* eslint-enable @typescript-eslint/naming-convention */

function configUrl(iss: string): string {
  const configPath = "/.well-known/openid-configuration";
  return iss.replace(/\/$/, "").concat(configPath);
}

async function config(iss: string): Promise<JSON> {
  return (await crossFetch(configUrl(iss), requestInit)).json();
}

export async function jwksUri(iss: string): Promise<string> {
  return ((await config(iss)) as any).jwks_uri;
}

export async function jwks(iss: string): Promise<JSON> {
  return (await crossFetch(await jwksUri(iss), requestInit)).json();
}
