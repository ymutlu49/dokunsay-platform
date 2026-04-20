import useServiceWorker from "./useServiceWorker.js";
import UpdateBanner from "./UpdateBanner.jsx";

export default function Shell({ children }) {
  const { updateAvailable, applyUpdate } = useServiceWorker();

  return (
    <>
      {children}
      {updateAvailable && <UpdateBanner onUpdate={applyUpdate} />}
    </>
  );
}
