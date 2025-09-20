import React from 'react'

const NotFullPromptCard = () => {
    return (
        <div className="card card-border bg-base-200 w-full">
            <div className="card-body">
                <h2 className="card-title text-error">You're league is not full and your draft has not been scheduled.</h2>
                <div className="card-actions justify-evenly py-4">
                    <button className="btn rounded-full btn-primary">Invite Managers</button>
                    <button className="btn rounded-full btn-secondary">Schedule Draft</button>
                </div>
            </div>
        </div>
    )
}

export default NotFullPromptCard