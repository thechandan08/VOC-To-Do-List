document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const todoForm = document.querySelector('.todo-form');
            const todoInput = document.querySelector('.todo-input');
            const todoList = document.querySelector('.todo-list');
            const filterBtns = document.querySelectorAll('.filter-btn');
            const emptyState = document.querySelector('.empty-state');
            const totalTasksEl = document.querySelector('.total-tasks span');
            const completedTasksEl = document.querySelector('.completed-tasks span');
            const remainingTasksEl = document.querySelector('.remaining-tasks span');

            // State
            let todos = JSON.parse(localStorage.getItem('todos')) || [];
            let currentFilter = 'all';

            // Initialize
            renderTodos();
            updateStats();

            // Event Listeners
            todoForm.addEventListener('submit', addTodo);
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => filterTodos(btn.dataset.filter));
            });

            // Functions
            function addTodo(e) {
                e.preventDefault();
                
                const todoText = todoInput.value.trim();
                if (!todoText) return;

                const newTodo = {
                    id: Date.now(),
                    text: todoText,
                    completed: false,
                    createdAt: new Date().toISOString()
                };

                todos.push(newTodo);
                saveTodos();
                renderTodos();
                updateStats();
                
                todoInput.value = '';
                todoInput.focus();
            }

            function renderTodos() {
                if (todos.length === 0) {
                    emptyState.style.display = 'block';
                    todoList.innerHTML = '';
                    return;
                }

                emptyState.style.display = 'none';
                
                // Filter todos based on current filter
                let filteredTodos = todos;
                if (currentFilter === 'active') {
                    filteredTodos = todos.filter(todo => !todo.completed);
                } else if (currentFilter === 'completed') {
                    filteredTodos = todos.filter(todo => todo.completed);
                }

                todoList.innerHTML = filteredTodos.map(todo => `
                    <li class="todo-item" data-id="${todo.id}">
                        <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                        <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
                        <button class="delete-btn">Delete</button>
                    </li>
                `).join('');

                // Add event listeners to new elements
                document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('change', toggleTodo);
                });

                document.querySelectorAll('.delete-btn').forEach(btn => {
                    btn.addEventListener('click', deleteTodo);
                });
            }

            function toggleTodo(e) {
                const todoId = parseInt(e.target.parentElement.dataset.id);
                const todo = todos.find(todo => todo.id === todoId);
                todo.completed = e.target.checked;
                saveTodos();
                renderTodos();
                updateStats();
            }

            function deleteTodo(e) {
                const todoId = parseInt(e.target.parentElement.dataset.id);
                todos = todos.filter(todo => todo.id !== todoId);
                saveTodos();
                renderTodos();
                updateStats();
            }

            function filterTodos(filter) {
                currentFilter = filter;
                
                // Update active button
                filterBtns.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.filter === filter);
                });

                renderTodos();
            }

            function updateStats() {
                const total = todos.length;
                const completed = todos.filter(todo => todo.completed).length;
                const remaining = total - completed;

                totalTasksEl.textContent = total;
                completedTasksEl.textContent = completed;
                remainingTasksEl.textContent = remaining;
            }

            function saveTodos() {
                localStorage.setItem('todos', JSON.stringify(todos));
            }
        });
