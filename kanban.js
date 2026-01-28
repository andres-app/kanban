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
let activeProjectId = null;

/* =========================
   PROYECTOS
========================= */

function loadProjects() {
    fetch('projects.json?v=' + Date.now())
        .then(res => res.json())
        .then(projects => {
            const list = document.getElementById('project-list');
            list.innerHTML = '';

            projects.forEach(project => {
                const item = document.createElement('div');
                item.className = 'project-item';
                item.dataset.id = project.id;

                if (project.id === activeProjectId) {
                    item.classList.add('active');
                }

                item.innerHTML = `
                    <span class="project-name">${project.name}</span>
                    <button class="project-menu" title="Opciones">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>

                    <div class="project-actions">
                        <button class="btn btn-sm btn-danger"
                            onclick="deleteProject('${project.id}')">
                            Eliminar
                        </button>
                        <button class="btn btn-sm btn-light"
                            onclick="closeActions(this)">
                            Cancelar
                        </button>
                    </div>
                `;

                // seleccionar proyecto
                item.querySelector('.project-name').onclick = () => {
                    activeProjectId = project.id;
                    loadKanbanBoard(project.id);
                    highlightActiveProject();
                };

                // mostrar acciones
                item.querySelector('.project-menu').onclick = (e) => {
                    e.stopPropagation();
                    toggleActions(item);
                };

                list.appendChild(item);
            });
        });
}

function closeFlip(btn) {
    const card = btn.closest('.project-card');
    card.style.transform = 'rotateY(0deg)';
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

function openProjectModal() {
    document.getElementById('projectName').value = '';
    $('#projectModal').modal('show');
}

function saveProject() {
    const name = document.getElementById('projectName').value.trim();
    if (!name) {
        alert('El nombre del proyecto es obligatorio');
        return;
    }

    const id = 'project-' + Date.now();

    fetch('projects.json')
        .then(res => {
            if (!res.ok) throw new Error('No se pudo leer projects.json');
            return res.json();
        })
        .then(projects => {
            if (!Array.isArray(projects)) projects = [];

            projects.push({ id, name });

            return fetch('save-projects.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(projects)
            });
        })
        .then(res => {
            if (!res.ok) throw new Error('No se pudo guardar projects.json');

            return fetch(`save.php?project=${id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ todo: [], inprogress: [], done: [] })
            });
        })
        .then(() => {
            $('#projectModal').modal('hide');
            loadProjects();
        })
        .catch(err => {
            console.error(err);
            alert('Error creando el proyecto. Revisa consola.');
        });
}

function deleteProject(projectId) {
    if (!confirm('¿Eliminar este proyecto y todas sus tareas?')) return;

    fetch('projects.json?v=' + Date.now())
        .then(res => res.json())
        .then(projects => {
            const filtered = projects.filter(p => p.id !== projectId);

            return fetch('save-projects.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(filtered)
            });
        })
        .then(() => {
            return fetch(`delete-project.php?project=${projectId}`);
        })
        .then(() => {
            currentProject = '';
            loadProjects();
        });
}

function toggleActions(item) {
    document.querySelectorAll('.project-item')
        .forEach(i => i.classList.remove('show-actions'));

    item.classList.add('show-actions');
}

function closeActions(btn) {
    btn.closest('.project-item').classList.remove('show-actions');
}

function highlightActiveProject() {
    document.querySelectorAll('.project-item')
        .forEach(i => i.classList.remove('active'));

    const active = document.querySelector(
        `.project-item[data-id="${activeProjectId}"]`
    );

    if (active) active.classList.add('active');
}

$("#sidebar-close").on("click", function () {
    $("#wrapper").removeClass("toggled");
});

