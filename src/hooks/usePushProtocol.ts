import { useContext } from "react";
import { PushProtocolContext } from "../context/PushProtocolContext";

export const usePushProtocol = () => {
    const context = useContext(PushProtocolContext);
    if (!context) {
      throw new Error('usePushProtocol must be used within a PushProtocolProvider');
    }
    return context;
  };