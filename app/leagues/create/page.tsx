import React from "react";

const CreateLeaguePage = () => {
  return (
    <div className="p-20">
      <h1>Create League</h1>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">What is your league name?</legend>
        <input type="text" className="input" placeholder="League Name" />

        <select defaultValue="10" className="select">
          <option disabled={true}>Number of Teams</option>
          <option>4</option>
          <option>6</option>
          <option>8</option>
          <option>10</option>
          <option>12</option>
        </select>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Use Chemistry</span>
            <div
              className="tooltip tooltip-right"
              data-tip="Players with Chemistry will gain bonus points if they are both active when one scores"
            >
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </label>
        </div>

        <div className="form-control">
            <select defaultValue="10" className="select">
            <option disabled={true}>Number of Duplicate Players</option>
            <option>None</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            </select>
        </div>

      </fieldset>
    </div>
  );
};

export default CreateLeaguePage;
