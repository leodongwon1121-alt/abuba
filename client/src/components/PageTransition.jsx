import { useLocation } from "react-router-dom";

export default function PageTransition({ children }) {
  const location = useLocation();

  return (
    <main key={location.pathname} className="page-transition">
      {children}
    </main>
  );
}
