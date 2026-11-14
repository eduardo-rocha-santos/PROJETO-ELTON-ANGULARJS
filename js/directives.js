/**
 * Módulo com os 6 Componentes Visuais Obrigatórios implementados como Diretivas AngularJS:
 * 1. sfAccordion    (Acordeão)
 * 2. sfPagination   (Paginação)
 * 3. sfProgressBar  (Barra de Progresso)
 * 4. sfTabs         (Abas)
 * 5. sfDropdownMenu (Menu Suspenso)
 * 6. sfToast        (Notificação Toast)
 */
angular
  .module('studyFlow.directives', [])

  /* =========================================================
     1. DIRETIVA: ACORDEÃO (<sf-accordion items="...")
     ========================================================= */
  .directive('sfAccordion', function () {
    return {
      restrict: 'E',
      scope: {
        items: '=',
      },
      link: function (scope) {
        scope.indiceAberto = 0;

        scope.alternarItem = function (index) {
          scope.indiceAberto = scope.indiceAberto === index ? null : index;
        };
      },
      template:
        '<div class="accordion">' +
        '  <div class="accordion-item" ng-repeat="item in items" ng-class="{ open: indiceAberto === $index }">' +
        '    <h3>' +
        '      <button type="button" class="accordion-trigger" ' +
        '        aria-expanded="{{ indiceAberto === $index }}" ' +
        '        ng-click="alternarItem($index)">' +
        '        <span>{{ item.title }}</span>' +
        '        <span class="accordion-icon" aria-hidden="true">▾</span>' +
        '      </button>' +
        '    </h3>' +
        '    <div class="accordion-content-wrapper" ng-class="{ open: indiceAberto === $index }">' +
        '      <div class="accordion-content-inner">' +
        '        <p>{{ item.content }}</p>' +
        '      </div>' +
        '    </div>' +
        '  </div>' +
        '</div>',
    };
  })

  /* =========================================================
     2. DIRETIVA: PAGINAÇÃO (<sf-pagination ...>)
     ========================================================= */
  .directive('sfPagination', function () {
    return {
      restrict: 'E',
      scope: {
        currentPage: '=',
        totalPages: '=',
        onPageChange: '&',
      },
      link: function (scope) {
        scope.obterPaginas = function () {
          var total = Math.max(1, Number(scope.totalPages) || 1);
          var lista = [];
          for (var i = 1; i <= total; i++) {
            lista.push(i);
          }
          return lista;
        };

        scope.irParaPagina = function (pagina) {
          var total = Math.max(1, Number(scope.totalPages) || 1);
          if (pagina < 1 || pagina > total) return;
          scope.onPageChange({ page: pagina });
        };
      },
      template:
        '<nav class="pagination" aria-label="Navegação entre páginas">' +
        '  <button type="button" class="nav-btn" ' +
        '    ng-disabled="currentPage <= 1" ' +
        '    ng-click="irParaPagina(currentPage - 1)">' +
        '    ← Anterior' +
        '  </button>' +
        '  <button type="button" class="page-btn" ' +
        '    ng-repeat="num in obterPaginas()" ' +
        '    ng-class="{ active: num === currentPage }" ' +
        '    aria-current="{{ num === currentPage ? \'page\' : undefined }}" ' +
        '    ng-click="irParaPagina(num)">' +
        '    {{ num }}' +
        '  </button>' +
        '  <button type="button" class="nav-btn" ' +
        '    ng-disabled="currentPage >= totalPages" ' +
        '    ng-click="irParaPagina(currentPage + 1)">' +
        '    Próxima →' +
        '  </button>' +
        '</nav>',
    };
  })

  /* =========================================================
     3. DIRETIVA: BARRA DE PROGRESSO (<sf-progress-bar ...>)
     ========================================================= */
  .directive('sfProgressBar', function () {
    return {
      restrict: 'E',
      scope: {
        progress: '=',
        label: '@',
      },
      link: function (scope) {
        scope.valorLimitado = function () {
          var num = Math.round(Number(scope.progress) || 0);
          return Math.min(100, Math.max(0, num));
        };
      },
      template:
        '<div class="progress-wrapper">' +
        '  <div class="progress-header">' +
        '    <span class="progress-label">{{ label || "Progresso" }}</span>' +
        '    <span class="progress-badge">{{ valorLimitado() }}%</span>' +
        '  </div>' +
        '  <div class="progress-track" role="progressbar" ' +
        '    aria-label="{{ label || \'Progresso\' }}" ' +
        '    aria-valuenow="{{ valorLimitado() }}" aria-valuemin="0" aria-valuemax="100">' +
        '    <div class="progress-fill" ng-style="{ width: valorLimitado() + \'%\' }"></div>' +
        '  </div>' +
        '</div>',
    };
  })

  /* =========================================================
     4. DIRETIVA: ABAS (<sf-tabs tabs="...">)
     ========================================================= */
  .directive('sfTabs', function () {
    return {
      restrict: 'E',
      scope: {
        tabs: '=',
      },
      link: function (scope) {
        scope.abaAtiva = 0;

        scope.selecionarAba = function (index) {
          scope.abaAtiva = index;
        };
      },
      template:
        '<div class="tabs-container" ng-if="tabs && tabs.length">' +
        '  <div class="tab-list" role="tablist" aria-label="Abas de conteúdo">' +
        '    <button type="button" role="tab" class="tab-button" ' +
        '      ng-repeat="aba in tabs" ' +
        '      ng-class="{ active: abaAtiva === $index }" ' +
        '      aria-selected="{{ abaAtiva === $index }}" ' +
        '      ng-click="selecionarAba($index)">' +
        '      {{ aba.title }}' +
        '    </button>' +
        '  </div>' +
        '  <div class="tab-panel" role="tabpanel">' +
        '    <h3>{{ tabs[abaAtiva].heading }}</h3>' +
        '    <p style="margin-top: 0.4rem; color: var(--cor-texto-secundario);">' +
        '      {{ tabs[abaAtiva].content }}' +
        '    </p>' +
        '    <ul class="tab-topics" ng-if="tabs[abaAtiva].topicos">' +
        '      <li ng-repeat="topico in tabs[abaAtiva].topicos">{{ topico }}</li>' +
        '    </ul>' +
        '  </div>' +
        '</div>',
    };
  })

  /* =========================================================
     5. DIRETIVA: MENU SUSPENSO (<sf-dropdown-menu ...>)
     ========================================================= */
  .directive('sfDropdownMenu', [
    '$document',
    function ($document) {
      return {
        restrict: 'E',
        scope: {
          label: '=',
          options: '=',
        },
        link: function (scope, element) {
          scope.aberto = false;

          scope.alternarMenu = function () {
            scope.aberto = !scope.aberto;
          };

          scope.selecionarOpcao = function (opcao) {
            if (opcao && typeof opcao.callback === 'function') {
              opcao.callback();
            }
            scope.aberto = false;
          };

          // Fecha o menu suspenso ao clicar fora do elemento da diretiva
          function fecharAoClicarFora(event) {
            if (!element[0].contains(event.target) && scope.aberto) {
              scope.$apply(function () {
                scope.aberto = false;
              });
            }
          }

          $document.on('mousedown', fecharAoClicarFora);

          scope.$on('$destroy', function () {
            $document.off('mousedown', fecharAoClicarFora);
          });
        },
        template:
          '<div class="dropdown">' +
          '  <button type="button" class="dropdown-trigger" ' +
          '    aria-haspopup="menu" aria-expanded="{{ aberto }}" ' +
          '    ng-click="alternarMenu()">' +
          '    <span>{{ label }}</span>' +
          '    <span aria-hidden="true">▾</span>' +
          '  </button>' +
          '  <ul class="dropdown-menu-list" role="menu" ng-if="aberto">' +
          '    <li role="none" ng-repeat="opcao in options">' +
          '      <button type="button" role="menuitem" class="dropdown-option" ' +
          '        ng-class="{ active: opcao.active }" ' +
          '        ng-click="selecionarOpcao(opcao)">' +
          '        <span>{{ opcao.label }}</span>' +
          '        <span ng-if="opcao.active" aria-hidden="true">✓</span>' +
          '      </button>' +
          '    </li>' +
          '  </ul>' +
          '</div>',
      };
    },
  ])

  /* =========================================================
     6. DIRETIVA: NOTIFICAÇÃO TOAST (<sf-toast ...>)
     ========================================================= */
  .directive('sfToast', function () {
    return {
      restrict: 'E',
      scope: {
        toast: '=',
        onClose: '&',
      },
      link: function (scope) {
        scope.obterIcone = function (tipo) {
          if (tipo === 'sucesso') return '✓';
          if (tipo === 'erro') return '!';
          return 'i';
        };
      },
      template:
        '<div class="toast" ng-if="toast.visivel && toast.mensagem" ' +
        '  ng-class="toast.tipo" role="status" aria-live="polite">' +
        '  <span class="toast-icon" aria-hidden="true">{{ obterIcone(toast.tipo) }}</span>' +
        '  <p class="toast-message">{{ toast.mensagem }}</p>' +
        '  <button type="button" class="toast-close" ' +
        '    aria-label="Fechar notificação" ng-click="onClose()">✕</button>' +
        '</div>',
    };
  });
