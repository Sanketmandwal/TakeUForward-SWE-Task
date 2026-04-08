import { CalendarProvider } from "./context";
import { CalendarApp }      from "./components/Calendar";

/**
 * App — wraps the entire application in CalendarProvider
 * so all components can access shared state via useCalendar().
 */
export default function App() {
  return (
    <CalendarProvider>
      <CalendarApp />
    </CalendarProvider>
  );
}
