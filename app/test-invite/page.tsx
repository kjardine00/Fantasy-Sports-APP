import React from "react";

const TestInvitePage = () => {
  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h2 className="card-title text-error">Unable to Join League</h2>
          <p>This invitation has expired or is invalid.</p>
          <div className="card-actions justify-center">
            <a href="/" className="btn btn-primary">
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestInvitePage;
