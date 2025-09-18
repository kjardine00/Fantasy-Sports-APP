'use client'
import NumberOfTeamsSelector from '../../components/NumberOfTeamsSelector';
import React from 'react'

const SettingsPage = () => {
    const leagueName: string | null = "League Name";

    return (
        <div className="settings-page p-10">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">League Settings</h1>
                <h4>Your League Name</h4>
            </div>

            <div className="settings-section p-10">
                <h2>Basic Settings</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>League Name</th>
                                <td>
                                    <label className="floating-label">
                                        <input type="text" placeholder={leagueName} className="input input-md" />
                                    </label>
                                </td>
                            </tr>
                            {/* row 2 */}
                            <tr>
                                <th>Number of Teams</th>
                                <td>
                                    <NumberOfTeamsSelector defaultValue="10" />
                                </td>
                            </tr>
                            {/* row 3 */}
                            <tr>
                                <th>Make League Viewable to Public</th>
                                <td>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <div
                                                className="tooltip tooltip-right"
                                            // data-tip=""
                                            >
                                                <input type="checkbox" defaultChecked className="toggle" />
                                            </div>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div className="settings-section p-10">
                <h2>Draft Settings</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>Draft Type</th>
                                <td>
                                    <select defaultValue="Snake" className="select">
                                        <option disabled={true}>Draft Type</option>
                                        <option>Offline</option>
                                        <option>Snake</option>
                                    </select>
                                </td>
                            </tr>
                            {/* row 2 */}
                            <tr>
                                <th>Draft Date</th>
                                <td>
                                    <NumberOfTeamsSelector defaultValue="10" />
                                </td>
                            </tr>
                            {/* row 3 */}
                            <tr>
                                <th>Draft Time (Timezone)</th>
                                <td>
                                    Calendar Picker
                                </td>
                            </tr>
                            {/* row 4 */}
                            <tr>
                                <th>Draft Time</th>
                                <td>
                                    Time Picker
                                </td>
                            </tr>
                            {/* row 5 */}
                            <tr>
                                <th>Time per Pick</th>
                                <td>
                                    <div className="form-control">
                                        <select
                                            defaultValue="90"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="30">30 seconds</option>
                                            <option value="60">60 seconds</option>
                                            <option value="90">90 seconds</option>
                                            <option value="120">2 minutes</option>
                                            <option value="300">5 minutes</option>
                                            <option value="600">10 minutes</option>
                                            <option value="1200">30 minutes</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div className="settings-section p-10">
                <h2>Roster Settings</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>Roster Size</th>
                                <td>
                                    <div className="form-control">
                                        <select
                                            defaultValue="10"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            {/* row 2 */}
                            <tr>
                                <th>Total Starting Players</th>
                                <td>
                                    <div className="form-control">
                                        <select
                                            defaultValue="10"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                            <option value="11">11</option>
                                            <option value="12">12</option>
                                            <option value="13">13</option>
                                            <option value="14">14</option>
                                            <option value="15">15</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            {/* row 3 */}
                            <tr>
                                <th>Allow Duplicate Draft Picks</th>
                                <td>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <div
                                                className="tooltip tooltip-right"
                                            // data-tip=""
                                            >
                                                <input type="checkbox" defaultChecked className="toggle" />
                                            </div>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            {/* row 4 */}
                            <tr>
                                <th>Number of Draftable Duplicates</th>
                                <td>
                                    <div className="form-control">
                                        <select
                                            defaultValue="10"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                            {/* row 5 */}
                            <tr>
                                <th>Time per Pick</th>
                                <td>
                                    <div className="form-control">
                                        <select
                                            defaultValue="90"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="30">30 seconds</option>
                                            <option value="60">60 seconds</option>
                                            <option value="90">90 seconds</option>
                                            <option value="120">2 minutes</option>
                                            <option value="300">5 minutes</option>
                                            <option value="600">10 minutes</option>
                                            <option value="1200">30 minutes</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="settings-section p-10">
                <h2>Scoring Settings</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        {/* head */}
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* row 1 */}
                            <tr>
                                <th>Use Chemistry</th>
                                <td>
                                    <div className="form-control">
                                        <label className="label cursor-pointer">
                                            <div
                                                className="tooltip tooltip-right"
                                            // data-tip=""
                                            >
                                                <input type="checkbox" defaultChecked className="toggle" />
                                            </div>
                                        </label>
                                    </div>
                                </td>
                            </tr>
                            {/* row 2 */}
                            <tr>
                                <th>Chemistry Bonus Points</th>
                                <td>
                                    <div className="form-control">
                                        <select
                                            defaultValue="1"
                                            className="select select-bordered w-full"
                                        >
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                        </select>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SettingsPage


{/* <button className="btn btn-outline btn-primary rounded-full">Edit</button> */ }