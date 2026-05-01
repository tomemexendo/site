'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminContentPage() {
  const router = useRouter()
  const [contents, setContents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    link: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const contentTypes = [
    { id: 'diet_60', label: '🍎 Dieta - Até 60kg' },
    { id: 'diet_90', label: '🍎 Dieta - 60-90kg' },
    { id: 'diet_120', label: '🍎 Dieta - 90-120kg' },
    { id: 'diet_plus', label: '🍎 Dieta - Acima de 120kg' },
    { id: 'workout_home', label: '🏠 Treino para Casa' },
    { id: 'workout_gym', label: '🏋️ Treino para Academia' },
    { id: 'challenge', label: '🎯 Desafio do Mês' },
    { id: 'ranking', label: '🏆 Ranking' },
    { id: 'routine', label: '📋 Sua Rotina Tô Me Mexendo' },
    { id: 'whatsapp', label: '💬 Link do WhatsApp' },
  ]

  useEffect(() => {
    // Verificar se é admin
    const adminSession = sessionStorage.getItem('admin_session')
    if (!adminSession) {
      router.push('/admin')
      return
    }
    loadContents()
  }, [router])

  const loadContents = async () => {
    try {
      const res = await fetch('/api/admin/content')
      if (res.ok) {
        const data = await res.json()
        setContents(data)
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error)
      setError('Erro ao carregar conteúdo')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (content: any) => {
    setEditingId(content.id)
    setFormData({
      type: content.type,
      title: content.title,
      description: content.description,
      link: content.link || '',
    })
    setError('')
    setSuccess('')
  }

  const handleNew = (type: string) => {
    setEditingId(0)
    setFormData({
      type,
      title: '',
      description: '',
      link: '',
    })
    setError('')
    setSuccess('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setSuccess('Conteúdo salvo com sucesso!')
        setEditingId(null)
        setFormData({ type: '', title: '', description: '', link: '' })
        loadContents()
      } else {
        const data = await res.json()
        setError(data.error || 'Erro ao salvar')
      }
    } catch (error) {
      setError('Erro ao conectar')
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ type: '', title: '', description: '', link: '' })
    setError('')
    setSuccess('')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold">Editar Conteúdo</h1>
          <Link href="/admin" className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition">
            Voltar
          </Link>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto p-6">
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Grid de Conteúdos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contentTypes.map((type) => {
            const existing = contents.find((c) => c.type === type.id)
            const isEditing = editingId === existing?.id || (editingId === 0 && formData.type === type.id)

            return (
              <div key={type.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                  <h3 className="text-lg font-bold">{type.label}</h3>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSave} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Título</label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Descrição</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Link</label>
                      <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Salvar
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="p-6">
                    {existing ? (
                      <>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Título:</strong> {existing.title}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <strong>Descrição:</strong> {existing.description}
                        </p>
                        {existing.link && (
                          <p className="text-sm text-gray-600 mb-4">
                            <strong>Link:</strong>{' '}
                            <a href={existing.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {existing.link}
                            </a>
                          </p>
                        )}
                        <button
                          onClick={() => handleEdit(existing)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          Editar
                        </button>
                      </>
                    ) : (
                      <>
                        <p className="text-gray-600 mb-4">Nenhum conteúdo configurado</p>
                        <button
                          onClick={() => handleNew(type.id)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                        >
                          Adicionar
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
