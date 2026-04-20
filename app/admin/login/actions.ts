'use server'

import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase'
import { isStaffEmail } from '@/lib/supabase-admin'

export async function loginAction(formData: FormData) {
  const email = String(formData.get('email') || '').trim()
  const password = String(formData.get('password') || '')
  const redirectTo = String(formData.get('redirect') || '/admin/products')

  if (!isStaffEmail(email)) {
    redirect('/admin/login?error=forbidden')
  }

  const supabase = await createServerSupabase()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    redirect('/admin/login?error=invalid')
  }

  redirect(redirectTo)
}

export async function logoutAction() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
