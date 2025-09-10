import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'

export default async function AuthStatus() {
  const supabase = await createClient()
  
  // This gets the current user from the server-side session
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="alert alert-info">
      <div className="flex justify-between items-center w-full">
        <div>
          <h3 className="font-bold">Authentication Status:</h3>
          {user ? (
            <div>
              <p>✅ You are logged in!</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
            </div>
          ) : (
            <p>❌ You are not logged in</p>
          )}
        </div>
        {user && <LogoutButton />}
      </div>
    </div>
  )
}
