<?php
session_start();

// Verificar si el usuario ha iniciado sesión
if (!isset($_SESSION['username'])) {
    header('Location: login.php'); // Redirigir al login si no hay sesión activa
    exit();
}

?>

<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kanban Board</title>
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="kanban.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">
</head>

<body>
    <div class="d-flex toggled" id="wrapper">
        <!-- Sidebar -->
        <div class="bg-light border-right" id="sidebar-wrapper">
            <div class="sidebar-heading">Proyectos</div>
            <div class="list-group list-group-flush" id="project-list">
                <!-- Projects will be loaded here dynamically -->
            </div>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div id="page-content-wrapper">
            <nav class="navbar navbar-expand-lg navbar-light bg-light border-bottom">
                <button class="btn btn-primary" id="menu-toggle">☰</button>
                <span class="navbar-brand"></span>
                <button class="btn btn-success ml-auto mr-2" onclick="openProjectModal()">
                    <i class="fas fa-folder-plus"></i> Proyecto
                </button>
                <button class="btn btn-primary" onclick="addCard('todo')">
                    <i class="fas fa-plus"></i> Tarea
                </button>
                <a href="logout.php" class="btn btn-danger ml-2">
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </nav>

            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <h4>Pendientes</h4>
                        <div class="kanban-cards" id="todo"></div>
                    </div>
                    <div class="col-md-4">
                        <h4>En Progreso</h4>
                        <div class="kanban-cards" id="inprogress"></div>
                    </div>
                    <div class="col-md-4">
                        <h4>Terminado</h4>
                        <div class="kanban-cards" id="done"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /#page-content-wrapper -->
    </div>
    <!-- /#wrapper -->

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.2/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="kanban.js"></script>
    <script>
        $(document).ready(function() {
            $("#menu-toggle").click(function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });
        });
    </script>

    <!-- =========================
     MODAL TAREA
========================= -->
    <div class="modal fade" id="taskModal" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content rounded-lg shadow">

                <div class="modal-header border-0">
                    <h5 class="modal-title" id="taskModalTitle">Nueva tarea</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <form id="taskForm">

                        <div class="form-group">
                            <label>Título</label>
                            <input type="text" class="form-control" id="taskTitle" required>
                        </div>

                        <div class="form-group">
                            <label>Descripción</label>
                            <textarea class="form-control" id="taskDescription" rows="3"
                                placeholder="Opcional"></textarea>
                        </div>

                        <div class="form-group">
                            <label>Asignado a</label>
                            <input type="text" class="form-control" id="taskAssignee"
                                placeholder="Opcional">
                        </div>

                    </form>
                </div>

                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-light" data-dismiss="modal">
                        Cancelar
                    </button>
                    <button type="button" class="btn btn-primary" id="saveTaskBtn">
                        Guardar
                    </button>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="projectModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content rounded-lg shadow">

                <div class="modal-header border-0">
                    <h5 class="modal-title">Nuevo proyecto</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label>Nombre del proyecto</label>
                        <input type="text" class="form-control" id="projectName">
                    </div>
                </div>

                <div class="modal-footer border-0">
                    <button class="btn btn-light" data-dismiss="modal">Cancelar</button>
                    <button class="btn btn-primary" onclick="saveProject()">Guardar</button>
                </div>

            </div>
        </div>
    </div>


</body>

</html>