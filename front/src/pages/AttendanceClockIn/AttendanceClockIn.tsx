import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, LogIn, LogOut, Coffee, MapPin, Shield, CheckCircle2, History, AlertCircle } from "lucide-react";
import { Button } from "../../shared/components//ui/button";
import { Card, CardContent } from "../../shared/components//ui/card";
import { toast } from "sonner";

type Status = "out" | "working" | "break";

export function AttendanceClockIn() {
  const [status, setStatus] = useState<Status>("out");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastAction, setLastAction] = useState<{ type: string; time: string } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAction = (type: Status, label: string) => {
    const now = new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    setStatus(type);
    setLastAction({ type: label, time: now });
    toast.success(`${label}しました (${now})`, {
      description: "本日の勤務データに記録されました。",
      icon: <CheckCircle2 className="text-green-500" size={18} />,
    });
  };

  const getStatusDisplay = () => {
    switch (status) {
      case "working":
        return { 
          text: "勤務中", 
          color: "text-blue-600", 
          bgColor: "bg-blue-50",
          description: "今日も順調に業務が進んでいます。適度に休憩を取りましょう。" 
        };
      case "break":
        return { 
          text: "休憩中", 
          color: "text-amber-600", 
          bgColor: "bg-amber-50",
          description: "リフレッシュして、次の業務に備えましょう。" 
        };
      default:
        return { 
          text: "未出勤", 
          color: "text-gray-500", 
          bgColor: "bg-gray-100",
          description: "業務を開始する準備はできましたか？" 
        };
    }
  };

  const currentStatus = getStatusDisplay();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Clock Section */}
      <div className="relative overflow-hidden bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-32 -mt-32 opacity-50" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
          {/* Time Display */}
          <div className="flex-1 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-50 text-gray-500 text-sm font-medium mb-6"
            >
              <Clock size={16} className="text-blue-500" />
              {currentTime.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
            </motion.div>
            
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tight tabular-nums mb-4">
              {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <MapPin size={14} className="text-gray-300" />
                東京都港区港南 / Office-A
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-200" />
              <span className="flex items-center gap-1.5">
                <Shield size={14} className="text-gray-300" />
                IP: 192.168.1.xxx
              </span>
            </div>
          </div>

          {/* Status Indicator */}
          <div className="w-full md:w-72">
            <Card className={`border-none shadow-none ${currentStatus.bgColor} rounded-3xl p-6 transition-colors duration-500`}>
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-4 ${currentStatus.color}`}>
                  {status === "working" ? <CheckCircle2 size={32} /> : status === "break" ? <Coffee size={32} /> : <AlertCircle size={32} />}
                </div>
                <h3 className={`text-xl font-bold mb-2 ${currentStatus.color}`}>{currentStatus.text}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {currentStatus.description}
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Button
          disabled={status !== "out"}
          onClick={() => handleAction("working", "出勤")}
          className={`h-24 rounded-3xl text-lg font-bold gap-3 transition-all active:scale-95 shadow-lg ${
            status === "out" ? "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-100" : "bg-gray-100 text-gray-400"
          }`}
        >
          <LogIn size={24} />
          出勤
        </Button>

        <Button
          disabled={status !== "working"}
          onClick={() => handleAction("break", "休憩開始")}
          className={`h-24 rounded-3xl text-lg font-bold gap-3 transition-all active:scale-95 shadow-lg ${
            status === "working" ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-100" : "bg-gray-100 text-gray-400"
          }`}
        >
          <Coffee size={24} />
          休憩
        </Button>

        <Button
          disabled={status !== "break"}
          onClick={() => handleAction("working", "休憩終了")}
          className={`h-24 rounded-3xl text-lg font-bold gap-3 transition-all active:scale-95 shadow-lg ${
            status === "break" ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100" : "bg-gray-100 text-gray-400"
          }`}
        >
          <CheckCircle2 size={24} />
          戻り
        </Button>

        <Button
          disabled={status === "out"}
          onClick={() => handleAction("out", "退勤")}
          className={`h-24 rounded-3xl text-lg font-bold gap-3 transition-all active:scale-95 shadow-lg ${
            status !== "out" ? "bg-gray-900 hover:bg-black text-white shadow-gray-200" : "bg-gray-100 text-gray-400"
          }`}
        >
          <LogOut size={24} />
          退勤
        </Button>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's History */}
        <Card className="col-span-1 md:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
          <div className="p-6 flex items-center justify-between border-b border-gray-50">
            <h4 className="font-bold flex items-center gap-2">
              <History size={18} className="text-gray-400" />
              本日の履歴
            </h4>
            <span className="text-xs text-gray-400 font-medium">直近3件を表示</span>
          </div>
          <CardContent className="p-6">
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {lastAction ? (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-1.5 h-10 rounded-full bg-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">{lastAction.type}</p>
                      <p className="text-xs text-gray-400 font-medium">打刻完了</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900 tracking-tight">{lastAction.time}</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-400">本日の打刻履歴はありません</p>
                  </div>
                )}
                
                {/* Static placeholders for demo */}
                {status !== "out" && !lastAction?.type.includes("出勤") && (
                  <div className="flex items-center gap-4 opacity-40">
                    <div className="w-1.5 h-10 rounded-full bg-gray-200" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">出勤</p>
                      <p className="text-xs text-gray-400 font-medium">打刻完了</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-gray-900 tracking-tight">09:00</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>

        {/* Work Stats Card */}
        <Card className="border-none shadow-sm rounded-3xl bg-blue-600 text-white p-8">
          <div className="h-full flex flex-col justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">現在の勤務時間</p>
              <h4 className="text-4xl font-black tracking-tight mb-6">
                {status === "working" ? "05:24" : status === "break" ? "05:00" : "00:00"}
              </h4>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-blue-500/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">休憩合計</span>
                <span className="font-bold">00:45</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-100">残業予定</span>
                <span className="font-bold">00:00</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
