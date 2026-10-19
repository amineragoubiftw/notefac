import { createRoot } from "react-dom/client";
import { createRootRoute, createRoute, createRouter, createMemoryHistory, RouterProvider, Outlet } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Index } from "./routes/index";
import { CustomWorkspace } from "./components/CustomWorkspace";
import "./styles.css";

const queryClient = new QueryClient();
const rootRoute = createRootRoute({
  component: () => <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>,
});
const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Index });
const customRoute = createRoute({ getParentRoute: () => rootRoute, path: "/custom", component: CustomWorkspace });
const router = createRouter({ routeTree: rootRoute.addChildren([indexRoute, customRoute]), history: createMemoryHistory({ initialEntries: ["/"] }) });
const element = document.getElementById("root");
if (element) createRoot(element).render(<RouterProvider router={router} />);