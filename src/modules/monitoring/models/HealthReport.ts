export interface HealthReport{

    generatedAt:string;

    status:"healthy"|"warning"|"critical";

    score:number;

    components:Record<string,unknown>;

    issues:string[];

}
