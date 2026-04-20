import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from "react";
import { arReducer, initialARState, type ARState, type ARAction } from "./arReducer";

interface ARContextValue {
  arState: ARState;
  arDispatch: Dispatch<ARAction>;
}

const ARContext = createContext<ARContextValue | null>(null);

export function ARProvider({ children }: { children: ReactNode }) {
  const [arState, arDispatch] = useReducer(arReducer, initialARState);
  return (
    <ARContext.Provider value={{ arState, arDispatch }}>
      {children}
    </ARContext.Provider>
  );
}

export function useAR(): ARContextValue {
  const ctx = useContext(ARContext);
  if (!ctx) throw new Error("useAR must be used within ARProvider");
  return ctx;
}
