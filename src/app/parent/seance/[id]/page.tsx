'use client'

import { useParams } from 'next/navigation'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { SeanceDetailView } from '@/components/dashboard/SeanceDetailView'

export default function ParentSeanceDetailPage() {
  const { id } = useParams()

  return (
    <RoleGuard allowedRoles={['parent']}>
      <AppLayout role="parent">
        <SeanceDetailView sessionId={id as string} backPath="/parent/programme" />
      </AppLayout>
    </RoleGuard>
  )
}
