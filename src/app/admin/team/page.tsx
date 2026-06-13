import { prisma } from '@/lib/prisma'
import TeamClient from './TeamClient'



export const revalidate = 0

export default async function AdminTeamPage() {
  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } })
  return <TeamClient initialTeam={team} />
}

