import React from "react";
import { Player } from "@/lib/types/database";

const PlayerIcon = ({ player }: { player: Player }) => {
  return (
    <div>
      <img
        src="https://img.daisyui.com/images/profile/demo/2@94.webp"
        alt="Avatar Tailwind CSS Component"
      />
    </div>
  );
};

export default PlayerIcon;
