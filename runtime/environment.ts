import { MK_BOOLEAN, MK_NULL, RuntimeVal } from "./values.ts";

function setupScope(env: Environment) {
  env.declareVar('null', MK_NULL(), true);
  env.declareVar('true', MK_BOOLEAN(true), true);
  env.declareVar('false', MK_BOOLEAN(false), true);
}

export default class Environment {
  private parent?: Environment;
  private variables: Map<string, RuntimeVal>;
  private constants: Set<string>;

  constructor(parentENV?: Environment) {
    const global = parentENV ? false : true;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();

    if (global) {
      setupScope(this);
    }
  }

  public declareVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
    if (this.variables.has(varname)) {
      throw `Cannot declare variables ${varname}. As it already is defined.`;
    }

    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
    const env = this.resolve(varname);

    // Cannot assign to constant
    if (env.constants.has(varname)) {
      throw `Cannot reassign to variable ${varname} as it was declared constant.`;
    }
    env.variables.set(varname, value);
    return value;
  }

  public lookupVar(varname: string): RuntimeVal {
    const env = this.resolve(varname);
    return env.variables.get(varname) as RuntimeVal;
  }

  public resolve(varname: string): Environment {
    if (this.variables.has(varname)) {
      return this
    }

    if (this.parent == undefined) {
      throw `Cannot resolve '${varname}' as it does not exist.`;
    }

    return this.parent
  }
}