import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const projects = await prisma.project.findMany({
    include: {
      owner: { select: { name: true } },
      _count: { select: { tasks: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return NextResponse.json(projects)
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { name, description } = projectSchema.parse(body)

    const project = await prisma.project.create({
      data: {
        name,
        description,
        ownerId: session.userId,
      }
    })

    return NextResponse.json(project)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
