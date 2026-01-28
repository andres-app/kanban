document.addEventListener('DOMContentLoaded', (event) => {
    loadProjects();
});

let currentProject = '';

function loadProjects() {
    fetch('projects.json')
        .then(response => response.json())
        .then(projects => {
            const projectList = document.getElementById('project-list');
            projects.forEach(project => {
                let projectItem = document.createElement('a');
                projectItem.className = 'list-group-item list-group-item-action';
                projectItem.innerText = project.name;
                projectItem.id = project.id;
                projectItem.onclick = () => {
                    loadKanbanBoard(project.id);
                };
                projectList.appendChild(projectItem);
            });

            if (projects.length > 0) {
                loadKanbanBoard(projects[0].id); // Load the first project by default
            }
        });
}

function loadKanbanBoard(projectId) {
    currentProject = projectId;
    fetch(`data-${projectId}.json`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('todo').innerHTML = '';
            document.getElementById('inprogress').innerHTML = '';
            document.getElementById('done').innerHTML = '';
            for (let columnId in data) {
                let column = document.getElementById(columnId);
                for (let card of data[columnId]) {
                    let cardElement = createCardElement(card.text, card.assignee);
                    column.appendChild(cardElement);
                }
            }
            updateActiveProject(projectId);
        });
}

function updateActiveProject(projectId) {
    const projectListItems = document.querySelectorAll('#project-list .list-group-item');
    projectListItems.forEach(item => {
        item.classList.remove('active');
    });
    document.getElementById(projectId).classList.add('active');
}

function addCard(columnId) {
    let cardText = prompt("Ingrese la descripción de la tarea:");
    if (cardText) {
        let cardElement = createCardElement(cardText, '');
        document.getElementById(columnId).appendChild(cardElement);
        saveCards();
    }
}

function createCardElement(text, assignee) {
    let card = document.createElement('div');
    card.className = 'kanban-card';
    card.draggable = true;
    card.id = generateId();

    card.innerHTML = `
        <div class="card-text">${text}</div>

        <div class="card-description text-muted">
            Sin descripción
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

            <button class="btn btn-sm btn-secondary" onclick="assignTask(this)">
                <i class="fas fa-user"></i>
            </button>

            <button class="btn btn-sm btn-danger" onclick="deleteTask(this)">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

    card.ondragstart = drag;
    return card;
}


function deleteTask(button) {
    if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;

    let card = button.closest('.kanban-card');
    card.remove();
    saveCards();
}


function editTask(button) {
    let card = button.closest('.kanban-card');
    let textDiv = card.querySelector('.card-text');

    let nuevoTexto = prompt("Editar descripción de la tarea:", textDiv.innerText);

    if (nuevoTexto !== null && nuevoTexto.trim() !== '') {
        textDiv.innerText = nuevoTexto.trim();
        saveCards();
    }
}


function assignTask(button) {
    let assignee = prompt("Ingrese el nombre de la persona asignada:");
    if (!assignee) return;

    let card = button.closest('.kanban-card'); // ✅ CORRECTO
    let assigneeDiv = card.querySelector('.assignee');

    assigneeDiv.innerHTML = `
        <span class="badge badge-warning text-white">
            Asignado a: ${assignee}
        </span>
    `;

    saveCards();
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var card = document.getElementById(data);

    if (ev.target.className.includes('kanban-cards')) {
        ev.target.appendChild(card);
        saveCards();
    } else if (ev.target.parentElement.className.includes('kanban-cards')) {
        ev.target.parentElement.appendChild(card);
        saveCards();
    }
}

function saveCards() {
    let columns = document.getElementsByClassName('kanban-cards');
    let data = {
        todo: [],
        inprogress: [],
        done: []
    };

    for (let column of columns) {
        let columnId = column.id;
        for (let card of column.children) {
            let cardData = {
                text: card.querySelector('.card-text').innerText,
                assignee: card.querySelector('.assignee').innerText
                    .replace(/Asignado:? ?a?:? /gi, '')
                    .trim()
            };
            data[columnId].push(cardData);
        }
    }

    fetch(`save.php?project=${currentProject}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
}

function generateId() {
    return 'card-' + Math.random().toString(36).substr(2, 9);
}

document.addEventListener('dragover', allowDrop);
document.addEventListener('drop', drop);
