import React from "react";
import CountdownTimer from "./CountdownTimer";

interface DraftCardProps {
  draftType?: string;
  draftDate?: Date;
}

const DraftCard: React.FC<DraftCardProps> = ({ 
  draftType = "Snake", 
  draftDate 
}) => {

  return (
    <div className="card bg-base-100 card-lg shadow-sm">
      <div className="card-body flex flex-row justify-between items-center gap-4">
        <div className="draft-info flex flex-col gap-2 flex-1">
          <h2 className="card-title text-lg">Your {draftType} Draft is scheduled for</h2>
          <h2 className="text-lg font-semibold">{draftDate ? draftDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }) : "Loading Draft Date..."}</h2>
          <p className="text-sm text-base-content/70">*Draft order is randomized 1 hour before the draft begins</p>
        </div>

        <div className="draft-countdown flex-shrink-0">
          <CountdownTimer targetDate={draftDate} />
        </div>

        {/*TODO: Add an invite members button if the members are not full */}
        
        </div>
      </div>
  );
};

export default DraftCard;
