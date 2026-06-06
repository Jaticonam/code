import type { FeedProduct, MetaFeedItem } from "../../types/feed";
import type { CatalogConnector } from "../../types/connector";
import { exportMetaCsv } from "./exporter";
import { mapProductToMeta } from "./mapper";
import { validateMetaProduct } from "./validator";

export const MetaConnector: CatalogConnector<FeedProduct, MetaFeedItem> = {
  key: "meta",
  name: "Meta Commerce",
  outputFile: "meta.csv",
  validate: validateMetaProduct,
  map: mapProductToMeta,
  export: exportMetaCsv,
};
