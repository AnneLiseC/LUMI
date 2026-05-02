'use client'

import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { SeanceDetailView } from '@/components/dashboard/SeanceDetailView'

export default function SeanceDetailPage() {
  const { id } = useParams()

  return (
    <RoleGuard allowedRoles={['teacher', 'admin']}>
      <AppLayout role="teacher">
        <SeanceDetailView sessionId={id as string} backPath="/professeur/programme" />
      </AppLayout>
    </RoleGuard>
  )
}
