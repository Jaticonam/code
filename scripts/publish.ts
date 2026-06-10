import { publicationPipeline } from "../src/modules/integrations/publication";

const plan =
process.argv
.find(a=>a.startsWith("--plan="))
?.replace("--plan=","")
??"meta-all";

publicationPipeline.execute(plan);
