import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)

    const user = await prisma.user.delete({
      where: { id },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Erro ao deletar usuário' }, { status: 500 })
  }
}
