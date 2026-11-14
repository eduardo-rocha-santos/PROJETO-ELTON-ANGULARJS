/**
 * Módulo Principal (app.js) — Orquestra serviços, diretivas, filtros e controlador principal
 */
angular
  .module('studyFlowApp', ['studyFlow.services', 'studyFlow.directives'])

  // Filtro customizado para formatar o booleano de status da tarefa em texto legível
  .filter('statusTarefa', function () {
    return function (concluida) {
      return concluida ? 'Concluída' : 'Pendente';
    };
  })

  // Controlador Principal utilizando $scope, two-way data binding e injeção de serviços
  .controller('MainController', [
    '$scope',
    '$interval',
    'TarefasFactory',
    'ToastService',
    function ($scope, $interval, TarefasFactory, ToastService) {
      var ITENS_POR_PAGINA = 4;
      var intervaloUpload = null;

      // Dados carregados a partir da Factory
      $scope.tarefas = TarefasFactory.obterTarefas();
      $scope.tiposEstudo = TarefasFactory.obterTiposEstudo();
      $scope.abasConteudo = TarefasFactory.obterAbas();
      $scope.perguntasFaq = TarefasFactory.obterFaq();

      // Modelos de formulário (ng-model) e paginação
      $scope.novaTarefa = {
        titulo: '',
        disciplina: $scope.tiposEstudo[0],
      };
      $scope.filtroStatus = 'todas';
      $scope.paginaAtual = 1;

      // Estado do simulador extra de Barra de Progresso (Upload)
      $scope.progressoUpload = 0;
      $scope.enviandoUpload = false;

      // Estado compartilhado com o ToastService
      $scope.toast = ToastService.estado;

      $scope.notificar = function (mensagem, tipo) {
        ToastService.mostrar(mensagem, tipo);
      };

      $scope.fecharToast = function () {
        ToastService.fechar();
      };

      // Cálculos de resumo e progresso geral
      $scope.totalConcluidas = function () {
        return $scope.tarefas.filter(function (t) {
          return t.concluida;
        }).length;
      };

      $scope.totalPendentes = function () {
        return $scope.tarefas.length - $scope.totalConcluidas();
      };

      $scope.percentualConcluido = function () {
        if ($scope.tarefas.length === 0) return 0;
        return Math.round(($scope.totalConcluidas() / $scope.tarefas.length) * 100);
      };

      // Opções passadas via binding para a diretiva <sf-dropdown-menu>
      function atualizarOpcoesDropdown() {
        $scope.opcoesFiltro = [
          {
            label: 'Todas as tarefas',
            active: $scope.filtroStatus === 'todas',
            callback: function () {
              $scope.aplicarFiltro('todas', 'Todas as tarefas');
            },
          },
          {
            label: 'Apenas pendentes',
            active: $scope.filtroStatus === 'pendentes',
            callback: function () {
              $scope.aplicarFiltro('pendentes', 'Apenas tarefas pendentes');
            },
          },
          {
            label: 'Apenas concluídas',
            active: $scope.filtroStatus === 'concluidas',
            callback: function () {
              $scope.aplicarFiltro('concluidas', 'Apenas tarefas concluídas');
            },
          },
        ];
      }

      $scope.rotuloFiltro = function () {
        if ($scope.filtroStatus === 'pendentes') return 'Filtro: Pendentes';
        if ($scope.filtroStatus === 'concluidas') return 'Filtro: Concluídas';
        return 'Filtro: Todas';
      };

      $scope.aplicarFiltro = function (novoFiltro, descricao) {
        $scope.filtroStatus = novoFiltro;
        $scope.paginaAtual = 1;
        atualizarOpcoesDropdown();
        ToastService.mostrar('Exibindo: ' + descricao, 'info');
      };

      atualizarOpcoesDropdown();

      // Filtra e pagina as tarefas
      $scope.obterTarefasFiltradas = function () {
        return $scope.tarefas.filter(function (tarefa) {
          if ($scope.filtroStatus === 'concluidas') return tarefa.concluida;
          if ($scope.filtroStatus === 'pendentes') return !tarefa.concluida;
          return true;
        });
      };

      $scope.totalPaginas = function () {
        var totalItens = $scope.obterTarefasFiltradas().length;
        return Math.max(1, Math.ceil(totalItens / ITENS_POR_PAGINA));
      };

      $scope.obterTarefasPaginadas = function () {
        var filtradas = $scope.obterTarefasFiltradas();
        var maxPaginas = $scope.totalPaginas();
        if ($scope.paginaAtual > maxPaginas) {
          $scope.paginaAtual = maxPaginas;
        }
        var inicio = ($scope.paginaAtual - 1) * ITENS_POR_PAGINA;
        return filtradas.slice(inicio, inicio + ITENS_POR_PAGINA);
      };

      $scope.mudarPagina = function (novaPagina) {
        $scope.paginaAtual = novaPagina;
      };

      // Ações de tarefas (manipulação de eventos ng-submit, ng-click, ng-change)
      $scope.adicionarTarefa = function () {
        var tituloLimpo = ($scope.novaTarefa.titulo || '').trim();
        if (!tituloLimpo) {
          ToastService.mostrar('Digite o título da tarefa antes de adicionar.', 'erro');
          return;
        }

        $scope.tarefas.unshift({
          id: Date.now(),
          titulo: tituloLimpo,
          disciplina: $scope.novaTarefa.disciplina,
          concluida: false,
        });

        $scope.novaTarefa.titulo = '';
        $scope.paginaAtual = 1;
        ToastService.mostrar(
          'Tarefa adicionada em "' + $scope.novaTarefa.disciplina + '"!',
          'sucesso'
        );
      };

      $scope.aoAlterarStatusTarefa = function (tarefa) {
        ToastService.mostrar(
          tarefa.concluida
            ? 'Tarefa marcada como concluída!'
            : 'Tarefa marcada como pendente.',
          tarefa.concluida ? 'sucesso' : 'info'
        );
      };

      $scope.removerTarefa = function (id) {
        $scope.tarefas = $scope.tarefas.filter(function (t) {
          return t.id !== id;
        });
        ToastService.mostrar('Tarefa removida da lista.', 'info');
      };

      // Simulador de upload dinâmico para demonstrar a diretiva Barra de Progresso
      $scope.iniciarSimulacaoUpload = function () {
        if (intervaloUpload) $interval.cancel(intervaloUpload);
        $scope.progressoUpload = 0;
        $scope.enviandoUpload = true;
        ToastService.mostrar('Iniciando envio do pacote da atividade...', 'info');

        intervaloUpload = $interval(function () {
          $scope.progressoUpload = Math.min(100, $scope.progressoUpload + 20);
          if ($scope.progressoUpload >= 100) {
            $interval.cancel(intervaloUpload);
            intervaloUpload = null;
            $scope.enviandoUpload = false;
            ToastService.mostrar('Arquivo enviado com 100% de conclusão!', 'sucesso');
          }
        }, 400);
      };

      $scope.avancarUploadManual = function () {
        if (intervaloUpload) {
          $interval.cancel(intervaloUpload);
          intervaloUpload = null;
        }
        $scope.enviandoUpload = false;
        $scope.progressoUpload = Math.min(100, $scope.progressoUpload + 25);
        if ($scope.progressoUpload === 100) {
          ToastService.mostrar('Progresso atingiu 100%!', 'sucesso');
        }
      };

      $scope.zerarUpload = function () {
        if (intervaloUpload) {
          $interval.cancel(intervaloUpload);
          intervaloUpload = null;
        }
        $scope.enviandoUpload = false;
        $scope.progressoUpload = 0;
        ToastService.mostrar('Barra de progresso reiniciada.', 'info');
      };
    },
  ]);
