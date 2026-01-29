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
    <!-- Bootstrap 5 (una sola versión) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

    <!-- Tu CSS con anti-cache -->
    <link rel="stylesheet" href="kanban.css?v=<?= time() ?>">

</head>

<body>
    <div id="sidebar-overlay"></div>
    <div id="wrapper">
        <!-- Sidebar -->
        <div class="bg-light border-right" id="sidebar-wrapper">
            <div class="sidebar-heading d-flex align-items-center justify-content-between">
                <span>Proyectos</span>

                <!-- BOTÓN CERRAR (SOLO MOBILE) -->
                <button class="btn btn-sm btn-light d-md-none" id="sidebar-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <div class="list-group list-group-flush" id="project-list">
                <!-- Projects will be loaded here dynamically -->
            </div>
        </div>
        <!-- /#sidebar-wrapper -->

        <!-- Page Content -->
        <div id="page-content-wrapper">
            <nav class="navbar navbar-light bg-light border-bottom kanban-navbar">

                <!-- BOTÓN MENÚ -->
                <button class="btn btn-primary" id="menu-toggle">
                    <i class="fas fa-bars"></i>
                </button>

                <!-- ESPACIO / BRAND (opcional) -->
                <span class="navbar-brand d-none d-md-inline"></span>

                <!-- ACCIONES DERECHA -->
                <div class="navbar-actions ml-auto">

                    <!-- NUEVO PROYECTO -->
                    <button class="btn btn-success" onclick="openProjectModal()">
                        <i class="fas fa-folder-plus"></i>
                        <span class="d-none d-md-inline">Proyecto</span>
                    </button>

                    <!-- NUEVA TAREA -->
                    <button class="btn btn-primary" onclick="addCard('todo')">
                        <i class="fas fa-plus"></i>
                        <span class="d-none d-md-inline">Tarea</span>
                    </button>

                    <!-- LOGOUT -->
                    <a href="logout.php" class="btn btn-danger">
                        <i class="fas fa-sign-out-alt"></i>
                    </a>

                </div>
            </nav>


            <div class="container-fluid mt-4">
                <div class="row kanban-row flex-nowrap flex-md-wrap">
                    <div class="col-12 col-md-6 col-lg-4 kanban-col">
                        <h4>Pendientes</h4>
                        <div class="kanban-cards" id="todo"></div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 kanban-col">
                        <h4>En Progreso</h4>
                        <div class="kanban-cards" id="inprogress"></div>
                    </div>

                    <div class="col-12 col-md-6 col-lg-4 kanban-col">
                        <h4>Terminado</h4>
                        <div class="kanban-cards" id="done"></div>
                    </div>
                </div>
            </div>
        </div>
        <!-- /#page-content-wrapper -->
    </div>
    <!-- /#wrapper -->

    <!-- jQuery (necesario porque tu JS lo usa) -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

    <!-- Bootstrap 5 bundle (incluye Popper) -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>

    <!-- Tu JS con anti-cache -->
    <script src="kanban.js?v=<?= time() ?>"></script>

    <script>
        $(document).ready(function() {

            $("#menu-toggle").on("click", function(e) {
                e.preventDefault();
                $("#wrapper").toggleClass("toggled");
            });

            $("#sidebar-overlay").on("click", function() {
                $("#wrapper").removeClass("toggled");
            });

        });
    </script>


    <!-- =========================
     MODAL TAREA
    ========================= -->
    <div class="modal fade" id="taskModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content rounded-4 shadow">

                <div class="modal-header">
                    <h5 class="modal-title" id="taskModalTitle">Nueva tarea</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">

                    <div class="mb-3">
                        <label class="form-label">Título</label>
                        <input type="text" class="form-control" id="taskTitle">
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Descripción</label>
                        <textarea class="form-control" id="taskDescription" rows="3"
                            placeholder="Opcional"></textarea>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Asignado a</label>
                        <input type="text" class="form-control" id="taskAssignee"
                            placeholder="Opcional">
                    </div>

                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-light" data-bs-dismiss="modal">
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
                <div class="modal-header">
                    <h5 class="modal-title">Nuevo proyecto</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
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