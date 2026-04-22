// ============================================================================
// views/ide.js — ImmunoScript IDE (editor + executor)
// ============================================================================

import { Lexer } from '../../dsl/lexer.js';
import { Parser } from '../../dsl/parser.js';
import { Interpreter } from '../../dsl/interpreter.js';

const EXAMPLE_SCRIPT = `# ============================================================
# ImmunoScript — exemplu demonstrativ
# Demonstrează declarații de celule, citokine și simulări
# ============================================================

print("=== ImunoMap IDE ===")
print("Explorare obiecte încorporate:")

# Obiecte din stdlib — accesibile direct
describe(IL-2)
describe(TCD4)
describe(MHC_I)

# ------ Declarare celulă personalizată ------
cell engineeredTCell {
    markers: ["CD3", "CD8", "CAR-CD19"],
    cytokines: ["IFN-γ", "TNF-α", "IL-2"],
    functions: ["Citotoxicitate anti-CD19+", "Persistență in vivo"],
    origin: "Lentivirus transdus ex vivo"
}

# ------ Simulare diferențiere cu sintaxă natural ------
let my_Th1 = differentiate(TCD4, { with: [IL-12, IFN-γ] })
describe(my_Th1)

# ------ Acțiune imunologică declarativă ------
activate macrofag with IFN-γ
secrete Th1 with IFN-γ
kill celula_infectată by TCD8

# ------ Assay în laborator ------
let elisa_result = ELISA({ target: IL-6, sample: "ser pacient" })
describe(elisa_result)

let flow_data = flow_cytometry("PBMC", [CD3, CD4, CD8, CD19, CD56])
describe(flow_data)

let pcr_data = PCR({ target: "BCR-ABL", cycles: 40 })
describe(pcr_data)

# ------ Simulare completă răspuns imun ------
print("")
print("=== Simulare: răspuns la SARS-CoV-2, 10 zile ===")
simulate_response("SARS-CoV-2", 10)

# ------ Iterare peste colecții ------
print("")
print("Primele 5 citokine din stdlib:")
let i = 0
for ck in CYTOKINES {
    if i < 5 {
        print("  -", ck.name)
        i = i + 1
    }
}

# ------ Funcție definită de utilizator ------
fn calculate_KD(k_on, k_off) {
    return k_off / k_on
}
let KD = calculate_KD(1e6, 1e-3)
print("KD calculat:", KD, "M")
`;

export function initIDE() {
  const editor = document.getElementById('code-editor');
  const consoleEl = document.getElementById('ide-console');

  // Adaugă număr pentru tab-ul cu 2 spații
  editor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      editor.value = editor.value.substring(0, start) + '  ' + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + 2;
    }
  });

  document.getElementById('btn-run').addEventListener('click', () => runCode(editor, consoleEl));
  document.getElementById('btn-clear').addEventListener('click', () => { consoleEl.innerHTML = ''; });
  document.getElementById('btn-example').addEventListener('click', () => {
    editor.value = EXAMPLE_SCRIPT;
    consoleEl.innerHTML = '<span class="log-line log-ok">Exemplu încărcat. Apasă ▶ Rulează.</span>';
  });
  document.getElementById('btn-save').addEventListener('click', () => {
    const code = editor.value;
    const blob = new Blob([code], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'script.imuno';
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

function runCode(editor, consoleEl) {
  const source = editor.value;
  consoleEl.innerHTML = '';
  const log = (msg, cls = 'log-line') => {
    const el = document.createElement('div');
    el.className = 'log-line ' + cls;
    el.textContent = msg;
    consoleEl.appendChild(el);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  };

  log('⏳ Rulare...', 'log-ok');
  const t0 = performance.now();
  try {
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();
    const parser = new Parser(tokens);
    const ast = parser.parse();
    const interp = new Interpreter({
      onEvent: (ev) => {
        log(`[${ev.type}] ${ev.message}`, ev.type === 'step' ? 'log-step' : 'log-evt');
      }
    });
    const result = interp.run(ast);
    consoleEl.innerHTML = ''; // clean "Rulare..." and events (will be re-emitted below)
    for (const line of result.output) log(line);
    for (const ev of result.events) {
      log(`[${ev.type}] ${ev.message}`, ev.type === 'step' ? 'log-step' : 'log-evt');
    }
    const dt = (performance.now() - t0).toFixed(1);
    log(`✓ Terminat în ${dt} ms (${result.events.length} evenimente)`, 'log-ok');
  } catch (e) {
    log('✗ ' + e.message, 'log-err');
    console.error(e);
  }
}
