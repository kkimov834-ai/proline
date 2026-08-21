/* Industrial Command design: application shell delegates the full production workflow to the PROLINE board. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "./components/ErrorBoundary";
import Home from "./pages/Home";

export default function App() {
  return <ErrorBoundary><TooltipProvider><Toaster theme="dark" /><Home /></TooltipProvider></ErrorBoundary>;
}
