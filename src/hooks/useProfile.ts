'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Student } from '@/types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setProfile(prof)

      if (prof?.role === 'student') {
        const { data: stu } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', user.id)
          .single()
        setStudent(stu)
      }

      setLoading(false)
    }
    load()
  }, [])

  const toggleDyslexiaMode = async () => {
    if (!profile) return
    const newVal = !profile.dyslexia_mode
    setProfile({ ...profile, dyslexia_mode: newVal })
    await supabase
      .from('profiles')
      .update({ dyslexia_mode: newVal })
      .eq('id', profile.id)
  }

  return { profile, student, loading, toggleDyslexiaMode }
}
