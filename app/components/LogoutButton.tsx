import { logout } from '@/lib/auth/actions'

export default function LogoutButton() {
  return (
    <form>
      <button 
        formAction={logout}
        className="btn btn-error"
      >
        Logout
      </button>
    </form>
  )
}
