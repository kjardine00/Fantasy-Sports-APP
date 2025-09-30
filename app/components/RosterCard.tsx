import React from 'react'
import PlayerRow from '../players/components/PlayerRow'
import { getTeamRoster } from '@/lib/database/queries/teams'

const user_id = '2f8e5809-ee99-4088-bff4-f975191350db'
const league_id = '880e8400-e29b-41d4-a716-446655440001'

const RosterCard =  async () => {
  // const { data, error } = await getTeamRosterWithPlayers(user_id, league_id)
  const { data, error } = await getTeamRoster(user_id, league_id)


  if (error) {
    console.error(error)
    return <div>Error loading roster</div>
  }

  console.log(data)

  return (
    <div className="card bg-base-200 card-xl shadow-sm">
      <div className="card-body">
        <div className="date-range">
          Hello I am a date range component
        </div>

        <div className="roster-players">
          Hello I am a roster players component
        </div>
      
      </div>
  </div>
  )
}

export default RosterCard