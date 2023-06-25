window.onload = () => {
  loadMessages("received");
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
    `https://localhost:44396/api/Mail/get-${id}-letters?${id}=examples@gmail.com`
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
          document.getElementById("modalDescription").innerText = item.description;
          document.getElementById("btn-close").addEventListener("click", () => {
            document.getElementById("editModal").style.display = "none";
            document.getElementById("editModal").classList.remove("show");
          })
        });
      });
    });

}
document.querySelector("#btn-send").addEventListener("click", () => {
  let received = document.querySelector("#email").value;
  let title = document.getElementById("theme").value;
  let desc = document.querySelector("#text-message").value;
  let sender = "examples@gmail.com";

  fetch(
    `https://localhost:44396/api/Mail/add-letter?title=${title}&desc=${desc}&sender=${sender}&received=${received}`,
    {
      method: "POST",
    })
    .then((response) => {
      if (response.status == 200) {
        loadMessages(document.querySelector("img.active-filter").id);
      }
      else {
        alert(response.status);
      }
      clearFields();
    })
})

function clearFields() {
  console.log("clear");
  document.querySelector("#email").value = "";
  document.getElementById("theme").value = "";
  document.querySelector("#text-message").value = "";
}


