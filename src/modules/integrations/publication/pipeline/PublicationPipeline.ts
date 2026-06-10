/**
 * ============================================================
 * JUNG Candidate Module
 *
 * Publication Pipeline
 *
 * Orquesta todo el flujo comercial.
 *
 * Quality
 * ↓
 * Publication
 * ↓
 * Preview
 * ↓
 * Integration
 * ↓
 * History
 *
 * ============================================================
 */

export class PublicationPipeline {

  async execute(planId: string) {

    console.log("");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("PUBLICATION PIPELINE");

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    console.log("");

    console.log("① Load Products");

    console.log("② Quality");

    console.log("③ Publication");

    console.log("④ Preview");

    console.log("⑤ Integration");

    console.log("⑥ History");

    console.log("⑦ Finish");

    console.log("");

    return true;

  }

}

export const publicationPipeline =
  new PublicationPipeline();
