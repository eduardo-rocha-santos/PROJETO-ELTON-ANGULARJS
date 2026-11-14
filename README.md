# StudyFlow — Painel de Estudos em AngularJS

Aplicação web responsiva desenvolvida com **AngularJS (1.8)** para a disciplina de **Engenharia de Software (UCSAL — Prof. Elton Figueiredo da Silva)**.

## Arquitetura Modular e Conceitos Aplicados

- **Módulo Principal ([`js/app.js`](./js/app.js)):** Orquestra os submódulos `studyFlow.services` e `studyFlow.directives`, define o controlador principal (`MainController`) com `$scope`, *two-way data binding* (`ng-model`), eventos (`ng-click`, `ng-change`, `ng-submit`) e o filtro customizado `statusTarefa`.
- **Serviços e Factories ([`js/services.js`](./js/services.js)):**
  - `TarefasFactory`: Gerencia os dados iniciais de tarefas, tipos de estudo, abas e perguntas frequentes (FAQ).
  - `ToastService`: Serviço que controla a exibição e o temporizador (`$timeout`) das notificações temporárias.
- **6 Componentes Visuais como Diretivas AngularJS ([`js/directives.js`](./js/directives.js)):**
  1. **Acordeão (`<sf-accordion>`):** Controla o item expandido (apenas um por vez) com transição suave e bindings `items`.
  2. **Paginação (`<sf-pagination>`):** Recebe `current-page`, `total-pages` e callback `on-page-change` via bindings isolados.
  3. **Barra de Progresso (`<sf-progress-bar>`):** Recebe `progress` (0–100) e `label`, atualizando o preenchimento dinâmico.
  4. **Abas (`<sf-tabs>`):** Gerencia a aba ativa no `$scope` da diretiva e renderiza o painel selecionado.
  5. **Menu Suspenso (`<sf-dropdown-menu>`):** Gerencia visibilidade no `$scope`, dispara callbacks das opções e fecha ao clicar fora (`$document`).
  6. **Notificação Toast (`<sf-toast>`):** Exibe feedbacks de `sucesso`, `info` e `erro` com fechamento automático ou manual.

## Como Executar (Localmente ou no GitHub Codespaces)

1. Abra `index.html` e clique em **Go Live** (extensão Live Server no VS Code / Codespaces), **ou**
2. Execute no terminal:
   ```bash
   npx --yes serve . -l 5500
   ```
