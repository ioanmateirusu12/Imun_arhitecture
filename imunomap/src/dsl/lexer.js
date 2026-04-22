// ============================================================================
// dsl/lexer.js — Tokenizer pentru ImmunoScript
// ============================================================================
// ImmunoScript este un limbaj de programare cu sintaxă inspirată de Python și
// biologia computațională, specializat pentru:
//   - Declararea celulelor imune, citokinelor, anticorpilor, antigenelor
//   - Simularea răspunsurilor imune (activare, diferențiere, ucidere)
//   - Modelarea tehnicilor de laborator (ELISA, citometrie, PCR)
//   - Analiza loci-lor imune (V(D)J, HLA)
// ============================================================================

export const TOKEN = Object.freeze({
  // Literali
  NUMBER: 'NUMBER', STRING: 'STRING', IDENT: 'IDENT',
  TRUE: 'TRUE', FALSE: 'FALSE', NULL: 'NULL',

  // Keywords generale
  LET: 'LET', CONST: 'CONST', FN: 'FN', RETURN: 'RETURN',
  IF: 'IF', ELIF: 'ELIF', ELSE: 'ELSE',
  WHILE: 'WHILE', FOR: 'FOR', IN: 'IN', BREAK: 'BREAK', CONTINUE: 'CONTINUE',
  IMPORT: 'IMPORT', FROM: 'FROM', AS: 'AS',

  // Keywords imunologice (primitive)
  CELL: 'CELL', CYTOKINE: 'CYTOKINE', ANTIBODY: 'ANTIBODY',
  ANTIGEN: 'ANTIGEN', RECEPTOR: 'RECEPTOR', MHC: 'MHC',
  PATHOGEN: 'PATHOGEN', CLONE: 'CLONE', TISSUE: 'TISSUE',
  ACTIVATE: 'ACTIVATE', INHIBIT: 'INHIBIT', SECRETE: 'SECRETE',
  BIND: 'BIND', DIFFERENTIATE: 'DIFFERENTIATE', KILL: 'KILL',
  PRESENT: 'PRESENT', RECRUIT: 'RECRUIT', MIGRATE: 'MIGRATE',
  EXPRESS: 'EXPRESS', SIMULATE: 'SIMULATE', ASSAY: 'ASSAY',

  // Operatori & punctuație
  ASSIGN: 'ASSIGN', ARROW: 'ARROW', FARROW: 'FARROW',
  PLUS: 'PLUS', MINUS: 'MINUS', MUL: 'MUL', DIV: 'DIV', MOD: 'MOD', POW: 'POW',
  EQ: 'EQ', NEQ: 'NEQ', LT: 'LT', GT: 'GT', LE: 'LE', GE: 'GE',
  AND: 'AND', OR: 'OR', NOT: 'NOT',
  LPAREN: 'LPAREN', RPAREN: 'RPAREN',
  LBRACE: 'LBRACE', RBRACE: 'RBRACE',
  LBRACK: 'LBRACK', RBRACK: 'RBRACK',
  COMMA: 'COMMA', COLON: 'COLON', SEMI: 'SEMI', DOT: 'DOT', PIPE: 'PIPE',
  AT: 'AT', QUESTION: 'QUESTION',

  // Structurale
  NEWLINE: 'NEWLINE', EOF: 'EOF'
});

const KEYWORDS = {
  'let': TOKEN.LET, 'const': TOKEN.CONST, 'fn': TOKEN.FN, 'return': TOKEN.RETURN,
  'if': TOKEN.IF, 'elif': TOKEN.ELIF, 'else': TOKEN.ELSE,
  'while': TOKEN.WHILE, 'for': TOKEN.FOR, 'in': TOKEN.IN,
  'break': TOKEN.BREAK, 'continue': TOKEN.CONTINUE,
  'import': TOKEN.IMPORT, 'from': TOKEN.FROM, 'as': TOKEN.AS,
  'true': TOKEN.TRUE, 'false': TOKEN.FALSE, 'null': TOKEN.NULL,
  'and': TOKEN.AND, 'or': TOKEN.OR, 'not': TOKEN.NOT,

  // Imunologice
  'cell': TOKEN.CELL, 'cytokine': TOKEN.CYTOKINE, 'antibody': TOKEN.ANTIBODY,
  'antigen': TOKEN.ANTIGEN, 'receptor': TOKEN.RECEPTOR, 'mhc': TOKEN.MHC,
  'pathogen': TOKEN.PATHOGEN, 'clone': TOKEN.CLONE, 'tissue': TOKEN.TISSUE,
  'activate': TOKEN.ACTIVATE, 'inhibit': TOKEN.INHIBIT,
  'secrete': TOKEN.SECRETE, 'bind': TOKEN.BIND,
  'differentiate': TOKEN.DIFFERENTIATE, 'kill': TOKEN.KILL,
  'present': TOKEN.PRESENT, 'recruit': TOKEN.RECRUIT,
  'migrate': TOKEN.MIGRATE, 'express': TOKEN.EXPRESS,
  'simulate': TOKEN.SIMULATE, 'assay': TOKEN.ASSAY
};

export class Lexer {
  constructor(source) {
    this.src = source;
    this.pos = 0;
    this.line = 1;
    this.col = 1;
    this.tokens = [];
  }

  error(msg) {
    throw new Error(`Eroare lexicală la linia ${this.line}, coloana ${this.col}: ${msg}`);
  }

  peek(offset = 0) { return this.src[this.pos + offset]; }
  advance() {
    const ch = this.src[this.pos++];
    if (ch === '\n') { this.line++; this.col = 1; } else { this.col++; }
    return ch;
  }
  match(expected) {
    if (this.peek() === expected) { this.advance(); return true; }
    return false;
  }

