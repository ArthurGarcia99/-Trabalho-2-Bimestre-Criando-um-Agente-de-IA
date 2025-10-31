// --- Funções utilitárias ---
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const strip = (s) => s.replace(/\s+/g, " ").trim();
const lc = (s) => s.toLowerCase();
const uniq = (arr) => Array.from(new Set(arr));
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    alert('Falha ao copiar: ' + e);
  }
};

// --- Tokenização e parsing da fórmula ---
function tokenizeFormula(src) {
  let s = src
    .replace(/<->|<=>/g, "↔")
    .replace(/->/g, "→")
    .replace(/\bxor\b/gi, "⊕")
    .replace(/\biff\b/gi, "↔")
    .replace(/\bimplies\b/gi, "→")
    .replace(/[\s\t\n]+/g, " ")
    .trim();

  const tokens = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === " ") { i++; continue; }
    if (/[A-Za-z]/.test(c)) {
      let j = i + 1;
      while (j < s.length && /[A-Za-z0-9_]/.test(s[j])) j++;
      tokens.push({ type: "id", value: s.slice(i, j).toUpperCase() });
      i = j; continue;
    }
    const map = {
      "¬": "NOT", "!": "NOT", "~": "NOT",
      "∧": "AND", "&": "AND", "^": "AND",
      "∨": "OR", "|": "OR", "v": "OR",
      "⊕": "XOR", "→": "IMP", "↔": "IFF",
      "(": "LP", ")": "RP"
    };
    if (map[c]) { tokens.push({ type: map[c], value: c }); i++; continue; }
    throw new Error(`Símbolo inválido: "${c}"`);
  }
  return tokens;
}

const PRECEDENCE = { IFF: 1, IMP: 2, OR: 3, XOR: 3, AND: 4, NOT: 5 };

function parseFormula(tokens) {
  let pos = 0;
  const peek = () => tokens[pos];
  const eat = () => tokens[pos++];

  function parseAtom() {
    const t = peek();
    if (!t) throw new Error('Fim inesperado');
    if (t.type === 'LP') {
      eat();
      const e = parseExpr(0);
      if (!peek() || peek().type !== 'RP') throw new Error('Parêntese não fechado');
      eat();
      return e;
    }
    if (t.type === 'NOT') { eat(); return { type: 'NOT', sub: parseAtom() }; }
    if (t.type === 'id') { eat(); return { type: 'ID', name: t.value }; }
    throw new Error(`Token inesperado: ${t.type}`);
  }

  function lbp(type) { return PRECEDENCE[type] || 0; }

  function parseExpr(minBp) {
    let left = parseAtom();
    while (true) {
      const t = peek();
      if (!t) break;
      if (["AND", "OR", "XOR", "IMP", "IFF"].includes(t.type) && lbp(t.type) >= minBp) {
        const op = t.type;
        eat();
        const right = parseExpr(lbp(op) + 1);
        left = { type: op, left, right };
        continue;
      }
      break;
    }
    return left;
  }

  const ast = parseExpr(0);
  if (pos !== tokens.length) throw new Error('Tokens extras após o fim da fórmula');
  return ast;
}

function astToFormula(ast) {
  const prec = (t) => PRECEDENCE[t] || 9;
  switch (ast.type) {
    case 'ID': return ast.name;
    case 'NOT': {
      const inner = ast.sub;
      const s = astToFormula(inner);
      const needs = prec(inner.type) > prec('NOT') ? false : inner.type !== 'ID';
      return `¬${needs ? `(${s})` : s}`;
    }
    default: {
      const opMap = { AND: '∧', OR: '∨', XOR: '⊕', IMP: '→', IFF: '↔' };
      const L = ast.left, R = ast.right;
      const l = astToFormula(L), r = astToFormula(R);
      const lp = prec(L.type) < prec(ast.type) ? `(${l})` : l;
      const rp = prec(R.type) < prec(ast.type) ? `(${r})` : r;
      return `${lp} ${opMap[ast.type]} ${rp}`;
    }
  }
}

