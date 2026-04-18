// ============================================================================
// dsl/interpreter.js — Interpreter (tree-walker) pentru ImmunoScript
// ============================================================================
// Traversează AST-ul produs de Parser și îl evaluează. Menține:
//  - un lanț de Environment-uri (scope lexical)
//  - o stare biologică (populații celulare, concentrații citokine)
//  - un event log pentru simulări
// ============================================================================

import { NODE } from './parser.js';
import { createStdLib } from './stdlib.js';

// ----------------------------------------------------------------------------
// Environment — lanț de scope-uri
// ----------------------------------------------------------------------------
export class Environment {
  constructor(parent = null) {
    this.vars = new Map();
    this.parent = parent;
  }
  define(name, value) { this.vars.set(name, value); }
  assign(name, value) {
    if (this.vars.has(name)) { this.vars.set(name, value); return; }
    if (this.parent) { this.parent.assign(name, value); return; }
    throw new Error(`Variabilă nedefinită: ${name}`);
  }
  get(name) {
    if (this.vars.has(name)) return this.vars.get(name);
    if (this.parent) return this.parent.get(name);
    throw new Error(`Variabilă nedefinită: ${name}`);
  }
  has(name) {
    if (this.vars.has(name)) return true;
    return this.parent ? this.parent.has(name) : false;
  }
}

// ----------------------------------------------------------------------------
// Obiecte biologice runtime
// ----------------------------------------------------------------------------
export class BioObject {
  constructor(kind, name, props = {}) {
    this.kind = kind;
    this.name = name;
    Object.assign(this, props);
  }
  toString() { return `[${this.kind}: ${this.name}]`; }
}

export class Quantity {
  constructor(value, unit) { this.value = value; this.unit = unit; }
  toString() { return `${this.value}${this.unit || ''}`; }
}

// ----------------------------------------------------------------------------
// Signale de control (break/continue/return)
// ----------------------------------------------------------------------------
class ReturnSignal { constructor(v) { this.value = v; } }
class BreakSignal {}
class ContinueSignal {}

// ----------------------------------------------------------------------------
// Interpreter
// ----------------------------------------------------------------------------
export class Interpreter {
  constructor(options = {}) {
    this.globals = new Environment();
    this.output = [];      // consola — ce afișăm în IDE
    this.events = [];      // timeline simulation events
    this.bioState = {
      cells: new Map(),    // nume -> populație
      cytokines: new Map(),
      time: 0
    };
    this.onEvent = options.onEvent || (() => {});
    this.maxSteps = options.maxSteps || 1_000_000;
    this.steps = 0;
    createStdLib(this);   // populează globals cu stdlib
  }

  print(...args) {
    const line = args.map(a => this.stringify(a)).join(' ');
    this.output.push(line);
  }

  stringify(v) {
    if (v === null || v === undefined) return 'null';
    if (typeof v === 'string') return v;
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (v instanceof Quantity) return v.toString();
    if (v instanceof BioObject) {
      const pairs = Object.keys(v).filter(k => k !== 'kind' && k !== 'name').slice(0, 4);
      const extra = pairs.length
        ? ' ' + pairs.map(k => `${k}=${this.stringify(v[k])}`).join(', ')
        : '';
      return `⟨${v.kind}: ${v.name}${extra}⟩`;
    }
    if (Array.isArray(v)) return '[' + v.map(x => this.stringify(x)).join(', ') + ']';
    if (typeof v === 'function') return '<fn>';
    if (typeof v === 'object') {
      try { return JSON.stringify(v, null, 2); }
      catch { return String(v); }
    }
    return String(v);
  }

  // --------------------------------------------------------------------------
  // Entry point
  // --------------------------------------------------------------------------
  run(ast) {
    this.output = [];
    this.events = [];
    this.steps = 0;
    try {
      for (const stmt of ast.body) {
        this.execute(stmt, this.globals);
      }
    } catch (e) {
      if (e instanceof ReturnSignal) {
        this.output.push(`[Return la nivel global: ${this.stringify(e.value)}]`);
      } else {
        this.output.push(`Eroare runtime: ${e.message}`);
      }
    }
    return {
      output: this.output,
      events: this.events,
      state: this.bioState
    };
  }

