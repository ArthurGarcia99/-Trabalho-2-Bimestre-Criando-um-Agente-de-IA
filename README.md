# 🤖 Agente de IA Tradutor NL → Cálculo Proposicional Clássico (CPC)

Este projeto apresenta um **Agente de Inteligência Artificial para Web** capaz de **traduzir sentenças em Linguagem Natural (NL)**, escritas em português, para **fórmulas no Cálculo Proposicional Clássico (CPC)** e vice-versa.  
A aplicação foi desenvolvida em **HTML, CSS e JavaScript**, permitindo a interação direta com o usuário através de uma interface web simples e intuitiva.

---

## 🧩 1. Desenho da Arquitetura do Sistema e Explicação de Funcionamento

### 📘 Introdução
A arquitetura do sistema foi projetada para integrar três camadas principais: **Interface Web (Front-End)**, **Lógica de Tradução (Processamento JavaScript)** e **Gerenciamento de Dados (Dicionário de Átomos)**.  
Essa estrutura garante uma separação clara entre a interação do usuário e o processamento linguístico lógico.

### 🧠 Estrutura Geral
Usuário → Interface Web → Motor de Tradução → Resultado (CPC ↔ NL)
<img width="1536" height="1024" alt="ChatGPT Image 31 de out  de 2025, 16_27_44" src="https://github.com/user-attachments/assets/4bd171e9-335f-455a-82b1-40df98516c94" />

⚙️ Explicação do Funcionamento

O usuário digita uma sentença em português no campo de entrada.

O sistema realiza o pré-processamento linguístico (remoção de acentos, pontuação, etc.).

As proposições básicas (átomos) são extraídas e mapeadas para letras (A, B, C…).

A função de tradução converte conectivos linguísticos (“e”, “ou”, “se... então...”) em símbolos formais (∧, ∨, →, ¬, ↔).

A fórmula resultante é exibida ao usuário, junto com o dicionário dos átomos.

A tradução inversa (CPC → NL) é feita reconstruindo frases com base na árvore sintática lógica.

## 🧠 2. Estratégia de Tradução (Regras, Mapeamento, Exemplos e Análise)
### 📘 Introdução

A estratégia de tradução baseia-se em um mapeamento direto de padrões linguísticos da língua portuguesa para os símbolos formais da lógica proposicional.
Não foram utilizadas LLMs (modelos de linguagem de larga escala) — toda a lógica foi implementada manualmente via regras e dicionários em JavaScript.

⚖️ Mapeamento de Regras Principais

| Linguagem Natural | Símbolo Lógico | Significado   |
| ----------------- | -------------- | ------------- |
| não               | ¬              | Negação       |
| e                 | ∧              | Conjunção     |
| ou                | ∨              | Disjunção     |
| se ... então ...  | →              | Condicional   |
| se e somente se   | ↔              | Bicondicional |

🧩 Exemplo de Tradução

Entrada NL:

Se está chovendo, então levarei guarda-chuva.

Saída CPC:

A → B

Dicionário:

A = está chovendo

B = levarei guarda-chuva

Tradução inversa (CPC → NL):

Se está chovendo, então levarei guarda-chuva.

🧪 Análise de Acertos e Erros

✅ Acertos:

Consegue identificar corretamente conectivos lógicos.

Tradução é fiel em frases simples e compostas diretas.

⚠️ Limitações:

Dificuldade em interpretar frases ambíguas (“ou” exclusivo/inclusivo).

Necessita confirmação manual dos átomos extraídos.

Não compreende contextos complexos ou negações compostas (“se não chover…”).

## ⚙️ 3. Limitações e Possibilidades de Melhoria
### 📘 Introdução

Apesar de funcional, o agente apresenta limitações inerentes ao uso de regras fixas e ausência de compreensão semântica profunda.

🧱 Limitações Atuais

Reconhecimento limitado de estruturas complexas de linguagem natural.

Falta de análise morfossintática (não há uso de NLP avançado).

Tradução literal pode gerar ambiguidades.

Dicionário de átomos depende da confirmação manual do usuário.

🚀 Possibilidades de Melhoria

Integração com Modelos de Linguagem (LLMs), como GPT, para análise semântica e contextual.

Implementação de analisador morfossintático (POS tagging).

Geração automática de tabelas-verdade a partir da fórmula CPC.

Exportação dos resultados em PDF/LaTeX para uso acadêmico.

## 🎥 4. Demonstração em Vídeo
### 📘 Introdução

Para demonstrar o funcionamento prático do agente, foi gravado um vídeo mostrando o processo de tradução de sentenças, geração de fórmulas e uso do dicionário de átomos.

🔗 Link do vídeo:
https://youtu.be/7KlYyqrxx68

## 🌐 5. Agente de IA funcionando corretamente na Web e online para testes.

🔗Link no GitHub Pages:
https://arthurgarcia99.github.io/-Trabalho-2-Bimestre-Criando-um-Agente-de-IA/

## 👨‍💻 Desenvolvido por

Arthur Assis Garcia - Ciencia da Computação

Gabriel Letro Tozati - Ciencia da Computação

Kaique Fabio Teixeira Lima - Sistemas de Informação

Matéria: Lógica para Computação

Instituição: Uni-FACEF

Ano: 2025
