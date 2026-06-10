import fs from "node:fs/promises";
import path from "node:path";
import type { PublicationExecution, PublicationSnapshot } from "../models";

const ARCHIVE_DIR = path.resolve(process.cwd(), "public/api/archive/publications");

export async function savePublicationArchive(execution: PublicationExecution, snapshot: PublicationSnapshot) {
  await fs.mkdir(ARCHIVE_DIR, { recursive: true });

  const executionFile = path.join(ARCHIVE_DIR, `${execution.id}.execution.json`);
  const snapshotFile = path.join(ARCHIVE_DIR, `${execution.id}.snapshot.json`);
  const latestFile = path.join(ARCHIVE_DIR, "latest.json");

  await fs.writeFile(executionFile, JSON.stringify(execution, null, 2), "utf8");
  await fs.writeFile(snapshotFile, JSON.stringify(snapshot, null, 2), "utf8");
  await fs.writeFile(latestFile, JSON.stringify({ execution, snapshot }, null, 2), "utf8");

  return { executionFile, snapshotFile, latestFile };
}
