import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white mb-4">AppName</h3>
            <p className="text-gray-400">
              革新的なソリューションで、あなたのビジネスを次のレベルへ。
            </p>
          </div>
          
          <div>
            <h4 className="text-white mb-4">製品</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">機能</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">料金</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">会社</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-white transition-colors">会社概要</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">採用情報</a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">お問い合わせ</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-4">フォロー</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">
            © 2025 AppName. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              プライバシーポリシー
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              利用規約
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
