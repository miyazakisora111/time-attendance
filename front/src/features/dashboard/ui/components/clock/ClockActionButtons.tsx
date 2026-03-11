import React from "react";
import { Button } from "@/shared/components/buttons/Button";
import { Clock, LogIn, LogOut, Coffee } from "lucide-react";

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
  onAction
}: ClockActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {status === "out" && (
        <Button
          onClick={() => onAction("in", "in")}
          disabled={isPending}
          className="col-span-2 h-14 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold transition-all shadow-sm hover:shadow"
          size="lg"
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
            className="h-14 border-orange-600 text-orange-600 hover:bg-orange-50 font-bold transition-all shadow-sm hover:shadow"
          >
            <Coffee size={20} />
            休憩開始
          </Button>
          <Button
            onClick={() => onAction("out", "out")}
            disabled={isPending}
            className="h-14 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold transition-all shadow-sm hover:shadow"
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
          className="col-span-2 h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold transition-all shadow-sm hover:shadow"
          size="lg"
        >
          <Clock size={20} />
          休憩終了
        </Button>
      )}
    </div>
  );
});