  addToken(type, value = null) {
    this.tokens.push({ type, value, line: this.line, col: this.col });
  }

  tokenize() {
    while (this.pos < this.src.length) {
      const ch = this.peek();

      // Whitespace (NU newline)
      if (ch === ' ' || ch === '\t' || ch === '\r') { this.advance(); continue; }

      // Newline (semnificativ pentru expresii multiline)
      if (ch === '\n') {
        this.advance();
        // Colapsăm newline-uri consecutive într-un singur token
        if (this.tokens.length > 0 && this.tokens[this.tokens.length - 1].type !== TOKEN.NEWLINE) {
          this.addToken(TOKEN.NEWLINE);
        }
        continue;
      }

      // Comentarii
      if (ch === '#' || (ch === '/' && this.peek(1) === '/')) {
        while (this.pos < this.src.length && this.peek() !== '\n') this.advance();
        continue;
      }
      if (ch === '/' && this.peek(1) === '*') {
        this.advance(); this.advance();
        while (this.pos < this.src.length && !(this.peek() === '*' && this.peek(1) === '/')) {
          this.advance();
        }
        if (this.pos >= this.src.length) this.error('Comentariu multi-linie neterminat');
        this.advance(); this.advance();
        continue;
      }

      // Numere
      if (this.isDigit(ch)) { this.readNumber(); continue; }

      // Stringuri
      if (ch === '"' || ch === "'") { this.readString(ch); continue; }

      // Identificatori / Keywords
      if (this.isAlpha(ch)) { this.readIdent(); continue; }

      // Operatori & punctuație
      this.readSymbol();
    }

    this.addToken(TOKEN.EOF);
    return this.tokens;
  }

  isDigit(ch) { return ch >= '0' && ch <= '9'; }
  isAlpha(ch) { return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_'; }
  isAlphaNum(ch) { return this.isAlpha(ch) || this.isDigit(ch); }

  readNumber() {
    let num = '';
    while (this.isDigit(this.peek())) num += this.advance();
    if (this.peek() === '.' && this.isDigit(this.peek(1))) {
      num += this.advance();
      while (this.isDigit(this.peek())) num += this.advance();
    }
    // Sufix opțional de unitate (ex. "50ng", "10uM") — tratat ca string atașat
    if (this.isAlpha(this.peek())) {
      let unit = '';
      while (this.isAlpha(this.peek())) unit += this.advance();
      this.addToken(TOKEN.NUMBER, { value: parseFloat(num), unit });
    } else {
      this.addToken(TOKEN.NUMBER, { value: parseFloat(num), unit: null });
    }
  }

  readString(quote) {
    this.advance(); // deschidere
    let str = '';
    while (this.pos < this.src.length && this.peek() !== quote) {
      if (this.peek() === '\\') {
        this.advance();
        const esc = this.advance();
        switch (esc) {
          case 'n': str += '\n'; break;
          case 't': str += '\t'; break;
          case 'r': str += '\r'; break;
          case '\\': str += '\\'; break;
          case '"': str += '"'; break;
          case "'": str += "'"; break;
          default: str += esc;
        }
      } else {
        str += this.advance();
      }
    }
    if (this.pos >= this.src.length) this.error('String neterminat');
    this.advance(); // închidere
    this.addToken(TOKEN.STRING, str);
  }

  readIdent() {
    let id = '';
    while (this.isAlphaNum(this.peek()) || this.peek() === '-') {
      // Permite CD markere gen CD4, CD8, HLA-DRB1 etc.
      id += this.advance();
    }
    const kw = KEYWORDS[id.toLowerCase()];
    if (kw) this.addToken(kw, id);
    else this.addToken(TOKEN.IDENT, id);
  }

  readSymbol() {
    const ch = this.advance();
    switch (ch) {
      case '+': this.addToken(TOKEN.PLUS); break;
      case '-':
        if (this.match('>')) this.addToken(TOKEN.ARROW);
        else this.addToken(TOKEN.MINUS);
        break;
      case '*':
        if (this.match('*')) this.addToken(TOKEN.POW);
        else this.addToken(TOKEN.MUL);
        break;
      case '/': this.addToken(TOKEN.DIV); break;
      case '%': this.addToken(TOKEN.MOD); break;
      case '=':
        if (this.match('=')) this.addToken(TOKEN.EQ);
        else if (this.match('>')) this.addToken(TOKEN.FARROW);
        else this.addToken(TOKEN.ASSIGN);
        break;
      case '!':
        if (this.match('=')) this.addToken(TOKEN.NEQ);
        else this.addToken(TOKEN.NOT);
        break;
      case '<':
        if (this.match('=')) this.addToken(TOKEN.LE);
        else this.addToken(TOKEN.LT);
        break;
      case '>':
        if (this.match('=')) this.addToken(TOKEN.GE);
        else this.addToken(TOKEN.GT);
        break;
      case '(': this.addToken(TOKEN.LPAREN); break;
      case ')': this.addToken(TOKEN.RPAREN); break;
      case '{': this.addToken(TOKEN.LBRACE); break;
      case '}': this.addToken(TOKEN.RBRACE); break;
      case '[': this.addToken(TOKEN.LBRACK); break;
      case ']': this.addToken(TOKEN.RBRACK); break;
      case ',': this.addToken(TOKEN.COMMA); break;
      case ':': this.addToken(TOKEN.COLON); break;
      case ';': this.addToken(TOKEN.SEMI); break;
      case '.': this.addToken(TOKEN.DOT); break;
      case '|': this.addToken(TOKEN.PIPE); break;
      case '@': this.addToken(TOKEN.AT); break;
      case '?': this.addToken(TOKEN.QUESTION); break;
      default: this.error(`Caracter neașteptat: '${ch}'`);
    }
  }
}
