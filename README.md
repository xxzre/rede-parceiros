# 🚀 Rede Parceiros - Plataforma de Gestão de Comissões, Indicações e Gamificação

Sistema completo para gestão de técnicos e afiliados, com cálculo automático de comissões, link de convite exclusivo (ex: `JOAO01`), ranking gamificado, formulário público de inscrição e regras estritas de segurança em **Firebase Firestore** (`firestore.rules`).

---

## 🌟 Como o fluxo funciona na prática

1. **Cadastro pelo Admin**:
   - Você (admin) cadastra o técnico no painel com nome, comissão % customizada e gera um código único (ex: `JOAO01`).
   - O sistema gera automaticamente o link de convite copiável com 1 clique (ex: `https://.../?convite=JOAO01`).
2. **Ativação pelo Técnico**:
   - O técnico clica no link e ativa a própria conta.
   - Ganha acesso restrito e seguro **exclusivamente ao próprio painel**.
3. **Registro de Vendas Indicadas**:
   - Quando uma venda indicada acontece, o Admin registra: Técnico, Cliente, Produto e Valor.
   - **A comissão é calculada sozinha** instantaneamente a partir da porcentagem (%) individual do técnico.
   - Status da comissão: **⏳ Pendente** ou **✅ Pago**.
4. **Painel em Tempo Real do Técnico**:
   - O técnico acompanha os valores pendentes e pagos, lista de vendas atribuídas a ele, seu código e seu link direto para enviar a clientes.
5. **Aba Ranking (Gamificação)**:
   - Pódio (1º, 2º e 3º lugar com troféus 🏆) e classificação em tempo real mostrando quem mais indicou e gerou resultado.
6. **Aba Solicitações**:
   - Recebe as inscrições do formulário público de interessados em se tornar parceiros/entrar no curso.
   - Botão de **Aprovação em 1 clique** que já gera o código de indicação do novo parceiro.

---

## 🔒 Segurança Forte (`firestore.rules`)

1. **Registro Exclusivo pelo Admin**: Só o Admin pode registrar e criar vendas. O técnico **não pode inventar** uma indicação para si mesmo.
2. **Isolamento de Dados no Servidor**: Cada técnico só enxerga as próprias indicações, garantido pelo servidor Firestore e **não pelo JavaScript**.
3. **Código Imutável / Anti-Roubo**: Um código de indicação vinculado a uma conta não pode ser sobrescrito ou roubado por outra pessoa.
4. **Proteção de Papéis**: Ninguém consegue se promover a `admin` sozinho.

---

## 🛠️ Tecnologias Utilizadas

- **React 18** + **Vite**
- **Lucide Icons**
- **Canvas Confetti** (Animação de celebração do ranking)
- **Glassmorphic Modern Dark Theme**
- **Firebase Firestore / LocalStore Dual-Mode** (Funciona live ou 100% offline em modo simulado reativo out-of-the-box!)

---

## 💻 Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev

# 3. Gerar build de produção
npm run build
```
