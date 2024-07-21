<?php
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Depuración: Verificar que los datos del formulario se están enviando
    var_dump($username, $password);

    // Leer el archivo JSON
    $users = json_decode(file_get_contents('users.json'), true);

    if (isset($users[$username]) && $users[$username]['password'] === $password) {
        // Credenciales correctas, iniciar sesión
        $_SESSION['username'] = $username;
        header('Location: index.php'); // Redirigir al tablero
        exit();
    } else {
        // Credenciales incorrectas, mostrar mensaje de error
        echo "Usuario o contraseña incorrectos. <a href='login.php'>Volver al login</a>";
    }
} else {
    // Si no es una solicitud POST, redirigir al formulario de login
    header('Location: login.php');
    exit();
}
?>
