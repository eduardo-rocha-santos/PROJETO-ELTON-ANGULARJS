/**
 * Módulo de Serviços e Factories do StudyFlow (AngularJS)
 * Demonstra o gerenciamento de dados e regras de negócio desacoplados do controlador.
 */
angular
  .module('studyFlow.services', [])

  // Factory para fornecer os dados iniciais e listas de apoio da aplicação
  .factory('TarefasFactory', function () {
    var tarefasIniciais = [
      {
        id: 1,
        titulo: 'Criar módulo principal (app.js) e configurar dependências',
        disciplina: 'AngularJS',
        concluida: true,
      },
      {
        id: 2,
        titulo: 'Implementar diretivas customizadas com isolate scope',
        disciplina: 'Diretivas',
        concluida: true,
      },
      {
        id: 3,
        titulo: 'Praticar two-way data binding com $scope e ng-model',
        disciplina: 'Bindings',
        concluida: true,
      },
      {
        id: 4,
        titulo: 'Criar Factory e Service para compartilhamento de estado',
        disciplina: 'Arquitetura',
        concluida: false,
      },
      {
        id: 5,
        titulo: 'Aplicar filtros nativos e customizados na listagem',
        disciplina: 'Filtros',
        concluida: false,
      },
      {
        id: 6,
        titulo: 'Manipular eventos de usuário com ng-click e ng-change',
        disciplina: 'Eventos',
        concluida: true,
      },
      {
        id: 7,
        titulo: 'Validar fechamento do Menu Suspenso ao clicar fora',
        disciplina: 'UI / DOM',
        concluida: false,
      },
      {
        id: 8,
        titulo: 'Testar layout responsivo em celular, tablet e desktop',
        disciplina: 'CSS Responsivo',
        concluida: false,
      },
      {
        id: 9,
        titulo: 'Gravar vídeo explicativo no GitHub Codespaces',
        disciplina: 'Entrega',
        concluida: false,
      },
    ];

    var tiposEstudo = [
      'AngularJS',
      'Diretivas',
      'Bindings',
      'Arquitetura',
      'Filtros',
      'CSS Responsivo',
      'Entrega',
      'Estudo Geral',
    ];

    var abasConteudo = [
      {
        title: '1. Arquitetura AngularJS',
        heading: 'Módulos, Controladores, Serviços e Diretivas',
        content:
          'A aplicação é dividida em três módulos: studyFlowApp (orquestrador), studyFlow.services (dados e notificações) e studyFlow.directives (os 6 componentes visuais).',
        topicos: [
          'Two-way data binding automático entre $scope e a view via ng-model.',
          'Isolate Scope nas diretivas usando bindings "=" (two-way), "@" (texto) e "&" (callbacks).',
          'Injeção de dependências com TarefasFactory, ToastService, $timeout, $interval e $document.',
        ],
      },
      {
        title: '2. Diretivas e Filtros',
        heading: 'Reutilização de Componentes e Formatação',
        content:
          'Cada um dos 6 componentes obrigatórios foi encapsulado como uma diretiva independente, podendo ser reutilizada em qualquer parte da aplicação.',
        topicos: [
          'Filtro customizado "statusTarefa" para formatar o estado booleano em texto legível.',
          'Diretiva <sf-progress-bar> reutilizada tanto no resumo das tarefas quanto no simulador de upload.',
          'Diretiva <sf-dropdown-menu> integrada ao $document para fechar ao clicar fora.',
        ],
      },
      {
        title: '3. Acessibilidade e Responsividade',
        heading: 'HTML5 Semântico, Atributos ARIA e Media Queries',
        content:
          'O layout fluido reorganiza os cartões e controles automaticamente em smartphones, tablets e desktops, mantendo suporte a leitores de tela e teclado.',
        topicos: [
          'Uso de header, nav, main, section, article e footer.',
          'Atributos ARIA dinâmicos (aria-expanded, aria-selected, aria-valuenow e role="status").',
          'Grid responsivo de 3 colunas no desktop, 2 no tablet e 1 no mobile.',
        ],
      },
    ];

    var perguntasFaq = [
      {
        title: 'Como as diretivas recebem dados do controlador principal?',
        content:
          'Através do Isolate Scope (propriedade scope da diretiva), utilizando "=" para passagem de dados reativos, "@" para strings e "&" para funções de callback.',
      },
      {
        title: 'Qual a diferença entre Factory e Service utilizados no projeto?',
        content:
          'A TarefasFactory retorna um objeto com métodos de acesso aos dados iniciais, enquanto o ToastService instancia funções diretamente com "this" para gerenciar o estado e o timer da notificação.',
      },
      {
        title: 'Como funciona o fechamento automático da Notificação Toast?',
        content:
          'O ToastService utiliza o serviço nativo $timeout do AngularJS para ocultar a notificação após 3,5 segundos, cancelando o timer anterior caso uma nova mensagem seja disparada.',
      },
      {
        title: 'Como o Menu Suspenso detecta cliques fora do componente?',
        content:
          'Na função link da diretiva sfDropdownMenu, injetamos o serviço $document e escutamos o evento mousedown para fechar o menu sempre que o clique ocorrer fora do elemento.',
      },
    ];

    return {
      obterTarefas: function () {
        return angular.copy(tarefasIniciais);
      },
      obterTiposEstudo: function () {
        return tiposEstudo;
      },
      obterAbas: function () {
        return abasConteudo;
      },
      obterFaq: function () {
        return perguntasFaq;
      },
    };
  })

  // Service para gerenciar a Notificação Toast com fechamento automático via $timeout
  .service('ToastService', [
    '$timeout',
    function ($timeout) {
      var self = this;
      var promessaTimer = null;

      self.estado = {
        visivel: false,
        mensagem: '',
        tipo: 'info',
      };

      self.mostrar = function (mensagem, tipo) {
        if (promessaTimer) {
          $timeout.cancel(promessaTimer);
        }

        self.estado.mensagem = mensagem;
        self.estado.tipo = tipo || 'info';
        self.estado.visivel = true;

        promessaTimer = $timeout(function () {
          self.estado.visivel = false;
        }, 3500);
      };

      self.fechar = function () {
        if (promessaTimer) {
          $timeout.cancel(promessaTimer);
        }
        self.estado.visivel = false;
      };
    },
  ]);
