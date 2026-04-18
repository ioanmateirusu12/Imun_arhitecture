// ============================================================================
// dsl/parser.js — Parser pentru ImmunoScript
// ============================================================================
// Parser de tip recursive descent. Consumă tokenurile produse de Lexer și
// produce un AST (Abstract Syntax Tree) pe care îl va evalua Interpreter-ul.
// ============================================================================

import { TOKEN } from './lexer.js';

// ----------------------------------------------------------------------------
// Tipuri de noduri AST
// ----------------------------------------------------------------------------
export const NODE = Object.freeze({
  Program: 'Program',
  // Declarations
  VarDecl: 'VarDecl', FnDecl: 'FnDecl',
  CellDecl: 'CellDecl', CytokineDecl: 'CytokineDecl',
  AntibodyDecl: 'AntibodyDecl', PathogenDecl: 'PathogenDecl',
  ImportDecl: 'ImportDecl',
  AssayBlock: 'AssayBlock',
  // Statements
  ExprStmt: 'ExprStmt', Block: 'Block',
  IfStmt: 'IfStmt', WhileStmt: 'WhileStmt', ForStmt: 'ForStmt',
  ReturnStmt: 'ReturnStmt', BreakStmt: 'BreakStmt', ContinueStmt: 'ContinueStmt',
  SimulateStmt: 'SimulateStmt',
  ActionStmt: 'ActionStmt',  // activate/inhibit/secrete/bind/etc.
  DifferentiateStmt: 'DifferentiateStmt',
  // Expressions
  BinaryExpr: 'BinaryExpr', UnaryExpr: 'UnaryExpr', LogicalExpr: 'LogicalExpr',
  AssignExpr: 'AssignExpr', CallExpr: 'CallExpr', MemberExpr: 'MemberExpr',
  IndexExpr: 'IndexExpr', PipeExpr: 'PipeExpr',
  Identifier: 'Identifier', Literal: 'Literal',
  ArrayLiteral: 'ArrayLiteral', ObjectLiteral: 'ObjectLiteral',
  QuantityLiteral: 'QuantityLiteral'  // număr + unitate (50ng, 10uM)
});

