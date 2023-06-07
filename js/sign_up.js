const form = {
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    password_confirm: document.getElementById('password_confirm'),
    button: document.querySelector('.button'),
    error: document.querySelector('.input-error')
}
console.log(form.email);

function checkForm() {
    const email = form.email.getElementsByTagName('input')[0].value;
    const password = form.password.getElementsByTagName('input')[0].value;
    const password_confirm = form.password_confirm.getElementsByTagName('input')[0].value;
    if (email && password && password_confirm) {
        form.button.classList.remove('disable')
    } else {
        form.button.classList.add('disable')
    }
}

function handleInput(e, name) {
    const { value } = e.target
    if (value) {
        form[name].classList.add('filed')
    } else {
        form[name].classList.remove('filed')
    }
    checkForm()
}

function deleteError() {
    form.email.classList.remove('error')
    form.error.classList.remove('view')
}

function validateEmail() {
    const { value } = form.email.getElementsByTagName('input')[0]
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (reg.test(value)) {
        deleteError()
    } else {
        form.button.classList.add('disable')
        form.email.classList.add('error')
        form.error.classList.add('view')
    }
}

function validatePassword() {
    const password = form.password.getElementsByTagName('input')[0];
    const password_confirm = form.password_confirm.getElementsByTagName('input')[0];
    // Перевіряємо, чи поля мають однакові значення
    if (password.value !== password_confirm.value) {
        // Відміна стандартної поведінки форми
        form.button.classList.add('disable')

        // Виводимо повідомлення про неправильно введені дані
        alert("Поля пароля не співпадають!");
    }
}

form.email.oninput = (e) => handleInput(e, 'email')
form.password.oninput = (e) => handleInput(e, 'password')
form.password_confirm.oninput = (e) => handleInput(e, 'password_confirm')
form.button.onclick = function () {
    validateEmail();
    validatePassword();
};
form.email.getElementsByTagName('input')[0].onblur = validateEmail
form.email.getElementsByTagName('input')[0].onfocus = deleteError