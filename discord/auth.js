function auth(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:8080/api/login', 
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        }).then(response => response.json()).then(data => {
            localStorage.setItem("token", data);
            window.location.href = "index.html";
            }).catch(() => {
                document.getElementById('emailLabel').children[0].classList.replace('text-gray-300', 'text-red-500');
                document.getElementById('emailLabel').children[1].classList.remove('text-red-300', 'text-sm', 'font-bold');
                document.getElementById('emailLabel').children[1].classList.add('text-red-500', 'text-xs', 'font-medium');
                document.getElementById('emailLabel').children[1].innerText = '- Login or password is invalid';
                document.getElementById('email').classList.add('border', 'border-red-500');

                document.getElementById('passwordLabel').children[0].classList.replace('text-gray-300', 'text-red-500');
                document.getElementById('passwordLabel').children[1].classList.remove('text-red-300', 'text-sm', 'font-bold');
                document.getElementById('passwordLabel').children[1].classList.add('text-red-500', 'text-xs', 'font-medium');
                document.getElementById('passwordLabel').children[1].innerText = '- Login or password is invalid';
                document.getElementById('password').classList.add('border', 'border-red-500');
            });
}