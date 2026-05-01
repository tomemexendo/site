let users = JSON.parse(localStorage.getItem("users")) || []
let links = JSON.parse(localStorage.getItem("links")) || {}

function login() {
  let nome = nomeInput.value.toLowerCase()
  let codigo = codigoInput.value

  let user = users.find(u => u.name === nome && u.code === codigo)

  if (!user) return alert("Dados inválidos")

  loginDiv.classList.add("hidden")
  appDiv.classList.remove("hidden")

  renderApp(nome)
}

function renderApp(nome) {
  appDiv.innerHTML = `
    <h2>Fala, ${nome} 🚀</h2>

    <button onclick="openLink('${links.treino}')">🔥 Treino</button>
    <button onclick="openLink('${links.dieta}')">🥗 Dieta</button>
    <button onclick="openLink('${links.desafio}')">🎯 Desafio</button>
    <button onclick="openLink('${links.ranking}')">🏆 Ranking</button>
    <button onclick="openLink('${links.whatsapp}')">💬 WhatsApp</button>
  `
}

function openLink(link) {
  window.open(link, "_blank")
}

function adminLogin() {
  let senha = prompt("Senha:")

  if (senha !== "1234") return alert("Erro")

  loginDiv.classList.add("hidden")
  adminDiv.classList.remove("hidden")

  renderAdmin()
}

function renderAdmin() {
  adminDiv.innerHTML = `
    <h2>Admin</h2>

    <input id="newName" placeholder="Nome">
    <input id="newCode" placeholder="Código">
    <button onclick="addUser()">Adicionar aluno</button>

    <hr>

    <input id="treino" placeholder="Link treino">
    <input id="dieta" placeholder="Link dieta">
    <input id="desafio" placeholder="Link desafio">
    <input id="ranking" placeholder="Link ranking">
    <input id="whatsapp" placeholder="Link whatsapp">

    <button onclick="saveLinks()">Salvar links</button>
  `
}

function addUser() {
  let name = newName.value.toLowerCase()
  let code = newCode.value

  users.push({ name, code })
  localStorage.setItem("users", JSON.stringify(users))

  alert("Aluno adicionado!")
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
  alert("Links salvos!")
}
