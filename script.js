// Captura dos elementos principais da página
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const prioritySelect = document.getElementById('priority-select');
const taskList = document.getElementById('task-list');
const feedback = document.getElementById('feedback');
const emptyState = document.getElementById('empty-state');
const clearCompletedButton = document.getElementById('clear-completed');

// Vetor que armazenará as tarefas em memória durante o uso da página
let tasks = [];

// Atualiza a mensagem de estado vazio
function updateEmptyState() {
  emptyState.classList.toggle('hidden', tasks.length > 0);
}

// Exibe uma mensagem de feedback temporária para o usuário
function showFeedback(message) {
  feedback.textContent = message;

  setTimeout(() => {
    feedback.textContent = '';
  }, 2500);
}

// Converte o valor interno da prioridade para um texto mais amigável
function formatPriority(priority) {
  const priorities = {
    alta: 'Alta',
    media: 'Média',
    baixa: 'Baixa'
  };

  return priorities[priority] || priority;
}

// Renderiza a lista de tarefas na tela
function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item priority-${task.priority} ${task.completed ? 'completed' : ''}`;
    li.setAttribute('data-id', task.id);

    li.innerHTML = `
      <div class="task-content">
        <span class="task-title">${task.description}</span>
        <span class="task-meta">Prioridade: ${formatPriority(task.priority)}</span>
      </div>
      <div class="task-actions">
        <button type="button" class="btn-complete">
          ${task.completed ? 'Reabrir' : 'Concluir'}
        </button>
        <button type="button" class="btn-delete">Excluir</button>
      </div>
    `;

    const completeButton = li.querySelector('.btn-complete');
    const deleteButton = li.querySelector('.btn-delete');

    completeButton.addEventListener('click', () => toggleTask(task.id));
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(li);
  });

  updateEmptyState();
}

// Adiciona uma nova tarefa à lista
function addTask(description, priority) {
  const newTask = {
    id: Date.now(),
    description,
    priority,
    completed: false
  };

  tasks.push(newTask);
  renderTasks();
  showFeedback('Tarefa adicionada com sucesso.');
}

// Alterna o estado de conclusão de uma tarefa
function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );

  renderTasks();
  showFeedback('Status da tarefa atualizado.');
}

// Exclui uma tarefa da lista
function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  renderTasks();
  showFeedback('Tarefa removida com sucesso.');
}

// Remove todas as tarefas concluídas
function clearCompletedTasks() {
  const previousLength = tasks.length;
  tasks = tasks.filter((task) => !task.completed);

  if (tasks.length === previousLength) {
    showFeedback('Não há tarefas concluídas para remover.');
    return;
  }

  renderTasks();
  showFeedback('Tarefas concluídas removidas.');
}

// Evento de envio do formulário
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const description = taskInput.value.trim();
  const priority = prioritySelect.value;

  if (description === '') {
    showFeedback('Digite uma tarefa antes de adicionar.');
    taskInput.focus();
    return;
  }

  addTask(description, priority);
  taskForm.reset();
  prioritySelect.value = 'baixa';
  taskInput.focus();
});

// Evento do botão para limpar concluídas
clearCompletedButton.addEventListener('click', clearCompletedTasks);

// Renderização inicial
renderTasks();
