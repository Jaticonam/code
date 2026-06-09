import type { QualityRule } from "../contracts/QualityRule";

class Registry {

  private rules: QualityRule<any>[] = [];

  register(rule: QualityRule<any>) {

    const exists = this.rules.some(r => r.key === rule.key);

    if (!exists) {

      this.rules.push(rule);

    }

  }

  getAll() {

    return this.rules.filter(r => r.enabled);

  }

}

export const ValidatorRegistry = new Registry();
