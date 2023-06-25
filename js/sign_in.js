const form = {
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    button: document.querySelector('.button'),
    error: document.querySelector('.input-error')
}
console.log(form.email);

function checkForm() {
    const email = form.email.getElementsByTagName('input')[0].value;
    const password = form.password.getElementsByTagName('input')[0].value;
    if (email && password) {
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

function deleteError () {
    form.email.classList.remove('error')
    form.error.classList.remove('view')
}

function validateEmail() {
    const { value } = form.email.getElementsByTagName('input')[0]
    const reg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (reg.test(value)) {
        deleteError ()
    } else {
        form.button.classList.add('disable')
        form.email.classList.add('error')
        form.error.classList.add('view')
    }
}

form.email.oninput = (e) => handleInput(e, 'email')
form.password.oninput = (e) => handleInput(e, 'password')
form.button.onclick = validateEmail
form.email.getElementsByTagName('input')[0].onblur = validateEmail
form.email.getElementsByTagName('input')[0].onfocus = deleteError

// form.button.onclick = () => {
//     redirectToPage();
//   };

// function redirectToPage() {
//     window.location.href = "K:\2 kurs\2 semester\CursWork\html\index.html";
// }
document.querySelector("#sign-in").addEventListener("click", () => {
    let email = document.querySelector("#emaill").value;
    let password = document.querySelector("#pass").value;
    fetch(
        `https://localhost:44396/api/Mail/login?email=${email}&password=${password}`,
        {
            method: "POST",
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.status == 200) {
                localStorage.setItem("user", email);
                window.location.href = "../html/index.html";
            }
        })
})