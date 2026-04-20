import { useEffect } from "react";
import { useAppState } from "../state/AppContext";

export function useResponsive() {
  const { dispatch } = useAppState();

  useEffect(() => {
    function check() {
      if (window.innerWidth < 768) {
        dispatch({ type: "SET_COLLAPSED", collapsed: true });
      }
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [dispatch]);
}
