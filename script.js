const SUPABASE_URL = "https://pxpojetrshxvtaznkxkj.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4cG9qZXRyc2h4dnRhem5reGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1ODgxMDYsImV4cCI6MjA5MzE2NDEwNn0.ClFcL_dtAvdBQdrqZUlDi2CnhGEH_wbATrmxjJhpYYs"

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

let currentUser = null

// LOGIN DO ALUNO
async function login() {
  let nome = document.getElementById("nome").value.toLowerCase()
  let codigo = document.getElementById("codigo").value

  const { data, error } = await client
    .from("users")
    .select("*")
    .eq("name", nome)
    .eq("code", codigo)
    .single()

  if (error || !data) {
    alert("Dados inválidos")
    return
  }

  currentUser = data

  document.getElementById("login").classList.add("hidden")
  document.getElementById("app").classList.remove("hidden")

  renderApp()
}

// ÁREA DO ALUNO
function renderApp() {
  document.getElementById("app").innerHTML = `
    <h2>Bem-vindo 💪</h2>

    <div class="card">
      <button onclick="alert('link treino aqui')">🔥 Treino</button>
      <button onclick="alert('link dieta aqui')">🥗 Dieta</button>
      <button onclick="alert('link desafio aqui')">🎯 Desafio</button>
      <button onclick="alert('link ranking aqui')">🏆 Ranking</button>
    </div>
  `
}

// ADMIN LOGIN SIMPLES
function adminLogin() {
  let senha = prompt("Senha admin:")

  if (senha !== "1234") {
    alert("Senha incorreta")
    return
  }

  document.getElementById("login").classList.add("hidden")
  document.getElementById("admin").classList.remove("hidden")

  renderAdmin()
}

// ADMIN
function renderAdmin() {
  document.getElementById("admin").innerHTML = `
    <h2>Admin</h2>

    <input id="newName" placeholder="Nome">
    <input id="newCode" placeholder="Código">

    <button onclick="addUser()">Adicionar aluno</button>
  `
}

// ADICIONAR ALUNO NO SUPABASE
async function addUser() {
  let name = document.getElementById("newName").value.toLowerCase()
  let code = document.getElementById("newCode").value

  const { error } = await client
    .from("users")
    .insert([{ name, code }])

  if (error) {
    alert("Erro ao adicionar")
    console.log(error)
  } else {
    alert("Aluno adicionado!")
  }
}
