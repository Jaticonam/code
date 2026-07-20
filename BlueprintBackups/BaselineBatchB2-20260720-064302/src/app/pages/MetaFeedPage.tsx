import { useEffect, useState } from "react";
import { generateMetaFeedFromProducts } from "@/modules/integrations/services/generateMetaFeed";

export default function MetaFeedPage() {
  const [csv, setCsv] = useState("Generando feed Meta...");

  useEffect(() => {
    generateMetaFeedFromProducts().then(setCsv).catch((err) => setCsv(String(err)));
  }, []);

  return <pre style={{ whiteSpace: "pre-wrap", padding: 20, fontSize: 12 }}>{csv}</pre>;
}
