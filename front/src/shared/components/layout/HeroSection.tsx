import { Button } from "../ui/button";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1765728617352-895327fcf036?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b3Jrc3BhY2UlMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2NTc5NzE5NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Hero background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-white mb-6">
            未来を創るための
            <br />
            革新的なソリューション
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            ビジネスを次のレベルへ。私たちのプラットフォームで、あなたのアイデアを現実に変えましょう。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2">
              無料で始める
              <ArrowRight size={20} />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20">
              <Play size={20} />
              デモを見る
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
          <div className="w-1.5 h-3 bg-white/70 rounded-full animate-bounce mx-auto" />
        </div>
      </div>
    </section>
  );
}