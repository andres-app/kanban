<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tablero KANBAN</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container-fluid">
        <div class="row no-gutter">
            <div class="col-md-6 d-none d-md-flex bg-image"></div>
            <div class="col-md-6 bg-light">
                <div class="login d-flex align-items-center py-5">
                    <div class="container">
                        <div class="row">
                            <div class="col-lg-10 col-xl-7 mx-auto">
                                <h3 class="display-4">Tablero Kanban</h3>
                                <p class="text-muted mb-4">Ingrese sus credenciales.</p>
                                <form action="login_process.php" method="POST">
                                    <div class="form-group mb-3">
                                        <input id="inputEmail" type="text" name="username" placeholder="Ingrese Correo Electrónico" required autofocus class="form-control rounded-pill border-0 shadow-sm px-4">
                                    </div>
                                    <div class="form-group mb-3">
                                        <input id="inputPassword" type="password" name="password" placeholder="Ingrese Contraseña" required class="form-control rounded-pill border-0 shadow-sm px-4 text-primary">
                                    </div>
                                    <div class="custom-control custom-checkbox mb-3">
                                        <input id="customCheck1" type="checkbox" class="custom-control-input">
                                        <label for="customCheck1" class="custom-control-label">Recuérdame</label>
                                    </div>
                                    <div class="text-center">
                                    <button type="submit" class="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Acceder</button>
                                    </div>
                                    <div class="text-center">
                                        <a href="#" class="btn btn-outline-danger btn-block text-uppercase mb-2 rounded-pill shadow-sm">Iniciar sesión con Google</a>
                                    </div>
                                    <div class="text-center">
                                        <a href="#" class="d-block text-muted mt-2 small">¿Olvidaste tu contraseña?</a>
                                        <a href="#" class="d-block text-muted mt-2 small">No tienes cuenta? Regístrate</a>
                                        <a href="#" class="d-block text-muted mt-2 small">¿Eres colaborador? Acceder</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap JS and dependencies -->
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.5.4/dist/umd/popper.min.js"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
