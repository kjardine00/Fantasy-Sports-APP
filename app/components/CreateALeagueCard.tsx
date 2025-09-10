import React from "react";

const Card = () => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm p">
      <figure className="bg-gradient-to-br from-primary to-accent p-8">
        <img
          src="/icons/clipboard-icon.svg"
          alt="Create League"
          className="w-24 h-24 filter brightness-0 invert"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Create a League</h2>
        <p>
        You're the league manager here. Set up a league to play with your family and friends!
        </p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary rounded">Create</button>
        </div>
      </div>
    </div>
  );
};

export default Card;
