import { createRoot } from "react-dom/client";
import { createRootRoute, createRoute, createRouter, createMemoryHistory, RouterProvider, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Index } from "./routes/index";
import "./styles.css";

const queryClient = new QueryClient();
const rootRoute = createRootRoute({
  component: () => <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>,
});
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Index });
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute]), history: createMemoryHistory({ initialEntries: ["/"] }) });
const element = document.getElementById("root");
if (element) createRoot(element).render(<RouterProvider router={router} />);