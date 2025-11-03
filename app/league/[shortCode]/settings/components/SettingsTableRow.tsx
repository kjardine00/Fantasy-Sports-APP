import React from 'react'

interface SettingsTableRowProps {
    label: string;
    isEditing: boolean;
    editComponent: React.ReactNode;
    displayComponent: React.ReactNode;
}

const SettingsTableRow = ({
    label,
    isEditing,
    editComponent,
    displayComponent,
  }: SettingsTableRowProps) => {
    return (
      <tr className="">
        <th className="text-base-content/80 font-normal border-r border-base-300 w-1/2">
          {label}
        </th>
        <td>
          {isEditing ? editComponent : displayComponent}
        </td>
      </tr>
    );
  };
  
  export default SettingsTableRow;