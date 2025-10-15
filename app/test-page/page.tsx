import React from "react";
import TestComponent from "./test-component";
import { createClient } from '@/lib/database/server';


const TestInvitePage = async() => {


    return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <h1 className="card-title">Test Page</h1>
        </div>
      </div>
    </div>
  );
};

export default TestInvitePage;
