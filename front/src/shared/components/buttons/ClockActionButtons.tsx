import React from "react";
import { Coffee, Clock, LogIn, LogOut } from "lucide-react";

import type { ClockStatus, ClockAction } from "@/__generated__/enums";
import { Button } from "@/shared/components/buttons/Button";
import { getClockActionLabel } from "@/shared/presentation/attendance/clockAction";

interface ClockActionButtonsProps {
  status: ClockStatus;
  isPending: boolean;
  onAction: (action: ClockAction) => void;
}

export const ClockActionButtons = React.memo(function ClockActionButtons({
  status,
  isPending,
  onAction,
}: ClockActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {status === "out" && (
        <Button onClick={() => onAction("in")} disabled={isPending} intent="success" size="lg" unstableClassName="col-span-2" fullWidth>
          <LogIn size={20} />
          {getClockActionLabel("in")}
        </Button>
      )}
      {status === "in" && (
        <>
          <Button onClick={() => onAction("breakStart")} disabled={isPending} variant="outline" intent="warning" size="lg" fullWidth>
            <Coffee size={20} />
            {getClockActionLabel("breakStart")}
          </Button>
          <Button onClick={() => onAction("out")} disabled={isPending} intent="danger" size="lg" fullWidth>
            <LogOut size={20} />
            {getClockActionLabel("out")}
          </Button>
        </>
      )}
      {status === "break" && (
        <Button onClick={() => onAction("breakEnd")} disabled={isPending} intent="primary" size="lg" unstableClassName="col-span-2" fullWidth>
          <Clock size={20} />
          {getClockActionLabel("breakEnd")}
        </Button>
      )}
    </div>
  );
});
