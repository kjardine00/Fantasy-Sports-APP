import React from "react";
import Link from "next/link";

const CreateALeagueCard = () => {
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
          You're the league manager here. Set up a league to play with your
          family and friends!
        </p>
        <div className="card-actions justify-end">
          <Link className="btn btn-primary rounded" href="/league/create">
            Create
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateALeagueCard;
