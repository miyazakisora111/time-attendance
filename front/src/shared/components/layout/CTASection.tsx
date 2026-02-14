import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-white mb-6">
          今すぐ始めましょう
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          数分でアカウントを作成し、すぐに使い始めることができます。クレジットカードは不要です。
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="outline" className="gap-2 bg-white text-blue-600 hover:bg-gray-50 border-0">
            無料トライアルを始める
            <ArrowRight size={20} />
          </Button>
          <Button size="lg" variant="outline" className="gap-2 bg-transparent text-white border-white hover:bg-white/10">
            お問い合わせ
          </Button>
        </div>
      </div>
    </section>
  );
}
