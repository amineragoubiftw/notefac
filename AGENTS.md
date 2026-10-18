# Architecture
- Keep the hosted TanStack Start app unchanged; desktop packaging uses a separate Vite client entry with the same calculator view and TanStack Router so no server runtime is needed for offline calculations.
- Run Electron with isolated, sandboxed renderers and no Node integration; store local grades in its persistent application profile and keep cloud sharing online-only.
- Keep the desktop download notice in a browser-only presentation component, suppressed in desktop builds, so installed users are not prompted to install again.