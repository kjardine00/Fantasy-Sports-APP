import React from "react";
import TestComponent from "./test-component";

const TestInvitePage = () => {

    return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <TestComponent />
        </div>
      </div>
    </div>
  );
};

export default TestInvitePage;
