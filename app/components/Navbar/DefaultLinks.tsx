import React from 'react'
import Link from 'next/link'

const DefaultLinks = () => {
  return (
    <div>
        <Link className="btn btn-ghost text-xl" href="/league">Leagues</Link>
        <Link className="btn btn-ghost text-xl" href="/characters">Characters</Link>
        <Link className="btn btn-ghost text-xl" href="/teams">Teams</Link>
    </div>
  )
}

export default DefaultLinks