  // --------------------------------------------------------------------------
  // Execute statement
  // --------------------------------------------------------------------------
  execute(node, env) {
    if (++this.steps > this.maxSteps) throw new Error('Limita de pași depășită (posibil loop infinit)');
    if (!node) return;

    switch (node.type) {
      case NODE.VarDecl: {
        const value = node.init ? this.evaluate(node.init, env) : null;
        env.define(node.name, value);
        return;
      }
      case NODE.FnDecl: {
        const fn = this.makeFunction(node, env);
        env.define(node.name, fn);
        return;
      }
      case NODE.CellDecl:
      case NODE.CytokineDecl:
      case NODE.AntibodyDecl:
      case NODE.PathogenDecl: {
        const kindMap = {
          [NODE.CellDecl]: 'cell',
          [NODE.CytokineDecl]: 'cytokine',
          [NODE.AntibodyDecl]: 'antibody',
          [NODE.PathogenDecl]: 'pathogen'
        };
        const props = {};
        if (node.props) for (const p of node.props) props[p.key] = this.evaluate(p.value, env);
        const obj = new BioObject(kindMap[node.type], node.name, props);
        env.define(node.name, obj);
        if (obj.kind === 'cell') this.bioState.cells.set(obj.name, obj);
        this.logEvent('declare', `Declarat ${obj.kind}: ${obj.name}`);
        return;
      }
      case NODE.ImportDecl: {
        // import { X, Y } from "source"
        //   Sursele sunt deja pre-încărcate ca obiecte în stdlib;
        //   acest import este practic un "noop" documentativ (valorile există deja
        //   în global scope). Totuși verificăm că există.
        if (node.names) {
          for (const n of node.names) {
            if (!this.globals.has(n)) this.output.push(`Avertisment: ${n} nu este în stdlib.`);
          }
        }
        return;
      }
      case NODE.AssayBlock: {
        // Creează un obiect assay în stare și raportează
        const props = {};
        for (const p of node.props) props[p.key] = this.evaluate(p.value, env);
        this.logEvent('assay', `Assay ${node.name}: ${this.stringify(props)}`);
        return new BioObject('assay', node.name, props);
      }
      case NODE.SimulateStmt: {
        return this.runSimulate(node, env);
      }
      case NODE.ActionStmt: {
        return this.runAction(node, env);
      }
      case NODE.DifferentiateStmt: {
        const source = this.evaluate(node.source, env);
        const target = this.evaluate(node.target, env);
        const desc = `${this.stringify(source)} → ${this.stringify(target)}`;
        this.logEvent('differentiate', desc);
        return target;
      }
      case NODE.IfStmt: {
        const test = this.evaluate(node.test, env);
        if (this.truthy(test)) this.execute(node.consequent, env);
        else if (node.alternate) this.execute(node.alternate, env);
        return;
      }
      case NODE.WhileStmt: {
        while (this.truthy(this.evaluate(node.test, env))) {
          try { this.execute(node.body, env); }
          catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return;
      }
      case NODE.ForStmt: {
        const iter = this.evaluate(node.iterable, env);
        if (!Array.isArray(iter)) throw new Error('for necesită iterabil (listă)');
        for (const item of iter) {
          const sub = new Environment(env);
          sub.define(node.varName, item);
          try { this.execute(node.body, sub); }
          catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return;
      }
      case NODE.ReturnStmt: {
        throw new ReturnSignal(node.argument ? this.evaluate(node.argument, env) : null);
      }
      case NODE.BreakStmt: throw new BreakSignal();
      case NODE.ContinueStmt: throw new ContinueSignal();
      case NODE.Block: {
        const sub = new Environment(env);
        for (const s of node.body) this.execute(s, sub);
        return;
      }
      case NODE.ExprStmt:
        return this.evaluate(node.expression, env);
      default:
        this.evaluate(node, env);
    }
  }

  // --------------------------------------------------------------------------
  // Evaluate expression
  // --------------------------------------------------------------------------
  evaluate(node, env) {
    if (++this.steps > this.maxSteps) throw new Error('Limita de pași depășită');
    if (!node) return null;
    switch (node.type) {
      case NODE.Literal: return node.value;
      case NODE.QuantityLiteral: return new Quantity(node.value, node.unit);
      case NODE.Identifier: return env.get(node.name);
      case NODE.ArrayLiteral: return node.elements.map(e => this.evaluate(e, env));
      case NODE.ObjectLiteral: {
        const obj = {};
        for (const p of node.properties) obj[p.key] = this.evaluate(p.value, env);
        return obj;
      }
      case NODE.UnaryExpr: {
        const v = this.evaluate(node.argument, env);
        if (node.op === '-') return -v;
        if (node.op === 'not') return !this.truthy(v);
        return v;
      }
      case NODE.BinaryExpr: {
        const l = this.evaluate(node.left, env);
        const r = this.evaluate(node.right, env);
        return this.binop(node.op, l, r);
      }
      case NODE.LogicalExpr: {
        const l = this.evaluate(node.left, env);
        if (node.op === 'and') return this.truthy(l) ? this.evaluate(node.right, env) : l;
        if (node.op === 'or')  return this.truthy(l) ? l : this.evaluate(node.right, env);
        return l;
      }
      case NODE.AssignExpr: {
        const val = this.evaluate(node.value, env);
        if (node.target.type === NODE.Identifier) {
          if (env.has(node.target.name)) env.assign(node.target.name, val);
          else env.define(node.target.name, val);
        } else if (node.target.type === NODE.MemberExpr) {
          const obj = this.evaluate(node.target.object, env);
          obj[node.target.property] = val;
        } else if (node.target.type === NODE.IndexExpr) {
          const obj = this.evaluate(node.target.object, env);
          const idx = this.evaluate(node.target.index, env);
          obj[idx] = val;
        }
        return val;
      }
      case NODE.MemberExpr: {
        const obj = this.evaluate(node.object, env);
        if (obj === null || obj === undefined) throw new Error(`Acces pe null: .${node.property}`);
        return obj[node.property];
      }
      case NODE.IndexExpr: {
        const obj = this.evaluate(node.object, env);
        const idx = this.evaluate(node.index, env);
        return obj[idx];
      }
      case NODE.CallExpr: {
        const callee = this.evaluate(node.callee, env);
        const args = node.args.map(a => this.evaluate(a, env));
        if (typeof callee !== 'function') throw new Error(`Nu este apelabil: ${this.stringify(callee)}`);
        return callee(...args);
      }
      case NODE.PipeExpr: {
        // x | f  ≡  f(x)
        const l = this.evaluate(node.left, env);
        const r = this.evaluate(node.right, env);
        if (typeof r === 'function') return r(l);
        throw new Error('Partea dreaptă a | trebuie să fie funcție');
      }
      case NODE.DifferentiateStmt: {
        // folosit și ca expresie
        const s = this.evaluate(node.source, env);
        const t = this.evaluate(node.target, env);
        this.logEvent('differentiate', `${this.stringify(s)} → ${this.stringify(t)}`);
        return t;
      }
      default:
        throw new Error(`Nod neașteptat în evaluate: ${node.type}`);
    }
  }

  binop(op, l, r) {
    // aritmetică pe Quantity
    if (l instanceof Quantity || r instanceof Quantity) {
      const lv = l instanceof Quantity ? l.value : l;
      const rv = r instanceof Quantity ? r.value : r;
      const unit = (l instanceof Quantity ? l.unit : null) || (r instanceof Quantity ? r.unit : null);
      const v = this.numop(op, lv, rv);
      if (typeof v === 'number' && unit) return new Quantity(v, unit);
      return v;
    }
    return this.numop(op, l, r);
  }

  numop(op, l, r) {
    switch (op) {
      case '+': return (typeof l === 'string' || typeof r === 'string') ? (''+l+r) : l + r;
      case '-': return l - r;
      case '*': return l * r;
      case '/': return l / r;
      case '%': return l % r;
      case '**': return l ** r;
      case '==': return l === r;
      case '!=': return l !== r;
      case '<':  return l < r;
      case '>':  return l > r;
      case '<=': return l <= r;
      case '>=': return l >= r;
      default: throw new Error(`Operator necunoscut: ${op}`);
    }
  }

  truthy(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') return v.length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return Boolean(v);
  }

  makeFunction(node, closureEnv) {
    const self = this;
    return function (...args) {
      const callEnv = new Environment(closureEnv);
      node.params.forEach((p, i) => callEnv.define(p, args[i]));
      try {
        self.execute(node.body, callEnv);
      } catch (e) {
        if (e instanceof ReturnSignal) return e.value;
        throw e;
      }
      return null;
    };
  }

  // --------------------------------------------------------------------------
  // Acțiuni imunologice
  // --------------------------------------------------------------------------
  runAction(node, env) {
    const subj = this.evaluate(node.subject, env);
    const mods = {};
    for (const k of Object.keys(node.modifiers)) mods[k] = this.evaluate(node.modifiers[k], env);
    const subjName = subj?.name || this.stringify(subj);
    let desc;
    switch (node.action.toLowerCase()) {
      case 'activate':
        desc = `Activare ${subjName}` + (mods.with ? ` cu ${this.stringify(mods.with)}` : '');
        break;
      case 'inhibit':
        desc = `Inhibiție ${subjName}` + (mods.by ? ` prin ${this.stringify(mods.by)}` : '');
        break;
      case 'secrete':
        desc = `${subjName} secretă ${mods.with ? this.stringify(mods.with) : ''}`;
        break;
      case 'bind':
        desc = `${subjName} leagă ${mods.to ? this.stringify(mods.to) : ''}`;
        break;
      case 'kill':
        desc = `${subjName} ucis` + (mods.by ? ` de ${this.stringify(mods.by)}` : '');
        break;
      case 'present':
        desc = `${subjName} prezintă antigen` + (mods.on ? ` pe ${this.stringify(mods.on)}` : '');
        break;
      case 'recruit':
        desc = `Recrutare ${subjName}` + (mods.via ? ` via ${this.stringify(mods.via)}` : '');
        break;
      case 'migrate':
        desc = `${subjName} migrează` + (mods.to ? ` în ${this.stringify(mods.to)}` : '');
        break;
      case 'express':
        desc = `${subjName} exprimă ${mods.with ? this.stringify(mods.with) : ''}`;
        break;
      case 'differentiate':
        desc = `${subjName} se diferențiază` + (mods.into ? ` în ${this.stringify(mods.into)}` : '');
        break;
      default:
        desc = `${node.action} ${subjName}`;
    }
    this.logEvent(node.action.toLowerCase(), desc);
    return desc;
  }

  runSimulate(node, env) {
    const target = this.evaluate(node.target, env);
    const duration = node.duration ? this.evaluate(node.duration, env) : new Quantity(7, 'days');
    const targetName = target?.name || this.stringify(target);
    const durStr = duration instanceof Quantity ? duration.toString() : this.stringify(duration);
    this.logEvent('simulate', `Simulare răspuns la ${targetName} pentru ${durStr}`);

    // Simulare simplificată: derulez câteva etape tipice
    const steps = [
      `Detectare ${targetName} de către PRR (TLR, NLR, RLR) pe celulele rezidente`,
      `Activare M1 și DC → eliberare citokine pro-inflamatorii (IL-6, TNF-α, IL-12)`,
      `Recrutare neutrofile via CXCL8 și monocite via CCL2`,
      `DC migrează în ganglion → prezintă antigen către LT naive`,
      `Activare LT CD4+ → diferențiere spre Th1 (IL-12) sau Th17 (IL-6/IL-23)`,
      `LT CD8+ proliferează → CTL efectorii pleacă în țesut`,
      `Tfh + LB în centre germinale → SHM/CSR → plasmocite IgG`,
      `Răspuns memorie stabilit; populații contractate prin apoptoză`
    ];
    steps.forEach((s, i) => this.logEvent('step', `Ziua ${i + 1}: ${s}`));
    return target;
  }

  logEvent(type, message) {
    const ev = { type, message, time: this.bioState.time++ };
    this.events.push(ev);
    try { this.onEvent(ev); } catch { /* ignoră */ }
  }
}
