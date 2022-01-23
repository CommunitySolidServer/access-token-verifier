import type { Quad } from "@rdfjs/types";
import { DataFactory, Parser, Store } from "n3";
// eslint-disable-next-line no-shadow
import fetch from "node-fetch";
import { WebidDereferencingError } from "../error/WebidDereferencingError";
import { WebidParsingError } from "../error/WebidParsingError";
import type { RetrieveOidcIssuersFunction } from "../type";

async function dereferenceWebid(webid: string): Promise<string> {
  try {
    const response = await fetch(webid, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Accept: "text/turtle",
      },
    });
    return await response.text();
  } catch (e: unknown) {
    throw new WebidDereferencingError(webid);
  }
}

function parseRdf(rdf: string): Store<Quad> {
  try {
    const store = new Store();
    store.addQuads(new Parser().parse(rdf));
    return store;
  } catch (e: unknown) {
    throw new WebidParsingError();
  }
}

export async function retrieveWebidTrustedOidcIssuers(
  webid: string,
  getIssuers?: RetrieveOidcIssuersFunction
): ReturnType<RetrieveOidcIssuersFunction> {
  if (typeof getIssuers !== "undefined" && getIssuers !== null) {
    return getIssuers(webid);
  }

  return parseRdf(await dereferenceWebid(webid))
    .getQuads(
      DataFactory.namedNode(webid),
      DataFactory.namedNode("http://www.w3.org/ns/solid/terms#oidcIssuer"),
      null,
      DataFactory.defaultGraph()
    )
    .map((x) => x.object.value);
}
