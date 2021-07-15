import { DataFactory, Store } from "n3";
import rdfDereferencer from "rdf-dereference";
import type { Quad } from "rdf-js";
import type { GetIssuersFunction } from "../type";

/* eslint-disable-next-line func-names */
export const issuers: GetIssuersFunction = async function (
  webid: URL
): Promise<Array<string>> {
  const { quads: quadStream } = await rdfDereferencer.dereference(
    webid.toString()
  );
  const store = new Store();
  const issuer: string[] = [];

  return new Promise((resolve) => {
    store.import(quadStream).on("end", () => {
      store
        .match(
          DataFactory.namedNode(webid.toString()),
          DataFactory.namedNode("http://www.w3.org/ns/solid/terms#oidcIssuer")
        )
        .on("data", (quad: Quad) => {
          issuer.push(quad.object.value);
        })
        .on("end", () => resolve(issuer));
    });
  });
};
