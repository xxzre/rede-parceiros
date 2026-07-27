# 📊 Passo a Passo: Como Configurar o Firebase e Aplicar as Regras de Segurança (`firestore.rules`)

Este guia mostra exatamente como criar seu banco de dados no **Firebase Console** e colar as regras de segurança do arquivo `firestore.rules`.

---

## 🚀 Passo 1: Criar o Projeto no Firebase Console

1. Acesse o site do [Firebase Console](https://console.firebase.google.com/).
2. Faça login com sua conta do Google.
3. Clique no botão **"Adicionar projeto"** (ou "Criar um projeto").
4. Digite o nome do projeto (ex: `rede-parceiros-prod`) e clique em **Continuar**.
5. Desative o Google Analytics (opcional) e clique em **Criar projeto**.
6. Aguarde alguns segundos e clique em **Continuar**.

---

## 🗄️ Passo 2: Criar o Banco de Dados Firestore Database

1. No menu lateral esquerdo do Firebase Console, clique em **Build** (Construir) e depois em **Firestore Database**.
2. Clique no botão **"Criar banco de dados"**.
3. Na janela que aparecer:
   - **Localização do banco de dados**: Escolha `southamerica-east1 (São Paulo)` ou a região mais próxima.
   - Clique em **Avançar**.
4. Na tela de regras iniciais:
   - Selecione **"Iniciar no modo de teste"** ou **"Modo de produção"** (vamos substituir as regras no próximo passo).
   - Clique em **Criar**.

---

## 🔒 Passo 3: Aplicar as Regras de Segurança (`firestore.rules`)

1. Dentro do **Firestore Database**, clique na aba **"Regras"** (Rules) no topo da tela.
2. Você verá um editor de código na página com algumas regras padrão.
3. Apague todo o conteúdo que está no editor.
4. Abra o arquivo `firestore.rules` que está na raiz do projeto (ou copie o código abaixo) e cole no editor do Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isAdmin() {
      return isAuthenticated() && 
        (request.auth.token.admin == true || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // Coleção de Usuários e Proteção de Papéis
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isAdmin());
      allow create: if isAuthenticated() && (
        isAdmin() || 
        (isOwner(userId) && request.resource.data.role == 'tecnico')
      );
      allow update: if isAuthenticated() && (
        isAdmin() || 
        (isOwner(userId) && request.resource.data.role == resource.data.role)
      );
    }

    // Coleção de Técnicos Cadastrados
    match /tecnicos/{tecnicoId} {
      allow read: if true;
      allow create, delete: if isAdmin();
      allow update: if isAdmin() || (
        isAuthenticated() && 
        resource.data.uid == null && 
        request.resource.data.uid == request.auth.uid &&
        request.resource.data.codigo == resource.data.codigo
      );
    }

    // Coleção de Vendas - REGISTRO EXCLUSIVO DO ADMIN
    match /vendas/{vendaId} {
      allow read: if isAdmin() || (
        isAuthenticated() && (
          resource.data.tecnicoUid == request.auth.uid ||
          resource.data.tecnicoCodigo == request.auth.token.codigo
        )
      );
      allow create, update, delete: if isAdmin();
    }

    // Solicitações Públicas
    match /solicitacoes/{solicitacaoId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

5. Clique no botão azul **"Publicar"** (Publish) no canto superior direito.
6. Pronto! As regras de segurança estão ativas no servidor do Firebase! 🎉

---

## 🔑 Passo 4: Obter as Chaves de Conexão da Sua Aplicação

1. No menu lateral esquerdo, clique no ícone de engrenagem ⚙️ ao lado de *Visão geral do projeto* e selecione **Configurações do projeto**.
2. Na aba *Geral*, role até o final da página até a seção **"Seus aplicativos"**.
3. Clique no ícone da Web **`</>`**.
4. Digite o apelido do app (ex: `Rede Parceiros Web`) e clique em **Registrar app**.
5. Copie o objeto `firebaseConfig` com suas chaves (apiKey, authDomain, projectId, etc.).
6. Cole essas chaves no arquivo `.env` ou em `src/firebase.js` do seu projeto.
