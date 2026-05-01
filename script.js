let users = JSON.parse(localStorage.getItem("users")) || [
  { name: "maria", code: "1234" }
]

let links = JSON.parse(localStorage.getItem("links")) || {
  treino: "#",
  dieta: "#",
  desafio: "#",
  ranking: "#",
  whatsapp: "https://wa.me/"
}

function login() {
  let nome = document.getElementById("nome").value.toLowerCase()
  let codigo = document.getElementById("codigo").value

  let user = users.find(u => u.name === nome && u.code === codigo)

  if (!user) return alert("Dados inválidos")

  document.getElementById("login").classList.add("hidden")
  document.getElementById("app").classList.remove("hidden")

  renderApp(nome)
}

function renderApp(nome) {
  document.getElementById("app").innerHTML = `
    <h2>Fala, ${nome} 🚀</h2>

    <div class="card">
      <button onclick="openLink('${links.treino}')">🔥 Fazer treino</button>
    </div>

    <div class="card">
      <button onclick="openLink('${links.dieta}')">🥗 Dieta</button>
      <button onclick="openLink('${links.desafio}')">🎯 Desafio</button>
      <button onclick="openLink('${links.ranking}')">🏆 Ranking</button>
    </div>

    <div class="card">
      <button onclick="openLink('${links.whatsapp}')">💬 WhatsApp</button>
    </div>
  `
}

function openLink(link) {
  window.open(link, "_blank")
}

function adminLogin() {
  let senha = prompt("Senha:")

  if (senha !== "1234") return alert("Erro")

  document.getElementById("login").classList.add("hidden")
  document.getElementById("admin").classList.remove("hidden")

  renderAdmin()
}

function renderAdmin() {
  document.getElementById("admin").innerHTML = `
    <h2>Admin</h2>

    <input id="treino" placeholder="Link treino">
    <input id="dieta" placeholder="Link dieta">
    <input id="desafio" placeholder="Link desafio">
    <input id="ranking" placeholder="Link ranking">
    <input id="whatsapp" placeholder="Link whatsapp">

    <button onclick="saveLinks()">Salvar</button>
  `
}

function saveLinks() {
  links = {
    treino: treino.value,
    dieta: dieta.value,
    desafio: desafio.value,
    ranking: ranking.value,
    whatsapp: whatsapp.value
  }

  localStorage.setItem("links", JSON.stringify(links))
  alert("Salvo!")
}
