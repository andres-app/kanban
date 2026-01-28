document.addEventListener('DOMContentLoaded', () => {
    loadProjects();

    document.getElementById('saveTaskBtn').addEventListener('click', () => {
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const assignee = document.getElementById('taskAssignee').value.trim();

        if (!title) {
            alert('El título es obligatorio');
            return;
        }

        if (editingCard) {
            editingCard.querySelector('.card-text').innerText = title;
            editingCard.querySelector('.card-description').innerText =
                description || 'Sin descripción';

            editingCard.querySelector('.assignee').innerHTML =
                assignee
                    ? `<span class="badge badge-warning text-white">Asignado a: ${assignee}</span>`
                    : '';
        } else {
            const card = createCardElement(title, assignee, description);
            document.getElementById(currentColumn).appendChild(card);
        }

        $('#taskModal').modal('hide');
        saveCards();
    });
});


/* =========================
   VARIABLES GLOBALES
========================= */

let currentProject = '';
let currentColumn = null;
let editingCard = null;

/* =========================
   PROYECTOS
========================= */

function loadProjects() {
    fetch('projects.json')
        .then(res => res.json())
        .then(projects => {
            const list = document.getElementById('project-list');
            list.innerHTML = '';

            projects.forEach(project => {
                const item = document.createElement('a');
                item.className = 'list-group-item list-group-item-action';
                item.textContent = project.name;
                item.id = project.id;
                item.onclick = () => loadKanbanBoard(project.id);
                list.appendChild(item);
            });

            if (projects.length > 0) {
                loadKanbanBoard(projects[0].id);
            }
        });
}

function updateActiveProject(projectId) {
    document.querySelectorAll('#project-list .list-group-item')
        .forEach(i => i.classList.remove('active'));

    document.getElementById(projectId)?.classList.add('active');
}

/* =========================
   TABLERO
========================= */

function loadKanbanBoard(projectId) {
    currentProject = projectId;

    fetch(`data-${projectId}.json`)
        .then(res => res.json())
        .then(data => {
            ['todo', 'inprogress', 'done'].forEach(id => {
                document.getElementById(id).innerHTML = '';
            });

            for (let columnId in data) {
                const column = document.getElementById(columnId);

                data[columnId].forEach(card => {
                    const cardEl = createCardElement(
                        card.text,
                        card.assignee,
                        card.description
                    );
                    column.appendChild(cardEl);
                });
            }

            updateActiveProject(projectId);
        });
}

/* =========================
   CREAR / EDITAR (MODAL)
========================= */

function addCard(columnId) {
    currentColumn = columnId;
    editingCard = null;

    document.getElementById('taskModalTitle').innerText = 'Nueva tarea';
    document.getElementById('taskForm').reset();

    $('#taskModal').modal('show');
}

function editTask(button) {
    editingCard = button.closest('.kanban-card');

    document.getElementById('taskModalTitle').innerText = 'Editar tarea';
    document.getElementById('taskTitle').value =
        editingCard.querySelector('.card-text').innerText;

    document.getElementById('taskDescription').value =
        editingCard.querySelector('.card-description').innerText === 'Sin descripción'
            ? ''
            : editingCard.querySelector('.card-description').innerText;

    document.getElementById('taskAssignee').value =
        editingCard.querySelector('.assignee').innerText
            .replace(/Asignado:? ?a?:?/gi, '')
            .trim();

    $('#taskModal').modal('show');
}

/* =========================
   CARD
========================= */

function createCardElement(text, assignee = '', description = 'Sin descripción') {
    const card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.id = generateId();

    card.innerHTML = `
        <div class="card-text">${text}</div>

        <div class="card-description">
            ${description || 'Sin descripción'}
        </div>

        <div class="assignee">
            ${assignee
                ? `<span class="badge badge-warning text-white">Asignado a: ${assignee}</span>`
                : ''
            }
        </div>

        <div class="mt-2">
            <button class="btn btn-sm btn-info" onclick="editTask(this)">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    card.ondragstart = drag;
    return card;
}

/* =========================
   GUARDAR (MODAL)
========================= */



/* =========================
   ELIMINAR
========================= */

function deleteTask(button) {
    if (!confirm('¿Eliminar esta tarea?')) return;
    button.closest('.kanban-card').remove();
    saveCards();
}

/* =========================
   DRAG & DROP
========================= */

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    const id = ev.dataTransfer.getData('text');
    const card = document.getElementById(id);

    if (ev.target.classList.contains('kanban-cards')) {
        ev.target.appendChild(card);
    } else if (ev.target.closest('.kanban-cards')) {
        ev.target.closest('.kanban-cards').appendChild(card);
    }

    saveCards();
}

document.addEventListener('dragover', allowDrop);
document.addEventListener('drop', drop);

/* =========================
   PERSISTENCIA
========================= */

function saveCards() {
    const columns = document.getElementsByClassName('kanban-cards');
    const data = { todo: [], inprogress: [], done: [] };

    for (let column of columns) {
        const columnId = column.id;

        for (let card of column.children) {
            data[columnId].push({
                text: card.querySelector('.card-text').innerText,
                description: card.querySelector('.card-description').innerText,
                assignee: card.querySelector('.assignee').innerText
                    .replace(/Asignado:? ?a?:?/gi, '')
                    .trim()
            });
        }
    }

    fetch(`save.php?project=${currentProject}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

/* =========================
   UTIL
========================= */

function generateId() {
    return 'card-' + Math.random().toString(36).substr(2, 9);
}
