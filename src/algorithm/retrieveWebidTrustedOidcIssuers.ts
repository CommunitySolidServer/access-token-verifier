// eslint-disable-next-line no-shadow
import { URL } from "url";
import type { Quad } from "@rdfjs/types";
import { DataFactory, Parser, Store } from "n3";
import fetch from "node-fetch";
import { WebidDereferencingError } from "../error/WebidDereferencingError";
import { WebidIriError } from "../error/WebidIriError";
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

function parseRdf(rdf: string, baseIRI: string): Store<Quad> {
  try {
    const store = new Store();
    store.addQuads(new Parser({ baseIRI }).parse(rdf));
    return store;
  } catch (e: unknown) {
    throw new WebidParsingError();
  }
}

export async function retrieveWebidTrustedOidcIssuers(
  webid: string,
  getIssuers?: RetrieveOidcIssuersFunction
): ReturnType<RetrieveOidcIssuersFunction> {
  let webidUrl: URL;
  try {
    webidUrl = new URL(webid);
  } catch (e: unknown) {
    throw new WebidIriError(webid);
  }
  if (typeof getIssuers !== "undefined" && getIssuers !== null) {
    return getIssuers(webid);
  }
  const store = parseRdf(
    await dereferenceWebid(webid),
    webidUrl.toString().substring(0, webid.indexOf("#"))
  );
  const quads = store.getQuads(
    DataFactory.namedNode(webid),
    DataFactory.namedNode("http://www.w3.org/ns/solid/terms#oidcIssuer"),
    null,
    DataFactory.defaultGraph()
  );

  return quads.map((x) => x.object.value);
}
