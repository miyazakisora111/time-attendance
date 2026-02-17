import React, { useState } from "react";
import { Button } from "../../shared/components/ui/button";
import { Input } from "../../shared/components/ui/input";
import { Label } from "../../shared/components/ui/label";
import { Card, CardContent } from "../../shared/components/ui/card";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
      toast.success("おかえりなさい、田中さん");
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F9FAFB] p-6">
      {/* Subtle Background Accent */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-blue-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white mb-6 shadow-xl shadow-blue-100">
            <ArrowRight size={24} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">勤怠管理システム</h1>
          <p className="text-gray-500 mt-2 text-sm font-light">アカウント情報を入力してログインしてください</p>
        </div>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-[2rem] overflow-hidden">
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">メールアドレス</Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.jp" 
                    className="pl-12 h-14 bg-gray-50/50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-600/5 focus:border-blue-100 transition-all rounded-2xl text-gray-900 placeholder:text-gray-300"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" name="password" className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">パスワード</Label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-blue-600 transition-colors" size={18} />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••"
                    className="pl-12 pr-12 h-14 bg-gray-50/50 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-600/5 focus:border-blue-100 transition-all rounded-2xl text-gray-900 placeholder:text-gray-300"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-blue-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-100 transition-all active:scale-[0.98] mt-2 font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>ログイン中...</span>
                  </div>
                ) : "ログイン"}
              </Button>
              
              <div className="text-center pt-2">
                <a href="#" className="text-xs text-gray-400 hover:text-blue-600 transition-colors">パスワードをお忘れの方</a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-12 text-center">
          <p className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-medium">
            Managed by Enterprise Cloud
          </p>
        </div>
      </motion.div>
    </div>
  );
}
