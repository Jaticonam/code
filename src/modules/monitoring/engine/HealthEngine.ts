import fs from "node:fs/promises";
import path from "node:path";

import { HealthCollectorRegistry } from "../registry/HealthCollectorRegistry";

const OUTPUT=
path.resolve(
process.cwd(),
"public/api/health/commercial.json"
);

export class HealthEngine{

async build(){

const components:any={};

const issues:string[]=[];

let score=100;

for(

const collector

of

HealthCollectorRegistry.getAll()

){

const result=
await collector.collect();

components[
collector.key
]=result;

if(
result.status==="warning"
){

score-=10;

issues.push(
collector.key
);

}

if(
result.status==="error"
){

score-=30;

issues.push(
collector.key
);

}

}

const report={

generatedAt:
new Date().toISOString(),

status:
score>=90
?"healthy"
:score>=60
?"warning"
:"critical",

score,

components,

issues

};

await fs.mkdir(

path.dirname(
OUTPUT
),

{

recursive:true

}

);

await fs.writeFile(

OUTPUT,

JSON.stringify(
report,
null,
2
)

);

return report;

}

}

export const healthEngine=
new HealthEngine();