// ----------------------------------------------------------------------------
// Parser
// ----------------------------------------------------------------------------
export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  error(msg, tk = null) {
    const t = tk || this.peek();
    throw new Error(`Eroare de sintaxă la linia ${t.line}: ${msg} (am găsit '${t.type}')`);
  }

  // -- utilitare --
  peek(off = 0) { return this.tokens[this.pos + off]; }
  advance() { return this.tokens[this.pos++]; }
  check(type) { return this.peek().type === type; }
  checkAny(...types) { return types.includes(this.peek().type); }
  match(...types) {
    if (types.includes(this.peek().type)) { this.advance(); return true; }
    return false;
  }
  expect(type, msg) {
    if (this.check(type)) return this.advance();
    this.error(msg || `Așteptam ${type}`);
  }
  skipNewlines() { while (this.check(TOKEN.NEWLINE)) this.advance(); }

  // --------------------------------------------------------------------------
  // Entry point
  // --------------------------------------------------------------------------
  parse() {
    const body = [];
    this.skipNewlines();
    while (!this.check(TOKEN.EOF)) {
      const stmt = this.statement();
      if (stmt) body.push(stmt);
      this.skipNewlines();
    }
    return { type: NODE.Program, body };
  }

  // --------------------------------------------------------------------------
  // Statements
  // --------------------------------------------------------------------------
  statement() {
    const t = this.peek().type;
    switch (t) {
      case TOKEN.LET:
      case TOKEN.CONST:     return this.varDecl();
      case TOKEN.FN:        return this.fnDecl();
      case TOKEN.IF:        return this.ifStmt();
      case TOKEN.WHILE:     return this.whileStmt();
      case TOKEN.FOR:       return this.forStmt();
      case TOKEN.RETURN:    return this.returnStmt();
      case TOKEN.BREAK:     this.advance(); return { type: NODE.BreakStmt };
      case TOKEN.CONTINUE:  this.advance(); return { type: NODE.ContinueStmt };
      case TOKEN.LBRACE:    return this.block();
      case TOKEN.IMPORT:    return this.importDecl();
      case TOKEN.CELL:      return this.bioDecl('cell', NODE.CellDecl);
      case TOKEN.CYTOKINE:  return this.bioDecl('cytokine', NODE.CytokineDecl);
      case TOKEN.ANTIBODY:  return this.bioDecl('antibody', NODE.AntibodyDecl);
      case TOKEN.PATHOGEN:  return this.bioDecl('pathogen', NODE.PathogenDecl);
      case TOKEN.ASSAY:     return this.assayBlock();
      case TOKEN.SIMULATE:  return this.simulateStmt();
      case TOKEN.ACTIVATE:
      case TOKEN.INHIBIT:
      case TOKEN.SECRETE:
      case TOKEN.BIND:
      case TOKEN.DIFFERENTIATE:
      case TOKEN.KILL:
      case TOKEN.PRESENT:
      case TOKEN.RECRUIT:
      case TOKEN.MIGRATE:
      case TOKEN.EXPRESS:   return this.actionStmt();
      default:              return this.exprStmt();
    }
  }

  varDecl() {
    const kind = this.advance().type === TOKEN.CONST ? 'const' : 'let';
    const name = this.expect(TOKEN.IDENT, 'Așteptam nume de variabilă').value;
    let init = null;
    if (this.match(TOKEN.ASSIGN)) init = this.expression();
    return { type: NODE.VarDecl, kind, name, init };
  }

  fnDecl() {
    this.advance(); // fn
    const name = this.expect(TOKEN.IDENT, 'Nume funcție').value;
    this.expect(TOKEN.LPAREN, 'Așteptam (');
    const params = [];
    if (!this.check(TOKEN.RPAREN)) {
      do {
        this.skipNewlines();
        params.push(this.expect(TOKEN.IDENT, 'Parametru').value);
      } while (this.match(TOKEN.COMMA));
    }
    this.expect(TOKEN.RPAREN, 'Așteptam )');
    this.skipNewlines();
    const body = this.block();
    return { type: NODE.FnDecl, name, params, body };
  }

  ifStmt() {
    this.advance(); // if
    const test = this.expression();
    this.skipNewlines();
    const consequent = this.block();
    let alternate = null;
    this.skipNewlines();
    if (this.match(TOKEN.ELIF)) {
      this.pos--; // re-consume ca if
      this.tokens[this.pos] = { ...this.tokens[this.pos], type: TOKEN.IF };
      alternate = this.ifStmt();
    } else if (this.match(TOKEN.ELSE)) {
      this.skipNewlines();
      alternate = this.block();
    }
    return { type: NODE.IfStmt, test, consequent, alternate };
  }

  whileStmt() {
    this.advance();
    const test = this.expression();
    this.skipNewlines();
    const body = this.block();
    return { type: NODE.WhileStmt, test, body };
  }

  forStmt() {
    this.advance();
    const varName = this.expect(TOKEN.IDENT, 'Variabilă for').value;
    this.expect(TOKEN.IN, 'Așteptam "in"');
    const iterable = this.expression();
    this.skipNewlines();
    const body = this.block();
    return { type: NODE.ForStmt, varName, iterable, body };
  }

  returnStmt() {
    this.advance();
    let arg = null;
    if (!this.checkAny(TOKEN.NEWLINE, TOKEN.SEMI, TOKEN.RBRACE, TOKEN.EOF)) {
      arg = this.expression();
    }
    return { type: NODE.ReturnStmt, argument: arg };
  }

  block() {
    this.expect(TOKEN.LBRACE, 'Așteptam {');
    const body = [];
    this.skipNewlines();
    while (!this.check(TOKEN.RBRACE) && !this.check(TOKEN.EOF)) {
      const s = this.statement();
      if (s) body.push(s);
      this.skipNewlines();
    }
    this.expect(TOKEN.RBRACE, 'Așteptam }');
    return { type: NODE.Block, body };
  }

  importDecl() {
    this.advance(); // import
    let names = null;
    if (this.match(TOKEN.LBRACE)) {
      names = [];
      do {
        this.skipNewlines();
        names.push(this.expect(TOKEN.IDENT, 'Nume import').value);
      } while (this.match(TOKEN.COMMA));
      this.skipNewlines();
      this.expect(TOKEN.RBRACE, 'Așteptam }');
    }
    this.expect(TOKEN.FROM, 'Așteptam "from"');
    const source = this.expect(TOKEN.STRING, 'Sursa ca string').value;
    return { type: NODE.ImportDecl, names, source };
  }

  // Declarații imunologice — cell/cytokine/antibody/pathogen X { field: value, ... }
  bioDecl(keyword, nodeType) {
    this.advance(); // consume keyword
    const name = this.expect(TOKEN.IDENT, `Nume pentru ${keyword}`).value;
    let props = null;
    if (this.match(TOKEN.LBRACE)) {
      props = [];
      this.skipNewlines();
      while (!this.check(TOKEN.RBRACE)) {
        const key = (this.check(TOKEN.IDENT) || this.check(TOKEN.STRING))
          ? this.advance().value
          : this.error('Așteptam cheie');
        this.expect(TOKEN.COLON, 'Așteptam :');
        const value = this.expression();
        props.push({ key, value });
        this.match(TOKEN.COMMA);
        this.skipNewlines();
      }
      this.expect(TOKEN.RBRACE, 'Așteptam }');
    }
    return { type: nodeType, name, props };
  }

  assayBlock() {
    this.advance(); // assay
    const name = this.check(TOKEN.IDENT) ? this.advance().value : 'assay';
    this.expect(TOKEN.LBRACE, 'Așteptam { pentru assay');
    const props = [];
    this.skipNewlines();
    while (!this.check(TOKEN.RBRACE)) {
      const key = this.expect(TOKEN.IDENT, 'Cheie assay').value;
      this.expect(TOKEN.COLON, ':');
      const value = this.expression();
      props.push({ key, value });
      this.match(TOKEN.COMMA);
      this.skipNewlines();
    }
    this.expect(TOKEN.RBRACE, '}');
    return { type: NODE.AssayBlock, name, props };
  }

  simulateStmt() {
    this.advance(); // simulate
    const target = this.expression();
    let duration = null;
    if (this.peek().type === TOKEN.IDENT && this.peek().value === 'for') {
      this.advance();
      duration = this.expression();
    }
    return { type: NODE.SimulateStmt, target, duration };
  }

  // Acțiuni imunologice: activate X with Y; X secretes Y; kill X; present X on Y;
  actionStmt() {
    const actionTok = this.advance();
    const action = actionTok.value || actionTok.type.toLowerCase();
    const subject = this.expression();
    const modifiers = {};
    while (this.peek().type === TOKEN.IDENT &&
           ['with', 'on', 'by', 'to', 'via', 'using', 'into'].includes(this.peek().value)) {
      const mod = this.advance().value;
      modifiers[mod] = this.expression();
    }
    return { type: NODE.ActionStmt, action, subject, modifiers };
  }

  exprStmt() {
    const expr = this.expression();
    return { type: NODE.ExprStmt, expression: expr };
  }

  // --------------------------------------------------------------------------
  // Expressions — cu precedență
  // --------------------------------------------------------------------------
  expression() { return this.assignment(); }

  assignment() {
    const left = this.pipe();
    if (this.match(TOKEN.ASSIGN)) {
      const value = this.assignment();
      return { type: NODE.AssignExpr, target: left, value };
    }
    // X -> Y (diferențiere sau flow)
    if (this.match(TOKEN.ARROW)) {
      const right = this.assignment();
      return { type: NODE.DifferentiateStmt, source: left, target: right };
    }
    return left;
  }

  pipe() {
    let left = this.logicalOr();
    while (this.match(TOKEN.PIPE)) {
      const right = this.logicalOr();
      left = { type: NODE.PipeExpr, left, right };
    }
    return left;
  }

  logicalOr() {
    let left = this.logicalAnd();
    while (this.match(TOKEN.OR)) {
      const right = this.logicalAnd();
      left = { type: NODE.LogicalExpr, op: 'or', left, right };
    }
    return left;
  }

  logicalAnd() {
    let left = this.equality();
    while (this.match(TOKEN.AND)) {
      const right = this.equality();
      left = { type: NODE.LogicalExpr, op: 'and', left, right };
    }
    return left;
  }

  equality() {
    let left = this.comparison();
    while (this.checkAny(TOKEN.EQ, TOKEN.NEQ)) {
      const op = this.advance().type === TOKEN.EQ ? '==' : '!=';
      const right = this.comparison();
      left = { type: NODE.BinaryExpr, op, left, right };
    }
    return left;
  }

  comparison() {
    let left = this.term();
    while (this.checkAny(TOKEN.LT, TOKEN.GT, TOKEN.LE, TOKEN.GE)) {
      const op = this.advance().type;
      const map = { LT: '<', GT: '>', LE: '<=', GE: '>=' };
      const right = this.term();
      left = { type: NODE.BinaryExpr, op: map[op], left, right };
    }
    return left;
  }

  term() {
    let left = this.factor();
    while (this.checkAny(TOKEN.PLUS, TOKEN.MINUS)) {
      const op = this.advance().type === TOKEN.PLUS ? '+' : '-';
      const right = this.factor();
      left = { type: NODE.BinaryExpr, op, left, right };
    }
    return left;
  }

  factor() {
    let left = this.power();
    while (this.checkAny(TOKEN.MUL, TOKEN.DIV, TOKEN.MOD)) {
      const opT = this.advance().type;
      const map = { MUL: '*', DIV: '/', MOD: '%' };
      const right = this.power();
      left = { type: NODE.BinaryExpr, op: map[opT], left, right };
    }
    return left;
  }

  power() {
    let left = this.unary();
    if (this.match(TOKEN.POW)) {
      const right = this.power(); // asociativitate dreapta
      return { type: NODE.BinaryExpr, op: '**', left, right };
    }
    return left;
  }

  unary() {
    if (this.match(TOKEN.NOT)) return { type: NODE.UnaryExpr, op: 'not', argument: this.unary() };
    if (this.match(TOKEN.MINUS)) return { type: NODE.UnaryExpr, op: '-', argument: this.unary() };
    if (this.match(TOKEN.PLUS)) return this.unary();
    return this.call();
  }

  call() {
    let expr = this.primary();
    while (true) {
      if (this.match(TOKEN.LPAREN)) {
        const args = [];
        if (!this.check(TOKEN.RPAREN)) {
          do {
            this.skipNewlines();
            args.push(this.expression());
          } while (this.match(TOKEN.COMMA));
        }
        this.skipNewlines();
        this.expect(TOKEN.RPAREN, ')');
        expr = { type: NODE.CallExpr, callee: expr, args };
      } else if (this.match(TOKEN.DOT)) {
        const prop = this.expect(TOKEN.IDENT, 'Nume proprietate').value;
        expr = { type: NODE.MemberExpr, object: expr, property: prop };
      } else if (this.match(TOKEN.LBRACK)) {
        const idx = this.expression();
        this.expect(TOKEN.RBRACK, ']');
        expr = { type: NODE.IndexExpr, object: expr, index: idx };
      } else {
        break;
      }
    }
    return expr;
  }

  primary() {
    const tk = this.peek();
    switch (tk.type) {
      case TOKEN.NUMBER: {
        this.advance();
        if (tk.value.unit) return { type: NODE.QuantityLiteral, value: tk.value.value, unit: tk.value.unit };
        return { type: NODE.Literal, value: tk.value.value };
      }
      case TOKEN.STRING: this.advance(); return { type: NODE.Literal, value: tk.value };
      case TOKEN.TRUE:   this.advance(); return { type: NODE.Literal, value: true };
      case TOKEN.FALSE:  this.advance(); return { type: NODE.Literal, value: false };
      case TOKEN.NULL:   this.advance(); return { type: NODE.Literal, value: null };
      case TOKEN.IDENT:  this.advance(); return { type: NODE.Identifier, name: tk.value };
      case TOKEN.LPAREN: {
        this.advance();
        this.skipNewlines();
        const e = this.expression();
        this.skipNewlines();
        this.expect(TOKEN.RPAREN, ')');
        return e;
      }
      case TOKEN.LBRACK: {
        this.advance();
        const elements = [];
        this.skipNewlines();
        if (!this.check(TOKEN.RBRACK)) {
          do {
            this.skipNewlines();
            elements.push(this.expression());
          } while (this.match(TOKEN.COMMA));
        }
        this.skipNewlines();
        this.expect(TOKEN.RBRACK, ']');
        return { type: NODE.ArrayLiteral, elements };
      }
      case TOKEN.LBRACE: {
        this.advance();
        const props = [];
        this.skipNewlines();
        if (!this.check(TOKEN.RBRACE)) {
          do {
            this.skipNewlines();
            const key = this.check(TOKEN.IDENT) || this.check(TOKEN.STRING)
              ? this.advance().value
              : this.error('Cheie obiect');
            this.expect(TOKEN.COLON, ':');
            const value = this.expression();
            props.push({ key, value });
          } while (this.match(TOKEN.COMMA));
        }
        this.skipNewlines();
        this.expect(TOKEN.RBRACE, '}');
        return { type: NODE.ObjectLiteral, properties: props };
      }
      default: this.error(`Token neașteptat: ${tk.type}`);
    }
  }
}
