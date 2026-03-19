import React from "react";
import { Clock } from "@/shared/components";

export const ClockDisplay = React.memo(function ClockDisplay() {
  return <Clock className="rounded-lg from-blue-50 to-indigo-50 py-6 text-center" />;
});
