document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // Verificar las credenciales
        fetch('users.json')
            .then(response => response.json())
            .then(data => {
                const validUser = data.users.find(user => user.username === username && user.password === password);
                if (validUser) {
                    // Credenciales válidas, redirigir a la página del tablero kanban (index.php)
                    window.location.href = 'index.php';
                } else {
                    // Credenciales inválidas, mostrar mensaje de error
                    loginError.textContent = 'Usuario o contraseña incorrectos. Por favor, inténtalo de nuevo.';
                }
            })
            .catch(error => {
                console.error('Error cargando usuarios:', error);
                loginError.textContent = 'Error de autenticación. Por favor, intenta más tarde.';
            });
    });
});
