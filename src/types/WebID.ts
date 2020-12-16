export interface GetIssuersFunction {
  (webid: URL): Promise<Array<string>>;
}
