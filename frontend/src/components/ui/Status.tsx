import React from "react";

interface StatusProps {
  message: string | null | undefined;
}

const Status: React.FC<StatusProps> = ({ message }) => {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-xs italic text-red-500">{message}</p>;
};

export default Status;
