import React from "react";
import Link from "next/link";

const Card = () => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <figure className="bg-gradient-to-br from-secondary to-warning p-8">
        <svg
          className="w-24 h-24 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </figure>
      <div className="card-body">
        <h2 className="card-title">Join a League</h2>
        <p>
        You're the league manager here. Set up a league to play with your family and friends!
        </p>
        <div className="card-actions justify-end">
          <Link className="btn btn-secondary rounded" href="/league/join">
            Join
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;
