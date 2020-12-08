import type { Quad } from "rdf-js";
import { DataFactory } from "rdf-data-factory";
import rdfDereferencer from "rdf-dereference";
import { SolidOIDCError } from "./SolidOIDCError";

const N3 = require("n3");

export async function oidcIssuer(
  webid: string,
  issuer: string
): Promise<string> {
  if ((await oidcIssuers(webid)).includes(issuer)) {
    return issuer;
  }
  throw new SolidOIDCError(
    "SolidOIDCInvalidIssuerClaim",
    `Incorrect issuer ${issuer} for WebID ${webid}`
  );
}

export async function oidcIssuers(webid: string): Promise<Array<string>> {
  const { quads: quadStream } = await rdfDereferencer.dereference(webid);
  const store = new N3.Store();
  const factory = new DataFactory();
  const issuer: string[] = [];

  return new Promise((resolve, reject) => {
    store
      .import(quadStream)
      .on("error", (error: any) => reject(error))
      .on("end", () => {
        store
          .match(
            factory.namedNode(webid),
            factory.namedNode("http://www.w3.org/ns/solid/terms#oidcIssuer")
          )
          .on("data", (quad: Quad) => {
            issuer.push(quad.object.value);
          })
          .on("error", (error: any) => reject(error))
          .on("end", () => resolve(issuer));
      });
  });
}
