'use client';

export default function Footer() {
  return (
    <footer 
      className="mt-20 py-8"
      style={{
        background: 'rgba(11, 27, 59, 0.8)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-300">
              © 2024 Japan Travel Guide. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => console.log('Navigate to terms')}
            >
              利用規約
            </button>
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => console.log('Navigate to privacy')}
            >
              プライバシーポリシー
            </button>
            <button 
              className="text-gray-300 hover:text-white transition-colors"
              onClick={() => console.log('Navigate to help')}
            >
              ヘルプ
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}