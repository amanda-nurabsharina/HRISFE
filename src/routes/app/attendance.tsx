import { createFileRoute } from "@tanstack/react-router";

import { Attendance } from "../../pages/App";

export const Route = createFileRoute("/app/attendance" as any)({
  component: Attendance,
});
