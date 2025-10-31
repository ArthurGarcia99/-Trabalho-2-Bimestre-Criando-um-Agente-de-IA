# 🤖 Agente de IA Tradutor NL → Cálculo Proposicional Clássico (CPC)

Este projeto apresenta um **Agente de Inteligência Artificial para Web** capaz de **traduzir sentenças em Linguagem Natural (NL)**, escritas em português, para **fórmulas no Cálculo Proposicional Clássico (CPC)** e vice-versa.  
A aplicação foi desenvolvida em **HTML, CSS e JavaScript**, permitindo a interação direta com o usuário através de uma interface web simples e intuitiva.

---

## 🧩 1. Desenho da Arquitetura do Sistema e Explicação de Funcionamento

### 📘 Introdução
A arquitetura do sistema foi projetada para integrar três camadas principais: **Interface Web (Front-End)**, **Lógica de Tradução (Processamento JavaScript)** e **Gerenciamento de Dados (Dicionário de Átomos)**.  
Essa estrutura garante uma separação clara entre a interação do usuário e o processamento linguístico lógico.

### 🧠 Estrutura Geral

┌───────────────────────────────┐
│         Interface Web         │
│  (HTML + CSS)                 │
│ ┌───────────────────────────┐ │
│ │ Área NL (Entrada Texto)   │◄─── Usuário digita frase em português
│ │ Botões: Traduzir / Limpar │ │
│ │ Área Fórmula CPC          │ │
│ │ Dicionário de Átomos      │ │
│ │ Exemplos Rápidos           │ │
│ └───────────────────────────┘ │
└──────────────┬────────────────┘
               │
               ▼
┌───────────────────────────────────────┐
│       Camada de Lógica (JavaScript)   │
│ ┌───────────────────────────────────┐ │
│ │ 1️⃣ Pré-processamento (normalizeNL) │
│ │   → Remove acentos, pontuação, etc │
│ │                                     │
│ │ 2️⃣ Extração de Átomos (extractAtomsFromNL) │
│ │   → Identifica proposições básicas │
│ │                                     │
│ │ 3️⃣ Geração de Dicionário (buildDictionaryFromNL) │
│ │   → Mapeia letras A, B, C... para frases │
│ │                                     │
│ │ 4️⃣ Tradução NL → Fórmula (nlToFormula) │
│ │   → Substitui frases pelos símbolos lógicos │
│ │                                     │
│ │ 5️⃣ Tradução Fórmula → NL (realizePT) │
│ │   → Reconstrói a sentença natural │
│ │                                     │
│ │ 6️⃣ Parser Lógico (tokenizeFormula + parseFormula) │
│ │   → Constrói árvore sintática da fórmula │
│ │                                     │
│ │ 7️⃣ Avaliação (evalAST) [opcional] │
│ │   → Calcula valor lógico (não usado nesta versão) │
│ └───────────────────────────────────┘ │
└───────────────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────┐
│       Camada de Interação (UI/UX)     │
│  - Botões e eventos (onclick)         │
│  - Modal para confirmar átomos        │
│  - Exibição do dicionário             │
│  - Copiar / limpar campos             │
└───────────────────────────────────────┘
               │
               ▼
┌───────────────────────────────────────┐
│         Usuário / Interface Final     │
│  - Visualiza traduções NL ↔ CPC       │
│  - Edita manualmente átomos           │
│  - Testa exemplos rápidos             │
└───────────────────────────────────────┘
<img width="1536" height="1024" alt="ChatGPT Image 31 de out  de 2025, 16_27_44" src="https://github.com/user-attachments/assets/4bd171e9-335f-455a-82b1-40df98516c94" />
