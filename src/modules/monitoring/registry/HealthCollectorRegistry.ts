import type { HealthCollector } from "../contracts/HealthCollector";

class Registry{

    private collectors:HealthCollector[]=[];

    register(c:HealthCollector){

        if(
            this.collectors.some(
                x=>x.key===c.key
            )
        ){
            return;
        }

        this.collectors.push(c);

    }

    getAll(){

        return this.collectors;

    }

}

export const HealthCollectorRegistry=
new Registry();
