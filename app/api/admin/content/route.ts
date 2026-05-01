import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: { type: 'asc' },
    })
    return NextResponse.json(contents)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json({ error: 'Erro ao buscar conteúdo' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, title, description, link } = await request.json()

    if (!type || !title) {
      return NextResponse.json(
        { error: 'Tipo e título são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const existing = await prisma.content.findFirst({
      where: { type },
    })

    if (existing) {
      // Atualizar
      const updated = await prisma.content.update({
        where: { id: existing.id },
        data: {
          title,
          description,
          link,
        },
      })
      return NextResponse.json(updated)
    } else {
      // Criar novo
      const content = await prisma.content.create({
        data: {
          type,
          title,
          description,
          link,
        },
      })
      return NextResponse.json(content, { status: 201 })
    }
  } catch (error) {
    console.error('Error creating/updating content:', error)
    return NextResponse.json({ error: 'Erro ao salvar conteúdo' }, { status: 500 })
  }
}
