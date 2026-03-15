# SEFOR 3 - Sistema de Gestão Educacional

Este é um sistema de gestão educacional moderno, desenvolvido para facilitar o acompanhamento de frequências, avaliações, projetos e eventos escolares.

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 19 + TypeScript
- **Estilização:** Tailwind CSS (v4)
- **Animações:** Motion (Framer Motion)
- **Ícones:** Lucide React
- **Backend/Banco de Dados:** Firebase (Firestore & Authentication)
- **Build Tool:** Vite

## 🛠️ Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone <url-do-seu-repositorio>
   cd <nome-da-pasta>
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto e adicione suas credenciais do Firebase (você pode encontrá-las no arquivo `firebase-applet-config.json` se exportou do AI Studio):
   ```env
   VITE_FIREBASE_API_KEY=seu_api_key
   VITE_FIREBASE_AUTH_DOMAIN=seu_auth_domain
   VITE_FIREBASE_PROJECT_ID=seu_project_id
   VITE_FIREBASE_STORAGE_BUCKET=seu_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
   VITE_FIREBASE_APP_ID=seu_app_id
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   O app estará disponível em `http://localhost:3000`.

## 📦 Como Fazer o Deploy

### GitHub Pages
Para hospedar no GitHub Pages, você pode usar o pacote `gh-pages`:
1. Instale: `npm install gh-pages --save-dev`
2. Adicione `"homepage": "https://seu-usuario.github.io/nome-do-repo"` ao `package.json`.
3. Adicione os scripts de deploy:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Execute: `npm run deploy`

### Vercel / Netlify (Recomendado)
Estes serviços detectam automaticamente projetos Vite. Basta conectar seu repositório do GitHub e eles farão o build e deploy automaticamente a cada "push".

## 🔒 Segurança (Firestore Rules)

Não esqueça de configurar as regras de segurança no seu console do Firebase para proteger os dados dos usuários. O arquivo `firestore.rules` incluído neste repositório contém uma configuração base recomendada.

---

Desenvolvido com ❤️ para a gestão educacional.
