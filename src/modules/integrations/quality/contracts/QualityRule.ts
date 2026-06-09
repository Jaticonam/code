import type { QualityIssue } from "../models";

export interface QualityRule<T = unknown> {

  key: string;

  name: string;

  description: string;

  weight: number;

  required: boolean;

  enabled: boolean;

  validate(item: T): QualityIssue[];

}
