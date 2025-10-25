'use client';

import React from 'react';

interface NumberOfTeamsSelectorProps {
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  value?: string;
  disabled?: boolean;
  name?: string;
}

const NumberOfTeamsSelector: React.FC<NumberOfTeamsSelectorProps> = ({
  defaultValue = "10",
  onChange,
  className = "select select-bordered w-full",
  value,
  disabled = false,
  name,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <div className="form-control">
      <select 
        className={className}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        name={name}
      >
        <option disabled={true}>Number of Teams</option>
        <option value="4">4</option>
        <option value="6">6</option>
        <option value="8">8</option>
        <option value="10">10</option>
        <option value="12">12</option>
      </select>
    </div>
  );
};

export default NumberOfTeamsSelector;
