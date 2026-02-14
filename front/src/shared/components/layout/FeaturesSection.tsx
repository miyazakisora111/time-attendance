import { Zap, Shield, Smartphone, Users, BarChart, Cloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

const features = [
  {
    icon: Zap,
    title: "高速パフォーマンス",
    description: "最新技術により、驚くほど高速な処理速度を実現します。",
  },
  {
    icon: Shield,
    title: "セキュリティ",
    description: "エンタープライズグレードのセキュリティで大切なデータを保護します。",
  },
  {
    icon: Smartphone,
    title: "レスポンシブ対応",
    description: "すべてのデバイスで最適な体験を提供します。",
  },
  {
    icon: Users,
    title: "チームコラボレーション",
    description: "チームでシームレスに協力し、生産性を向上させます。",
  },
  {
    icon: BarChart,
    title: "詳細な分析",
    description: "リアルタイムのインサイトでビジネスを成長させます。",
  },
  {
    icon: Cloud,
    title: "クラウド同期",
    description: "どこからでもアクセス可能なクラウドストレージ。",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-gray-900 mb-4">主な機能</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ビジネスを加速させる強力な機能を提供します
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-white" size={24} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
