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
        title.innerText = item.title;
        let isReaden = document.createElement("input");
        isReaden.type = "checkbox";
        isReaden.checked = item.isReaden;
        let trash = document.createElement("img");
        trash.src = "../img/trash.png";
        trash.addEventListener("click", () => {
          fetch(
            `https://localhost:44396/api/Mail/delete-by-id?id=${item.id}`, {
            method: "POST",
          }).then((response) => {
            if (response.status == 200) {
              loadMessages();
            }

          })
          isReaden.addEventListener("click", () => {
            fetch(
              `https://localhost:44396/api/Mail/set-is-readen?id=${item.id}`, {
              method: "POST",
            }).then((response) => {
              if (response.status == 200) {
                loadMessages(document.querySelector("img.active-filter").id);
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
        if (data.lenght == 0) {
          console.log(data)
          mainDiv.innerHTML = "You don't have letters"
        }
      });
      loadCount();
    }
    )

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
          alert(data2.status);
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


