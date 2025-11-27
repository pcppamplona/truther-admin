# Projeto — Guia de Execução

## 📦 Instalação
```bash
npm install

---
🗄️ Subir API fake (json-server)
json-server --watch src/server/db.json --port 3001

---
🗄️ Rodar API real (backend)
npm run dev (código do backend local)

---
🚀 Rodar a aplicação
npm run dev

---
🔐 Credenciais de acesso

E-mail: jonathan@smartpay.com.vc
Senha: 1234567

---
🌐 Conexão com a VPN (Obrigatório)
- Antes de tentar logar ou consumir qualquer rota interna:

- Abra o cliente VPN da SmartPay.

- Conecte no perfil padrão.

- Aguarde a confirmação de conexão.

- Só então rode a aplicação com npm run dev.

- Sem VPN, algumas integrações não funcionam.

