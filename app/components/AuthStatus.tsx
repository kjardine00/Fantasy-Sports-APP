import LogoutButton from './LogoutButton'
import { getCurrentUser } from '@/lib/contexts/UserContext'

export default async function AuthStatus() {
  const { user, profile } = await getCurrentUser();

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
