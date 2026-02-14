import { Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl text-gray-900">
              AppName
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              機能
            </a>
            <a href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              について
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              料金
            </a>
            <a href="#contact" className="text-gray-600 hover:text-gray-900 transition-colors">
              お問い合わせ
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost">ログイン</Button>
            <Button>始める</Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            <a
              href="#features"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              機能
            </a>
            <a
              href="#about"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              について
            </a>
            <a
              href="#pricing"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              料金
            </a>
            <a
              href="#contact"
              className="block px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              お問い合わせ
            </a>
            <div className="pt-3 space-y-2">
              <Button variant="ghost" className="w-full">
                ログイン
              </Button>
              <Button className="w-full">始める</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
