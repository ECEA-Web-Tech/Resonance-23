import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "./routes/Root";
import ErrorRouter from "./ErrorRouter";
import "./App.css";
import TechEvents from "./routes/TechEvents";
import NonTechEvents from "./routes/NonTechEvents";
import Workshop from "./routes/Workshop";
import Sponsors from "./routes/Sponsors";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorRouter />,
  },
  {
    path: "/techevents",
    element: <TechEvents />,
    errorElement: <ErrorRouter />,
  },
  {
    path: "/nontechevents",
    element: <NonTechEvents />,
    errorElement: <ErrorRouter />,
  },
  {
    path: "/workshop",
    element: <Workshop />,
    errorElement: <ErrorRouter />,
  },
  {
    path: "/sponsors",
    element: <Sponsors />,
    errorElement: <ErrorRouter />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
