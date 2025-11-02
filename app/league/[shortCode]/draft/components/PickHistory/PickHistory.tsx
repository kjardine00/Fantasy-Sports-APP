import React from 'react'
import PickCard from './PickCard'

const PickHistory = () => {
  return (
    <div className="flex flex-col h-full">
        <div className="text-lg font-bold flex-shrink-0">Picks</div>
        <div className="divider w-full my-2 mx-0 flex-shrink-0"></div>

        <div className="flex flex-col gap-2 overflow-y-auto flex-1 min-h-0 justify-end">
            <PickCard name="Bowser" draftedBy="Birdo Bunch" round={1} pick={1} />
            <PickCard name="Bowser Jr." draftedBy="Kyle's Awesome Team" round={1} pick={2} />
            <PickCard name="Bowser" draftedBy="Texas Pete" round={1} pick={1} />
            <PickCard name="Bowser" draftedBy="Birdo Bunch" round={1} pick={1} />
        </div>
    </div>
  );
};

export default PickHistory;