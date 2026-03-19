import React from "react";
import { Coffee, Clock, LogIn, LogOut } from "lucide-react";
import type { ClockStatus } from "@/domain/attendance/attendance";
import type { ClockAction } from "@/domain/attendance/attendance";
import { Button } from "@/shared/components/buttons/Button";
import { getActionLabel } from "@/shared/presentation/attendance";

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
        <Button onClick={() => onAction("in")} disabled={isPending} intent="success" size="lg" className="col-span-2" fullWidth>
          <LogIn size={20} />
          {getActionLabel("in")}
        </Button>
      )}
      {status === "in" && (
        <>
          <Button onClick={() => onAction("break_start")} disabled={isPending} variant="outline" intent="warning" size="lg" fullWidth>
            <Coffee size={20} />
            {getActionLabel("break_start")}
          </Button>
          <Button onClick={() => onAction("out")} disabled={isPending} intent="danger" size="lg" fullWidth>
            <LogOut size={20} />
            {getActionLabel("out")}
          </Button>
        </>
      )}
      {status === "break" && (
        <Button onClick={() => onAction("break_end")} disabled={isPending} intent="primary" size="lg" className="col-span-2" fullWidth>
          <Clock size={20} />
          {getActionLabel("break_end")}
        </Button>
      )}
    </div>
  );
});
