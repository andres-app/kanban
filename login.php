<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Kanban</title>

    <!-- Bootstrap 5 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- CSS solo login -->
    <link rel="stylesheet" href="login.css?v=<?= time() ?>">
</head>
<body class="login-page">

<div class="container min-vh-100 d-flex align-items-center justify-content-center">
    <div class="row w-100 justify-content-center">
        <div class="col-12 col-sm-10 col-md-6 col-lg-4">

            <div class="card shadow-sm border-0 rounded-4 p-4">
                <div class="text-center mb-4">
                    <h3 class="fw-bold">Kanban</h3>
                    <p class="text-muted mb-0">Iniciar sesión</p>
                </div>

                <form action="login_process.php" method="POST">

                    <!-- USUARIO -->
                    <div class="mb-3">
                        <label class="form-label">Usuario</label>
                        <input
                            type="text"
                            name="username"
                            class="form-control form-control-lg"
                            required
                            autofocus
                        >
                    </div>

                    <!-- CONTRASEÑA -->
                    <div class="mb-4">
                        <label class="form-label">Contraseña</label>
                        <input
                            type="password"
                            name="password"
                            class="form-control form-control-lg"
                            placeholder="••••••••"
                            required
                        >
                    </div>

                    <!-- BOTÓN -->
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary btn-lg rounded-pill">
                            Entrar
                        </button>
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>

<!-- Bootstrap JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
