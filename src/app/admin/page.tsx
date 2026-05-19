'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AppLayout } from '@/components/layout/AppLayout'
import { RoleGuard } from '@/components/layout/RoleGuard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Profile, Student, Session } from '@/types'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'
import { Users, BookOpen, BarChart3, Link as LinkIcon } from 'lucide-react'

interface UserWithStudent extends Profile {
  student?: Student
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserWithStudent[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState({ users: 0, students: 0, activities: 0, sessions: 0 })
  const [activeTab, setActiveTab] = useState<'users' | 'sessions' | 'links'>('users')
  const [linkParentId, setLinkParentId] = useState('')
  const [linkStudentId, setLinkStudentId] = useState('')
  const [linkTeacherId, setLinkTeacherId] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [usersRes, sessRes, stuRes, actRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('sessions').select('*').order('order_index'),
        supabase.from('students').select('id', { count: 'exact' }),
        supabase.from('activities').select('id', { count: 'exact' }),
      ])

      setUsers(usersRes.data ?? [])
      setSessions(sessRes.data ?? [])
      setStats({
        users: usersRes.data?.length ?? 0,
        students: stuRes.count ?? 0,
        sessions: sessRes.data?.length ?? 0,
        activities: actRes.count ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [])

  const changeRole = async (userId: string, newRole: string) => {
    await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole as Profile['role'] } : u))
    toast.success('Rôle mis à jour !')
  }

  const linkParentToStudent = async () => {
    if (!linkParentId || !linkStudentId) { toast.error('Renseignez les deux IDs.'); return }
    const { error } = await supabase.from('parent_students').insert({
      parent_id: linkParentId,
      student_id: linkStudentId,
    })
    if (error) toast.error(error.message)
    else { toast.success('Parent lié à l\'élève !'); setLinkParentId(''); setLinkStudentId('') }
  }

  const linkTeacherToStudent = async () => {
    if (!linkTeacherId || !linkStudentId) { toast.error('Renseignez les deux IDs.'); return }
    const { error } = await supabase.from('teacher_students').insert({
      teacher_id: linkTeacherId,
      student_id: linkStudentId,
    })
    if (error) toast.error(error.message)
    else { toast.success('Professeur lié à l\'élève !'); setLinkTeacherId(''); setLinkStudentId('') }
  }

  if (loading) {
    return (
      <RoleGuard allowedRoles={['admin']}>
        <AppLayout role="admin">
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </AppLayout>
      </RoleGuard>
    )
  }

  const tabs = [
    { key: 'users', label: 'Utilisateurs', icon: Users },
    { key: 'sessions', label: 'Séances', icon: BookOpen },
    { key: 'links', label: 'Liens', icon: LinkIcon },
  ] as const

  return (
    <RoleGuard allowedRoles={['admin']}>
      <AppLayout role="admin">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-lumi-text">Administration ⚙️</h1>
            <p className="text-lumi-muted mt-1">Gestion complète de la plateforme LUMI.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Utilisateurs', value: stats.users, color: 'text-lumi-blue', emoji: '👥' },
              { label: 'Élèves', value: stats.students, color: 'text-lumi-green', emoji: '🧒' },
              { label: 'Séances', value: stats.sessions, color: 'text-lumi-purple', emoji: '📚' },
              { label: 'Activités', value: stats.activities, color: 'text-orange-500', emoji: '⚡' },
            ].map(stat => (
              <Card key={stat.label} padding="sm">
                <div className="text-center">
                  <div className="text-xl">{stat.emoji}</div>
                  <div className={cn('text-2xl font-black mt-1', stat.color)}>{stat.value}</div>
                  <div className="text-xs text-lumi-muted">{stat.label}</div>
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-gray-200 overflow-x-auto scrollbar-none">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-all -mb-px whitespace-nowrap flex-shrink-0',
                    activeTab === tab.key
                      ? 'border-red-400 text-red-500'
                      : 'border-transparent text-lumi-muted hover:text-lumi-text'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Users tab */}
          {activeTab === 'users' && (
            <Card>
              <h2 className="text-xl font-black text-lumi-text mb-4">Tous les utilisateurs</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-lumi-muted">
                      <th className="pb-3 font-bold">Nom</th>
                      <th className="pb-3 font-bold">Email (ID)</th>
                      <th className="pb-3 font-bold">Rôle</th>
                      <th className="pb-3 font-bold">Mode dys</th>
                      <th className="pb-3 font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="py-3 font-semibold">
                          {user.first_name} {user.last_name}
                        </td>
                        <td className="py-3 text-lumi-muted text-xs font-mono">
                          {user.id.substring(0, 8)}…
                        </td>
                        <td className="py-3">
                          <span className={cn(
                            'px-2 py-1 rounded-lg text-xs font-bold',
                            user.role === 'student' ? 'bg-lumi-blue-light text-lumi-blue' :
                            user.role === 'teacher' ? 'bg-lumi-purple-light text-lumi-purple' :
                            user.role === 'parent' ? 'bg-lumi-green-light text-green-700' :
                            'bg-red-100 text-red-600'
                          )}>
                            {user.role}
                          </span>
                        </td>
                        <td className="py-3">
                          {user.dyslexia_mode ? '✅' : '—'}
                        </td>
                        <td className="py-3">
                          <select
                            value={user.role}
                            onChange={e => changeRole(user.id, e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                          >
                            <option value="student">Élève</option>
                            <option value="parent">Parent</option>
                            <option value="teacher">Professeur</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Sessions tab */}
          {activeTab === 'sessions' && (
            <Card>
              <h2 className="text-xl font-black text-lumi-text mb-4">Séances du parcours</h2>
              <div className="space-y-2">
                {sessions.map(session => (
                  <div
                    key={session.id}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black',
                      session.is_assessment ? 'bg-lumi-purple text-white' :
                      session.is_final_project ? 'bg-orange-500 text-white' :
                      'bg-lumi-blue text-white'
                    )}>
                      {session.is_final_project ? '🏆' : session.is_assessment ? '📋' : session.session_number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-lumi-text">{session.title}</div>
                      <div className="text-xs text-lumi-muted">{session.block_name}</div>
                    </div>
                    <span className="text-xs text-lumi-muted font-mono">{session.id.substring(0,8)}…</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Links tab */}
          {activeTab === 'links' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Card>
                <h2 className="text-xl font-black text-lumi-text mb-4">
                  🔗 Lier parent ↔ élève
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-lumi-muted block mb-1">ID du parent (profile_id)</label>
                    <input
                      value={linkParentId}
                      onChange={e => setLinkParentId(e.target.value)}
                      placeholder="uuid du parent"
                      className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm font-mono focus:outline-none focus:border-lumi-blue"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-lumi-muted block mb-1">ID de l'élève (student.id)</label>
                    <input
                      value={linkStudentId}
                      onChange={e => setLinkStudentId(e.target.value)}
                      placeholder="uuid de l'élève"
                      className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm font-mono focus:outline-none focus:border-lumi-blue"
                    />
                  </div>
                  <Button onClick={linkParentToStudent} className="w-full" size="sm">
                    Créer le lien parent–élève
                  </Button>
                </div>
              </Card>

              <Card>
                <h2 className="text-xl font-black text-lumi-text mb-4">
                  🔗 Lier professeur ↔ élève
                </h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-lumi-muted block mb-1">ID du professeur (profile_id)</label>
                    <input
                      value={linkTeacherId}
                      onChange={e => setLinkTeacherId(e.target.value)}
                      placeholder="uuid du professeur"
                      className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm font-mono focus:outline-none focus:border-lumi-purple"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-lumi-muted block mb-1">ID de l'élève (student.id)</label>
                    <input
                      value={linkStudentId}
                      onChange={e => setLinkStudentId(e.target.value)}
                      placeholder="uuid de l'élève"
                      className="w-full border-2 border-gray-200 rounded-xl p-2 text-sm font-mono focus:outline-none focus:border-lumi-purple"
                    />
                  </div>
                  <Button onClick={linkTeacherToStudent} variant="secondary" className="w-full" size="sm">
                    Créer le lien prof–élève
                  </Button>
                </div>
              </Card>

              {/* User IDs reference */}
              <Card className="sm:col-span-2">
                <h2 className="text-xl font-black text-lumi-text mb-4">Référence des IDs utilisateurs</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left text-lumi-muted">
                        <th className="pb-2 font-bold">Nom</th>
                        <th className="pb-2 font-bold">Rôle</th>
                        <th className="pb-2 font-bold">Profile ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map(user => (
                        <tr key={user.id}>
                          <td className="py-2 font-semibold">{user.first_name} {user.last_name}</td>
                          <td className="py-2 text-lumi-muted">{user.role}</td>
                          <td className="py-2 font-mono text-lumi-blue">{user.id}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </div>
      </AppLayout>
    </RoleGuard>
  )
}
