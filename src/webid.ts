import type { Quad } from 'n3'

const N3 = require('n3');
import { DataFactory } from "rdf-data-factory";
import rdfDereferencer from "rdf-dereference";

export async function oidcIssuer(webid: string): Promise<Array<string>> {
    const { quads: quadStream } = await rdfDereferencer.dereference(webid);
    const store = new N3.Store();
    const factory = new DataFactory();
    const oidcIssuer: string[] = [];

    return new Promise((resolve, reject) => {
        store
            .import(quadStream)
            .on('error', (error: any) => reject(error))
            .on('end', () => {
                store
                    .match(factory.namedNode(webid), factory.namedNode('http://www.w3.org/ns/solid/terms#oidcIssuer'))
                    .on('data', (quad: Quad) => {
                        oidcIssuer.push(quad.object.value);
                    })
                    .on('error', (error: any) => reject(error))
                    .on('end', () => resolve(oidcIssuer));
            });
        });
}
