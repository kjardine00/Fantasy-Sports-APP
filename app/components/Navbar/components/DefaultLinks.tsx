import React from 'react'
import Link from 'next/link'

const DefaultLinks = () => {
  return (
    <nav className="flex items-center gap-2">
        {/* <Link className="btn btn-ghost btn-md rounded-full" href="/league">Leagues</Link> */}
        <Link className="btn btn-ghost btn-md rounded-full" href="/players">Players</Link>
        {/* <Link className="btn btn-ghost btn-md rounded-full" href="/teams">Teams</Link> */}
    </nav>
  )
}

export default DefaultLinks