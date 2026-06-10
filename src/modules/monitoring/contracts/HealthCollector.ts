export interface HealthCollector{

    key:string;

    collect():Promise<{

        status:"ok"|"warning"|"error";

        score:number;

        details?:unknown;

    }>;

}
