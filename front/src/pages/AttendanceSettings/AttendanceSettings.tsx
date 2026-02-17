import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Bell, 
  Lock, 
  Moon, 
  Sun, 
  Shield, 
  Save, 
  ChevronRight,
  Monitor,
  SmartphoneNfc,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/components/ui/card";
import { Button } from "../../shared/components/ui/button";
import { toast } from "sonner";

export function AttendanceSettings() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [language, setLanguage] = useState("日本語");
  
  const handleSave = () => {
    toast.success("設定を保存しました", {
      description: "変更内容は次回のログイン時にも適用されます。",
    });
  };

  const sections = [
    { id: "profile", label: "プロフィール", icon: User },
    { id: "notifications", label: "通知設定", icon: Bell },
    { id: "security", label: "セキュリティ", icon: Lock },
    { id: "display", label: "表示設定", icon: Monitor },
  ];

  const [activeSection, setActiveSection] = useState("profile");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeSection === section.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-gray-500 hover:bg-white hover:text-gray-900"
                }`}
              >
                <section.icon size={18} />
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-6">
          <AnimatePresence mode="wait">
            {activeSection === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
                  <CardHeader className="bg-gray-50/50 p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <User className="text-blue-600" size={20} />
                      プロフィール設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-8 pb-6 border-b border-gray-50">
                      <div className="relative group">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                          田
                        </div>
                        <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-md text-gray-400 hover:text-blue-600 transition-colors border border-gray-100">
                          <SmartphoneNfc size={16} />
                        </button>
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg text-gray-900">田中 太郎</h4>
                        <p className="text-sm text-gray-500">営業部 / 正社員</p>
                        <p className="text-xs text-gray-400">社員番号: EMP-2024001</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">姓名</label>
                        <input type="text" defaultValue="田中 太郎" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">メールアドレス</label>
                        <input type="email" defaultValue="t.tanaka@example.com" className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-sm rounded-3xl">
                  <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Bell className="text-blue-600" size={20} />
                      通知設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    {[
                      { title: "打刻忘れ通知", desc: "定時を過ぎても打刻がない場合に通知します", icon: Clock },
                      { title: "申請承認通知", desc: "申請が承認または却下された場合に通知します", icon: FileText },
                      { title: "休暇リマインド", desc: "取得予定の休暇の1日前に通知します", icon: Calendar },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-50 rounded-2xl text-gray-400">
                            <item.icon size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.title}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "display" && (
              <motion.div
                key="display"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-sm rounded-3xl">
                  <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold">外観・表示設定</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-8">
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700">テーマ設定</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { id: "light", label: "ライト", icon: Sun },
                          { id: "dark", label: "ダーク", icon: Moon },
                          { id: "system", label: "システム", icon: Monitor },
                        ].map((t) => (
                          <button
                            key={t.id}
                            onClick={() => setTheme(t.id as any)}
                            className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                              theme === t.id ? "border-blue-500 bg-blue-50 text-blue-600" : "border-gray-50 text-gray-500 hover:border-gray-200"
                            }`}
                          >
                            <t.icon size={24} />
                            <span className="text-xs font-bold">{t.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-sm font-bold text-gray-700">使用言語</label>
                      <select 
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full p-3 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                      >
                        <option>日本語</option>
                        <option>English</option>
                        <option>简体中文</option>
                        <option>繁體中文</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {activeSection === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card className="border-none shadow-sm rounded-3xl">
                  <CardHeader className="p-8 border-b border-gray-100">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Shield className="text-red-500" size={20} />
                      セキュリティ設定
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                        <div className="flex items-center gap-3">
                          <AlertCircle className="text-red-500" size={20} />
                          <div>
                            <p className="text-sm font-bold text-red-900">2要素認証が未設定です</p>
                            <p className="text-xs text-red-700">アカウントの保護を強化するために設定を推奨します。</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="bg-white border-red-200 text-red-600 hover:bg-red-50 rounded-xl">
                          設定する
                        </Button>
                      </div>

                      <div className="space-y-4 pt-4">
                        <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-gray-100 px-6 font-bold group">
                          パスワードの変更
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                        </Button>
                        <Button variant="outline" className="w-full justify-between h-14 rounded-2xl border-gray-100 px-6 font-bold group">
                          ログイン履歴の確認
                          <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900 transition-colors" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button variant="ghost" className="rounded-xl text-gray-500 font-bold">
              リセット
            </Button>
            <Button 
              onClick={handleSave}
              className="px-8 h-12 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 gap-2 font-bold"
            >
              <Save size={18} />
              変更を保存
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { AnimatePresence } from "framer-motion";
import { FileText, Calendar, AlertCircle } from "lucide-react";
