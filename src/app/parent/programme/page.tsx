'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { ProgrammeView } from '@/components/dashboard/ProgrammeView'

export default function ParentProgrammePage() {
  return (
    <RoleGuard allowedRoles={['parent']}>
      <AppLayout role="parent">
        <ProgrammeView detailBasePath="/parent/seance" />
      </AppLayout>
    </RoleGuard>
  )
}
