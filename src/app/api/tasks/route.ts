import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { z } from 'zod'

const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  projectId: z.string(),
  assigneeId: z.string().optional().nullable(),
  dueDate: z.string().optional().nullable(),
})

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tasks = await prisma.task.findMany({
    where: { assigneeId: session.userId },
    include: { project: { select: { name: true } } },
    orderBy: { dueDate: 'asc' }
  })
  
  return NextResponse.json(tasks)
}

export async function POST(req: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, projectId, assigneeId, dueDate } = taskSchema.parse(body)

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    })

    return NextResponse.json(task)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 })
  }
}
