import React from 'react'

interface InviteCardProps {
    isVisible: boolean;
    onClose: () => void;
}

const InviteCard: React.FC<InviteCardProps> = ({ isVisible, onClose }) => {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 bg-white/25 flex items-center justify-center z-50">
            <div className="card w-96 bg-base-100 card-xl shadow-sm relative">
                <button 
                    className="btn btn-sm btn-circle btn-ghost absolute top-2 right-2 z-10"
                    onClick={onClose}
                >✕</button>
                <div className="card-body">
                    <h2 className="card-title text-center">Congrats, you created a league! Now invite friends.</h2>
                    <div className="card-actions py-2">
                        <button className="btn btn-primary w-full rounded-full">Email Invite</button>
                    </div>
                    <div className="card-actions py-2">
                        <button className="btn btn-primary w-full rounded-full">Copy Link</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InviteCard