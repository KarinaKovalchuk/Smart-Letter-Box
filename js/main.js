window.onload = () => {
  loadMessages("received");
  document.querySelector(".user__name").innerText = localStorage.getItem("user")
}
function loadCount() {
  fetch(
    `https://localhost:44396/api/Mail/get-count-unread-message?received=${localStorage.getItem("user")}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      document.getElementById("count-of-letters").innerText = ` ${data} `;
    })
}
let menu = document.querySelectorAll(".menu img");
menu.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("img.active-filter").classList.remove("active-filter");
    btn.classList.add("active-filter");
    loadMessages(btn.id);
  });
});

function loadMessages(id) {
  console.log(id);
  let mainDiv = document.querySelector("#list-messages");
  mainDiv.innerHTML = "";
  fetch(
    `https://localhost:44396/api/Mail/get-${id}-letters?${id}=${localStorage.getItem("user")}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);

      data.forEach(item => {
        let div = document.createElement("div");
        div.className = "mail__object d-flex justify-content-between";
        let title = document.createElement("p");
        title.className = "width";
        title.innerText = item.title;
        let isReaden = document.createElement("input");
        isReaden.type = "checkbox";
        isReaden.checked = item.isReaden;
        let trash = document.createElement("img");
        trash.src = "../img/trash.png";
        trash.className = "trash";
        trash.addEventListener("click", () => {
          fetch(
            `https://localhost:44396/api/Mail/delete-by-id?id=${item.id}`, {
            method: "POST",
          }).then((response) => {
            if (response.status == 200) {
              loadMessages(id);
              notifier("Лист успішно видалено", "success");
            }

          })
        })
        isReaden.addEventListener("click", () => {
          fetch(
            `https://localhost:44396/api/Mail/set-is-readen?id=${item.id}`, {
            method: "POST",
          }).then((response) => {
            if (response.status == 200) {
              loadMessages(document.querySelector("img.active-filter").id);
              notifier("Лист прочитано", "success");
            }
            else {
              alert(response.status);
            }
          }
          )
        })
        if (item.isReaden) {
          title.style.color = "lightGray"
          isReaden.disabled = true;
        }
        div.append(title);
        div.append(isReaden);
        div.append(trash);
        mainDiv.append(div);
        title.addEventListener("click", () => {
          // showPopup(item.title, item.desc);
          document.getElementById("editModal").style.display = "block";
          document.getElementById("editModal").classList.add("show");
          document.getElementById("editModalTitle").innerText = item.title;
          document.getElementById("sender-email").innerText = item.sender
          document.getElementById("modalDescription").innerText = item.description;
          document.getElementById("btn-close").addEventListener("click", () => {
            document.getElementById("editModal").style.display = "none";
            document.getElementById("editModal").classList.remove("show");
          })
        });
      });
      if (data.length == 0) {
        console.log(data)
        mainDiv.innerHTML = "<p class='text'>You don't have letters</p>"
      }
    });
  loadCount();
}


document.querySelector("#btn-send").addEventListener("click", () => {
  let received = document.querySelector("#email").value;
  let title = document.getElementById("theme").value;
  let desc = document.querySelector("#text-message").value;
  let sender = localStorage.getItem("user");

  fetch(
    `https://localhost:44396/api/Mail/add-letter?title=${title}&desc=${desc}&sender=${sender}&received=${received}`,
    {
      method: "POST",
    })
    .then((response) => response.json())
    .then((data) => {
      fetch(
        `https://localhost:44396/api/Mail/is-sended?id=${data.id}`
      )
        .then((response2) => response2.json())
        .then((data2) => {
          console.log(data2)
          loadMessages(document.querySelector("img.active-filter").id);
          notifier("Лист успішно додано", "success");
        })
      clearFields();
    })
})

function clearFields() {
  console.log("clear");
  document.querySelector("#email").value = "";
  document.getElementById("theme").value = "";
  document.querySelector("#text-message").value = "";
}

function Noti({ icon = 'success', text, timer = 0 }) {
  var noti_con = document.createElement('div');
  var noti_alert = document.createElement('div');
  var noti_icon = document.createElement('div');
  noti_icon.setAttribute('class', 'Noti_icon')
  noti_con.setAttribute('class', 'Noti_con');
  noti_alert.setAttribute('class', 'noti_alert');
  document.body.appendChild(noti_con);
  document.querySelector('.Noti_con').prepend(noti_alert);
  noti_alert.innerHTML = '<p>' + text + '</p>';
  noti_alert.append(noti_icon);
  if (icon == 'success') {
    noti_icon.style.background = '#00b972';
    noti_icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0"/></path></g></svg>`;

  } else if (icon == 'info') {
    noti_icon.style.background = '#0395FF';
    noti_icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/></path><path stroke-dasharray="20" stroke-dashoffset="20" d="M8.99999 10C8.99999 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10C15 10.9814 14.5288 11.8527 13.8003 12.4C13.0718 12.9473 12.5 13 12 14"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.4s" values="20;0"/></path></g><circle cx="12" cy="17" r="1" fill="currentColor" fill-opacity="0"><animate fill="freeze" attributeName="fill-opacity" begin="1s" dur="0.2s" values="0;1"/></circle></svg>`;

  } else if (icon == 'danger' || icon == 'error') {
    noti_icon.style.background = '#FF032C';
    noti_icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/></path><path stroke-dasharray="8" stroke-dashoffset="8" d="M12 12L16 16M12 12L8 8M12 12L8 16M12 12L16 8"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="8;0"/></path></g></svg>`;
  } else {
    noti_icon.style.background = '#00b972';
    noti_icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke-dasharray="60" stroke-dashoffset="60" d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.5s" values="60;0"/></path><path stroke-dasharray="14" stroke-dashoffset="14" d="M8 12L11 15L16 10"><animate fill="freeze" attributeName="stroke-dashoffset" begin="0.6s" dur="0.2s" values="14;0"/></path></g></svg>`;

  }

  setTimeout(() => {
    noti_alert.remove();
  }, timer);
}
function notifier(text, icon) {
  Noti({
    text: text,
    icon: icon,
    timer: 5000
  })
}