## Leitor de Código de Barras com Next.js + Google Sheets

Este projeto é uma aplicação Next.js que permite ler códigos de barras usando a câmera do navegador e registrar as informações em uma planilha Google Sheets através de Google Apps Script.

A planilha funciona como banco de dados, registrando a primeira leitura e atualizando a segunda (caso ocorra), respeitando regras de validação.

---

### Funcionalidades
#### Scanner de Código de Barras

- Leitura usando a câmera via @zxing/browser;
- Botão para iniciar leitura;
- Botão para parar leitura (stop() no controle do vídeo);
- Leitura pausada automaticamente quando um código é detectado.

---

### Classificação do Código

O usuário seleciona uma categoria:

- Nota Fiscal
- Bateria

### Envio para Google Sheets

A aplicação envia:

```
{
  codigo: "12345",
  categoria: "Nota Fiscal"
}

```
---

### Regras de Registro na Planilha

A planilha possui duas linhas de cabeçalhos e os dados começam na linha 3, no formato:

```
Data |	Código de barras |	Categoria |	Segunda leitura |	Categoria 2 |	Status
```
✔️ Primeira leitura

Se o código ainda não existe, o Apps Script insere:
```
 Data | Código | Categoria | "aguardando" | "" | "pendente" 
```
✔️ Segunda leitura

Se o código já existe e o status não é "ok":
```
 Segunda leitura → "registrado" | Categoria 2 → nova categoria | Status → "ok" |
```
#### Regra de bloqueio

Se o status já for "ok", nenhuma atualização é permitida.

---

### Tecnologias Utilizadas

- Next.js 14+
- React
- TailwindCSS
- @zxing/browser
- Google Apps Script
- Google Sheets
- Variáveis de ambiente (.env)

---

### Instalação

1️. Instalar dependências

```
npm install
```

2️. Criar um arquivo .env
```
NEXT_PUBLIC_URL_PLANILHA="https://script.google.com/macros/s/SEU-SCRIPT-ID/exec"

```
---

### Como Usar

- Abra o app no navegador
- Clique em Ler código
- Aponte a câmera para o código de barras
- Selecione a categoria
- Clique Enviar para planilha
- Leia novamente o mesmo código se quiser registrar a segunda categoria

---

