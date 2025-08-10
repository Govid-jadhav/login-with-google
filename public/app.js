const tabs = document.querySelectorAll('#authTabs .nav-link');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

tabs.forEach(tab => {
    tab.addEventListener('click', function (e) {
        e.preventDefault();
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        if (this.dataset.form === 'loginForm') {
            loginForm.style.display = 'block';
            signupForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
        }
    });
});