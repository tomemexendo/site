'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Content {
  id: number
  type: string
  title: string
  description: string
  link: string | null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [contents, setContents] = useState<Content[]>([])
  const [whatsappLink, setWhatsappLink] = useState('https://wa.me/5511972627812')

  useEffect(() => {
    const session = localStorage.getItem('user_session')
    if (!session) {
      router.push('/')
      return
    }
    try {
      setUser(JSON.parse(session))
    } catch (e) {
      router.push('/')
      return
    }
    
    loadContents()
    loadWhatsappLink()
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
    } finally {
      setLoading(false)
    }
  }

  const loadWhatsappLink = async () => {
    try {
      const res = await fetch('/api/admin/content')
      if (res.ok) {
        const data = await res.json()
        const whatsapp = data.find((c: any) => c.type === 'whatsapp')
        if (whatsapp?.link) {
          setWhatsappLink(whatsapp.link)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar WhatsApp:', error)
    }
  }

  const getContent = (type: string) => {
    return contents.find((c) => c.type === type)
  }

  const handleLogout = () => {
    localStorage.removeItem('user_session')
    router.push('/')
  }

  const handleOpenLink = (link: string | null) => {
    if (link) {
      window.open(link, '_blank')
    } else {
      alert('Link não configurado ainda. Tente mais tarde!')
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Carregando...</div>
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Redirecionando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 text-white p-6 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-full" />
            <div>
              <h1 className="text-2xl font-bold">Tô Me Mexendo</h1>
              <p className="text-gray-400 text-sm">Bem-vindo, {user?.name}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Boas-vindas */}
        <div className="bg-blue-500 text-white rounded-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-2">Bem-vindo(a), {user?.name}! 💪</h2>
          <p className="text-blue-100">
            Aqui você tem acesso aos treinos, dieta, desafio do mês e ranking. Escolha abaixo o que deseja acessar.
          </p>
        </div>

        {/* DIETA */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🍎</span>
            <h3 className="text-2xl font-bold text-white">DIETA</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { type: 'diet_60', label: 'Até 60kg' },
              { type: 'diet_90', label: '60 - 90kg' },
              { type: 'diet_120', label: '90 - 120kg' },
              { type: 'diet_plus', label: 'Acima de 120kg' },
            ].map((diet) => {
              const content = getContent(diet.type)
              return (
                <button
                  key={diet.type}
                  onClick={() => handleOpenLink(content?.link)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition text-center"
                >
                  <div className="font-bold text-lg">{diet.label}</div>
                  <div className="text-sm text-blue-100">{content?.description || 'Sua dieta calculada'}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* TREINO PARA CASA */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏠</span>
            <h3 className="text-2xl font-bold text-white">TREINO PARA CASA</h3>
          </div>
          <button
            onClick={() => handleOpenLink(getContent('workout_home')?.link)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition font-semibold text-lg"
          >
            Acessar Treino para Casa
          </button>
        </div>

        {/* TREINO PARA ACADEMIA */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏋️</span>
            <h3 className="text-2xl font-bold text-white">TREINO PARA ACADEMIA</h3>
          </div>
          <button
            onClick={() => handleOpenLink(getContent('workout_gym')?.link)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-lg transition font-semibold text-lg"
          >
            Acessar Treino para Academia
          </button>
        </div>

        {/* DESAFIO DO MÊS */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🎯</span>
            <h3 className="text-2xl font-bold text-white">DESAFIO DO MÊS</h3>
          </div>
          <button
            onClick={() => handleOpenLink(getContent('challenge')?.link)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition font-semibold text-lg"
          >
            Acessar Desafio do Mês
          </button>
        </div>

        {/* SEUS PONTOS E PRÊMIOS */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <h3 className="text-2xl font-bold text-white">SEUS PONTOS E PRÊMIOS</h3>
          </div>
          <button
            onClick={() => handleOpenLink(getContent('ranking')?.link)}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-lg transition font-semibold text-lg"
          >
            Acompanhar Pontos e Prêmios
          </button>
        </div>

        {/* SUA ROTINA TÔ ME MEXENDO */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">📋</span>
            <h3 className="text-2xl font-bold text-white">SUA ROTINA TÔ ME MEXENDO</h3>
          </div>
          <button
            onClick={() => handleOpenLink(getContent('routine')?.link)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white p-4 rounded-lg transition font-semibold text-lg"
          >
            Como encaixar nos seus horários
          </button>
        </div>

        {/* SEÇÃO DE AJUDA */}
        <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-2xl font-bold text-white mb-2">Precisa de Ajuda?</h3>
          <p className="text-gray-400 mb-6">
            Caso precise de ajustes na dieta ou no treino, basta pedir no WhatsApp clicando no link abaixo. Todo acompanhamento é feito de forma INDIVIDUALIZADA.
          </p>
          <button
            onClick={() => window.open(whatsappLink, '_blank')}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition font-semibold text-lg inline-block"
          >
            💬 Falar no WhatsApp
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>© 2018 Tô Me Mexendo. Todos os direitos reservados.</p>
          <p>Desenvolvido por Tainan Rodrigues para você alcançar seus objetivos.</p>
        </div>
      </div>
    </div>
  )
}
