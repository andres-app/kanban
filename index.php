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
                <button class="btn btn-primary ml-auto" onclick="addCard('todo')">Añadir Tarea</button>
                <a href="logout.php" class="btn btn-danger ml-2">
                    <i class="fas fa-sign-out-alt"></i>
                </a>
            </nav>

            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <h4>To Do</h4>
                        <div class="kanban-cards" id="todo"></div>
                    </div>
                    <div class="col-md-4">
                        <h4>In Progress</h4>
                        <div class="kanban-cards" id="inprogress"></div>
                    </div>
                    <div class="col-md-4">
                        <h4>Done</h4>
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
</body>
</html>
