/* Industrial Command design: application shell delegates the full production workflow to the PROLINE board. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

export default function App() {
  return <ErrorBoundary><TooltipProvider><Toaster theme="dark" position="top-center" closeButton richColors toastOptions={{ classNames: { success: "!bg-emerald-600 !text-white !border-emerald-400", error: "!bg-red-600 !text-white !border-red-400", info: "!bg-sky-600 !text-white !border-sky-400", description: "!text-white/85 !whitespace-pre-line" } }} /><Home /></TooltipProvider></ErrorBoundary>;
}
