'use client'

import { useEffect, useState } from 'react'

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newUser, setNewUser] = useState({ name: '', phone: '' })
  const [showForm, setShowForm] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    // Verificar se é admin
    const adminSession = sessionStorage.getItem('admin_session')
    if (adminSession) {
      setIsAuthenticated(true)
      loadUsers()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
      setError('Erro ao carregar usuários')
    } finally {
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    // Aqui você pode adicionar validação de senha
    // Por enquanto, vamos usar uma senha simples
    if (adminPassword === 'admin123') {
      sessionStorage.setItem('admin_session', 'true')
      setIsAuthenticated(true)
      setAdminPassword('')
      loadUsers()
    } else {
      setError('Senha incorreta')
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUser.name.toLowerCase(), phone: newUser.phone }),
      })

      if (res.ok) {
        setNewUser({ name: '', phone: '' })
        setShowForm(false)
        loadUsers()
        alert('Aluno adicionado com sucesso!')
      } else {
        const data = await res.json()
        setError(data.error || 'Erro ao adicionar aluno')
      }
    } catch (error) {
      setError('Erro ao conectar')
    }
  }

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Tem certeza que deseja remover este aluno?')) return

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        loadUsers()
        alert('Aluno removido com sucesso!')
      } else {
        setError('Erro ao remover aluno')
      }
    } catch (error) {
      setError('Erro ao conectar')
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session')
    setIsAuthenticated(false)
    setAdminPassword('')
    setUsers([])
  }

  // Filtrar usuários
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  )

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Carregando...</div>
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Painel Admin</h1>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Senha de Admin
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Botões */}
        <div className="mb-6 flex gap-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            {showForm ? 'Cancelar' : '+ Adicionar Aluno'}
          </button>
          <a
            href="/admin/content"
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg transition inline-block"
          >
            ✏️ Editar Conteúdo
          </a>
        </div>

        {/* Formulário de Adicionar */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Adicionar Novo Aluno</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nome</label>
                  <input
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    4 Últimos Dígitos do WhatsApp
                  </label>
                  <input
                    type="text"
                    value={newUser.phone}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                      setNewUser({ ...newUser, phone: cleaned })
                    }}
                    maxLength={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
              >
                Adicionar
              </button>
            </form>
          </div>
        )}

        {/* Busca e Filtro */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Lista de Alunos */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">
              Alunos Cadastrados ({filteredUsers.length} de {users.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Telefone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data Cadastro</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-800">{user.name}</td>
                    <td className="px-6 py-4 text-gray-800">****{user.phone}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1 px-3 rounded transition text-sm"
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


        </div>
      </div>
    </div>
  )
}
