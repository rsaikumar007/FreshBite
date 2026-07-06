const authForm = document.querySelector('#auth-form');

const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

if (authForm) {
    authForm.addEventListener('submit', (event) => {
        const emailInput = authForm.querySelector('input[type="email"]');
        const passwordInput = authForm.querySelector('input[type="password"]');
        const confirmInput = authForm.querySelector('input[name="confirm"]');
        const termsCheckbox = authForm.querySelector('#termsCheck');
        const usernameInput = authForm.querySelector('input[type="text"]');
        const phoneInput = authForm.querySelector('input[type="tel"]');

        let isValid = true;

        // Clear previous invalid states
        authForm.querySelectorAll('.is-invalid').forEach(el => el.classList.remove('is-invalid'));

        // Email validation
        if (!emailInput?.value.trim()) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }

        // Password validation
        if (!passwordInput?.value.trim()) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }

        // Signup specific validations
        if (confirmInput) {
            if (!confirmInput.value.trim()) {
                confirmInput.classList.add('is-invalid');
                isValid = false;
            } else if (passwordInput.value !== confirmInput.value) {
                confirmInput.classList.add('is-invalid');
                confirmInput.nextElementSibling.textContent = 'Passwords do not match.';
                isValid = false;
            }

            if (!termsCheckbox?.checked) {
                termsCheckbox.classList.add('is-invalid');
                isValid = false;
            }

            if (!usernameInput?.value.trim()) {
                usernameInput.classList.add('is-invalid');
                isValid = false;
            }

            if (!phoneInput?.value.trim() || !/^[0-9]{10}$/.test(phoneInput.value.trim())) {
                phoneInput.classList.add('is-invalid');
                isValid = false;
            }
        }

        if (!isValid) {
            event.preventDefault();
            event.stopPropagation();
            authForm.classList.add('was-validated');
        } else {
            event.preventDefault(); 
            const redirectUrl = authForm.dataset.redirect || 'index.html';
            const actionLabel = confirmInput ? 'Account created' : 'Welcome back';
            alert(`${actionLabel}! Redirecting now.`);
            window.location.href = redirectUrl;
        }
    });
}
