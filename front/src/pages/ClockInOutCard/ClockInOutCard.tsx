import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { Clock, LogIn, LogOut, Coffee } from "lucide-react";
import { useState } from "react";

export function ClockInOutCard() {
  const [status, setStatus] = useState<"out" | "in" | "break">("out");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  });

  const handleClockIn = () => setStatus("in");
  const handleClockOut = () => setStatus("out");
  const handleBreakStart = () => setStatus("break");
  const handleBreakEnd = () => setStatus("in");

  const statusInfo = {
    out: { text: "退勤中", color: "text-gray-600", bgColor: "bg-gray-100" },
    in: { text: "勤務中", color: "text-green-600", bgColor: "bg-green-100" },
    break: { text: "休憩中", color: "text-orange-600", bgColor: "bg-orange-100" },
  };

  return (
    <Card className="shadow-lg border-2 border-blue-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="text-blue-600" />
            打刻
          </CardTitle>
          <div className={`px-3 py-1 rounded-full ${statusInfo[status].bgColor}`}>
            <span className={`${statusInfo[status].color}`}>
              {statusInfo[status].text}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Time Display */}
        <div className="text-center py-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">現在時刻</p>
          <p className="text-4xl mb-1">
            {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-sm text-gray-600">
            {currentTime.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {status === "out" && (
            <Button 
              onClick={handleClockIn} 
              className="col-span-2 h-14 bg-green-600 hover:bg-green-700 gap-2"
              size="lg"
            >
              <LogIn size={20} />
              出勤
            </Button>
          )}
          
          {status === "in" && (
            <>
              <Button 
                onClick={handleBreakStart} 
                variant="outline"
                className="h-14 border-orange-600 text-orange-600 hover:bg-orange-50 gap-2"
              >
                <Coffee size={20} />
                休憩開始
              </Button>
              <Button 
                onClick={handleClockOut} 
                className="h-14 bg-red-600 hover:bg-red-700 gap-2"
              >
                <LogOut size={20} />
                退勤
              </Button>
            </>
          )}
          
          {status === "break" && (
            <>
              <Button 
                onClick={handleBreakEnd} 
                className="col-span-2 h-14 bg-blue-600 hover:bg-blue-700 gap-2"
                size="lg"
              >
                <Clock size={20} />
                休憩終了
              </Button>
            </>
          )}
        </div>

        {/* Today's Record */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm text-gray-600">本日の記録</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">出勤時刻</p>
              <p className="text-lg">09:00</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">勤務時間</p>
              <p className="text-lg">5時間 30分</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
