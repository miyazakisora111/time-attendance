import React from "react";
import { Coffee, Clock, LogIn, LogOut } from "lucide-react";
import { Button } from "@/shared/components/buttons/Button";

export type ClockStatus = "out" | "in" | "break";
export type ClockAction = "in" | "out" | "break_start" | "break_end";

interface ClockActionButtonsProps {
  status: ClockStatus;
  isPending: boolean;
  onAction: (action: ClockAction, nextStatus: ClockStatus) => void;
}

export const ClockActionButtons = React.memo(function ClockActionButtons({
  status,
  isPending,
  onAction,
}: ClockActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {status === "out" && (
        <Button
          onClick={() => onAction("in", "in")}
          disabled={isPending}
          intent="success"
          size="lg"
          className="col-span-2"
          fullWidth
        >
          <LogIn size={20} />
          出勤
        </Button>
      )}

      {status === "in" && (
        <>
          <Button
            onClick={() => onAction("break_start", "break")}
            disabled={isPending}
            variant="outline"
            intent="warning"
            size="lg"
            fullWidth
          >
            <Coffee size={20} />
            休憩開始
          </Button>
          <Button
            onClick={() => onAction("out", "out")}
            disabled={isPending}
            intent="danger"
            size="lg"
            fullWidth
          >
            <LogOut size={20} />
            退勤
          </Button>
        </>
      )}

      {status === "break" && (
        <Button
          onClick={() => onAction("break_end", "in")}
          disabled={isPending}
          intent="primary"
          size="lg"
          className="col-span-2"
          fullWidth
        >
          <Clock size={20} />
          休憩終了
        </Button>
      )}
    </div>
  );
});
