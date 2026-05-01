import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Função para normalizar nome (remover acentos e converter para minúsculas)
function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

export async function POST(request: NextRequest) {
  try {
    const { name, phone } = await request.json()

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios' },
        { status: 400 }
      )
    }

    if (phone.length !== 4) {
      return NextResponse.json(
        { error: 'Telefone deve ter 4 dígitos' },
        { status: 400 }
      )
    }

    // Normalizar nome para busca
    const normalizedName = normalizeName(name)
    
    // Buscar todos os usuários com o telefone
    const users = await prisma.user.findMany({
      where: {
        phone: phone,
      },
    })
    
    // Encontrar usuário com nome normalizado correspondente
    const user = users.find(u => normalizeName(u.name) === normalizedName)

    if (!user) {
      return NextResponse.json(
        { error: 'Nome ou telefone incorretos' },
        { status: 401 }
      )
    }

    // Criar resposta com cookie de sessão
    const response = NextResponse.json({ success: true, user })
    
    // Salvar sessão no localStorage (client-side)
    response.cookies.set('user_session', JSON.stringify({ id: user.id, name: user.name }), {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 dias
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}
