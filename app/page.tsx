'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Normalizar nome (remover acentos e espaços)
  const normalizeName = (str: string) => {
    return str
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/\s+/g, ' ') // Normaliza espaços
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: normalizeName(name), phone }),
      })

      const data = await res.json()
      console.log('Login response:', { status: res.status, data })

      if (!res.ok) {
        console.error('Login failed:', data.error)
        setError(data.error || 'Erro ao fazer login')
        setLoading(false)
        return
      }

      // Salvar no localStorage com primeiro nome capitalizado
      if (typeof window !== 'undefined') {
        const firstName = data.user.name.split(' ')[0] // Pega só o primeiro nome
        const capitalizedName = firstName.charAt(0).toUpperCase() + firstName.slice(1)
        const sessionData = { id: data.user.id, name: capitalizedName }
        console.log('Saving session:', sessionData)
        localStorage.setItem('user_session', JSON.stringify(sessionData))
        console.log('Session saved, redirecting to /dashboard')
      }

      // Redirecionar
      console.log('Calling router.push("/dashboard")')
      router.push('/dashboard')
      console.log('router.push called')
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro ao conectar com o servidor')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Tô Me Mexendo" className="w-32 h-32 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-2">Tô Me Mexendo</h1>
          <p className="text-gray-400">Área do Aluno</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6">Bem-vindo! 💪</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Nome */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Seu Primeiro Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Maria"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                required
              />
            </div>

            {/* Campo Telefone */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                4 Últimos Dígitos do WhatsApp
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^0-9]/g, '').slice(0, 4)
                  setPhone(cleaned)
                }}
                placeholder="0000"
                maxLength={4}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg text-center text-2xl focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-500"
                required
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="bg-red-900 border-2 border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              disabled={loading || !name || phone.length !== 4}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Entrando...' : 'Entrar 🚀'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