// --- NL e dicionário ---
function normalizeNL(text) {
  let s = " " + lc(text) + " ";
  s = s.replace(/[.,;:!?]+/g, " ");
  s = s.replace(/\bmas\b/g, " e ");
  s = s.replace(/\bssi\b/g, " se e somente se ");
  s = s.replace(/\bnao\b/g, " não ");
  s = s.replace(/\bnão\b/g, " não ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function extractAtomsFromNL(text) {
  const s = normalizeNL(text);
  const CONNECTIVES = [" se e somente se ", " se ", " então ", " somente se ", " e ", " ou "];
  let parts = [s];
  for (const c of CONNECTIVES) parts = parts.flatMap(p => p.split(c));
  const clauses = uniq(parts.map(strip).filter(x => x.length > 0));
  return clauses.map(c => c.replace(/^não (é verdade que )?/i, "").trim());
}

function buildDictionaryFromNL(text) {
  const atoms = extractAtomsFromNL(text);
  const map = {};
  atoms.forEach((clause, idx) => {
    const letter = LETTERS[idx] || `P${idx + 1}`;
    map[letter] = clause;
  });
  return map;
}

function nlToFormula(text, dict) {
  let s = normalizeNL(text);
  const entries = Object.entries(dict).filter(([, v]) => v && v.trim().length).sort((a, b) => b[1].length - a[1].length);
  for (const [k, v] of entries) {
    const re = new RegExp(`\\b${escapeRegex(lc(v))}\\b`, "g");
    s = s.replace(re, ` ${k} `);
  }
  s = s.replace(/\bnão é verdade que\s+(\w+)\b/g, " ¬$1 ");
  s = s.replace(/\bse e somente se\b/g, " ↔ ");
  s = s.replace(/\bse\s+([^]+?)\s*então\s+([^]+)$/g, (m, p, q) => ` ( ${p} ) → ( ${q} ) `);
  s = s.replace(/\bou\s+(\w+)\s+ou\s+(\w+)\b/g, " ($1) ⊕ ($2) ");
  s = s.replace(/\se\b/g, " ∧ ");
  s = s.replace(/\bou\b/g, " ∨ ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

function realizePT(ast, dict) {
  const name = (id) => dict && dict[id] ? dict[id] : id;
  function paren(s) {
    if (/\b(e|ou|então|somente|ambos)\b|,/.test(lc(s))) return `(${s})`;
    return s;
  }
  function go(node) {
    switch (node.type) {
      case 'ID': return name(node.name);
      case 'NOT': return `Não é verdade que ${paren(go(node.sub))}`;
      case 'AND': return `${paren(go(node.left))} e ${paren(go(node.right))}`;
      case 'OR': return `${paren(go(node.left))} ou ${paren(go(node.right))}`;
      case 'XOR': return `${paren(go(node.left))} ou ${paren(go(node.right))} (mas não ambos)`;
      case 'IMP': return `Se ${paren(go(node.left))}, então ${paren(go(node.right))}`;
      case 'IFF': return `${paren(go(node.left))} se e somente se ${paren(go(node.right))}`;
    }
  }
  return go(ast);
}

// --- Interação e UI ---
const nlEl = document.getElementById('nl');
const formulaEl = document.getElementById('formula');
const dictListEl = document.getElementById('dictList');
const examplesEl = document.getElementById('examples');

let dict = { A: "está chovendo", B: "levarei guarda-chuva", C: "a rua está molhada" };

function renderDictUI() {
  dictListEl.innerHTML = '';
  const cur = dict;
  const entries = Object.entries(cur);
  if (entries.length === 0) {
    dictListEl.innerHTML = '<div class="muted small">Nenhum átomo definido.</div>';
    return;
  }
  for (const [k, v] of entries) {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '8px';
    row.style.alignItems = 'center';
    const span = document.createElement('div');
    span.style.width = '32px';
    span.style.fontFamily = 'monospace';
    span.textContent = k;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = v;
    input.style.flex = '1';
    input.oninput = (e) => { dict[k] = e.target.value; };
    const del = document.createElement('button');
    del.textContent = '✖';
    del.title = 'Remover';
    del.onclick = () => { delete dict[k]; renderDictUI(); };
    row.appendChild(span);
    row.appendChild(input);
    row.appendChild(del);
    dictListEl.appendChild(row);
  }
}

function addDict() {
  const next = LETTERS.find(L => !dict[L]);
  if (!next) return;
  dict[next] = '';
  renderDictUI();
}

function resetDict() {
  dict = { A: "está chovendo", B: "levarei guarda-chuva", C: "a rua está molhada" };
  renderDictUI();
}

const examples = [
  { nl: 'Se está chovendo, então levarei guarda-chuva.', dict: { A: 'está chovendo', B: 'levarei guarda-chuva' }, f: 'A → B' },
  { nl: 'Ou João estuda ou Maria passa (mas não ambos).', dict: { A: 'João estuda', B: 'Maria passa' }, f: 'A ⊕ B' },
  { nl: 'Não é verdade que a rua está molhada e está ventando.', dict: { A: 'a rua está molhada', B: 'está ventando' }, f: '¬(A ∧ B)' },
  { nl: 'Se Pedro vai ao cinema, então Ana vai ao teatro', dict: { A: 'Pedro vai ao cinema', B: 'Ana vai ao teatro' }, f: 'A → B' },
  { nl: 'Carlos passa se e somente se estuda.', dict: { A: 'Carlos passa', B: 'estuda'
