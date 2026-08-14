# Dark Souls 1 - Pyro/Dex Companion

Um companion app desktop feito com Tauri (Rust) + React (Vite) projetado para funcionar como overlay durante suas jogatinas de Dark Souls 1. Ele traz ferramentas e guias para uma build Pyromancer/Dexterity.

## Funcionalidades
- **Overlay Discreto:** Roda sobre o jogo (sem bordas, fundo transparente).
- **Background Mode:** Fica minimizado na bandeja do sistema (System Tray) para rodar em segundo plano e não atrapalhar, podendo ser fechado clicando com o botão direito no ícone do app perto do relógio.
- **Steam API Native:** Consome a API da Steam diretamente via Tauri HTTP.

## Como Rodar Localmente e Compilar

### Pré-requisitos (Windows)
1. **Node.js** (v18+)
2. **Visual Studio C++ Build Tools:** Essencial para compilar o backend em Rust. Baixe o [Visual Studio Build Tools](https://visualstudio.microsoft.com/pt-br/visual-cpp-build-tools/) e selecione **"Desenvolvimento para desktop com C++"**.

### Comandos Iniciais

1. Instale as dependências Node:
   ```bash
   npm install
   ```

2. Para rodar o ambiente de desenvolvimento (React + Tauri simultaneamente):
   ```bash
   npm run tauri dev
   ```

3. Para compilar e gerar o executável (.exe):
   ```bash
   npm run tauri build
   ```
   > **Nota:** O executável será gerado em `src-tauri/target/release/bundle`.

### Pipeline CI/CD Integrado (GitHub Actions)
Este repositório está configurado para publicar novos _Releases_ automaticamente. Para compilar e publicar via GitHub, apenas crie uma nova _tag_ começando com `v` (ex: `v1.0.0`) e suba para o GitHub:
```bash
git tag v1.0.0
git push origin v1.0.0
```
O GitHub Actions irá gerar o `app-v1.0.0.exe` e atrelá-lo na página de _Releases_ automaticamente.
