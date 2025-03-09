import React from "react";

const useAppContext = () => {
  const [socket, setSocket] = React.useState();

  return {
    socket,
    setSocket,
  };
};

export default useAppContext;
