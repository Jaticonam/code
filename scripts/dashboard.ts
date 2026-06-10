import {
dashboardEngine
}
from
"../src/modules/integrations/dashboard";

dashboardEngine
.build()
.then(r=>{

console.log("");

console.log("📊 Dashboard generado");

console.log(r);

});
