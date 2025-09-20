import React from "react";

//TODO: Add the terms and definitions to the glossary

const GlossaryCard = () => {
  return (
    <div className="card bg-base-200 card-xl shadow-sm">
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">
          Fantasy A.S.S.B.L.A.S.T. Glossary
        </h2>
        <div className="divider"></div>
        <ul className="flex flex-wrap gap-4 justify-between">
          <li>
            <h3>RBI</h3>
            <p>
              RBI is the number of runs batted in by a player.
            </p>
          </li>
          <li>
            <h3>RBI</h3>
            <p>
              RBI is the number of runs batted in by a player.
            </p>
          </li>
          <li>
            <h3>RBI</h3>
            <p>
              RBI is the number of runs batted in by a player.
            </p>
          </li>
          <li>
            <h3>RBI</h3>
            <p>
              RBI is the number of runs batted in by a player.
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default GlossaryCard;
