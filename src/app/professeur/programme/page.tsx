'use client'

import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { ProgrammeView } from '@/components/dashboard/ProgrammeView'

export default function ProfesseurProgrammePage() {
  return (
    <RoleGuard allowedRoles={['teacher', 'admin']}>
      <AppLayout role="teacher">
        <ProgrammeView detailBasePath="/professeur/seance" />
      </AppLayout>
    </RoleGuard>
  )
}
