'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Student, HomeworkHelperProject } from '@/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function ProjetPage() {
  const [student, setStudent] = useState<Student | null>(null)
  const [project, setProject] = useState<HomeworkHelperProject | null>(null)
  const [finalSession, setFinalSession] = useState<{ id: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: stu } = await supabase
        .from('students')
        .select('*')
        .eq('profile_id', user.id)
        .single()

      setStudent(stu)

      if (stu) {
        const [projRes, sessRes] = await Promise.all([
          supabase
            .from('homework_helper_projects')
            .select('*')
            .eq('student_id', stu.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single(),
          supabase
            .from('sessions')
            .select('id')
            .eq('is_final_project', true)
            .single(),
        ])
        setProject(projRes.data)
        setFinalSession(sessRes.data)
      }

      setLoading(false)
    }
    load()
  }, [])

  const createProject = async () => {
    if (!student) return
    const { data } = await supabase
      .from('homework_helper_projects')
      .insert({ student_id: student.id, name: 'Mon assistant de devoirs' })
      .select()
      .single()
    setProject(data)
    toast.success('Projet créé ! 🚀')
  }

  if (loading) {
    return (
      <RoleGuard allowedRoles={['student']}>
        <StudentLayout>
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-lumi-blue border-t-transparent rounded-full animate-spin" />
          </div>
        </StudentLayout>
      </RoleGuard>
    )
  }

  return (
    <RoleGuard allowedRoles={['student']}>
      <StudentLayout student={student ?? undefined}>
        <div className="space-y-6 max-w-2xl mx-auto">
          <div>
            <h1 className="text-3xl font-black text-lumi-text">Mon projet final 🏆</h1>
            <p className="text-lumi-muted mt-1">Crée ton assistant personnel d'aide aux devoirs !</p>
          </div>

          {!project ? (
            <Card>
              <div className="text-center space-y-5 py-8">
                <div className="text-6xl">🚀</div>
                <div>
                  <h2 className="text-xl font-black text-lumi-text">Lance ton projet !</h2>
                  <p className="text-lumi-muted mt-2 max-w-sm mx-auto">
                    Tu vas créer un outil d'aide aux devoirs personnalisé, étape par étape.
                  </p>
                </div>
                {finalSession ? (
                  <Link href={`/eleve/seance/${finalSession.id}`}>
                    <Button size="lg">▶ Commencer le projet final</Button>
                  </Link>
                ) : (
                  <Button onClick={createProject} size="lg">▶ Commencer le projet final</Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Project card */}
              <div
                className="rounded-3xl p-6 text-center space-y-4 border-2"
                style={{
                  background: 'linear-gradient(135deg, #EBF3FB 0%, #F3EEFF 100%)',
                  borderColor: '#5B9BD5',
                }}
              >
                <div className="text-5xl">🤖</div>
                <h2 className="text-2xl font-black text-lumi-text">{project.name}</h2>
                <div className="inline-flex px-4 py-1.5 rounded-full text-sm font-bold bg-white text-lumi-blue">
                  {project.status === 'completed' ? '✅ Terminé !' : project.status === 'in_progress' ? '▶ En cours' : '📝 Brouillon'}
                </div>
              </div>

              {/* Steps overview */}
              <Card>
                <h3 className="font-black text-lumi-text mb-4">Étapes du projet</h3>
                <div className="space-y-3">
                  {[
                    { step: 1, label: 'Mon besoin', done: project.needs?.length > 0 },
                    { step: 2, label: 'Les fonctions de mon outil', done: project.features?.length > 0 },
                    { step: 3, label: 'Ma maquette', done: Object.keys(project.mockup ?? {}).length > 0 },
                    { step: 4, label: 'Ma présentation', done: Object.keys(project.presentation ?? {}).length > 0 },
                  ].map(s => (
                    <div key={s.step} className={cn(
                      'flex items-center gap-3 p-3 rounded-2xl border-2',
                      s.done ? 'bg-lumi-green-light border-lumi-green' : 'bg-gray-50 border-gray-200'
                    )}>
                      <span className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm',
                        s.done ? 'bg-lumi-green text-white' : 'bg-gray-200 text-gray-400'
                      )}>
                        {s.done ? '✓' : s.step}
                      </span>
                      <span className={cn('font-semibold text-sm', s.done ? 'text-green-800' : 'text-lumi-muted')}>
                        Étape {s.step} — {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>

              {finalSession && (
                <Link href={`/eleve/seance/${finalSession.id}`}>
                  <Button className="w-full" size="lg">
                    {project.status === 'completed' ? '🔄 Revoir mon projet' : '▶ Continuer le projet'}
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </StudentLayout>
    </RoleGuard>
  )
}
