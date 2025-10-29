'use client';

import { useState } from 'react';
import AccountModal from '@/components/AccountModal';

export default function EntrarPage() {
  const [showModal, setShowModal] = useState(true);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a] py-20 px-6 flex items-center justify-center">
      <AccountModal open={showModal} onClose={() => setShowModal(false)} />
      
      {!showModal && (
        <div className="text-center">
          <button
            onClick={() => setShowModal(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C42] hover:from-[#FF8C42] hover:to-[#FF6B35] text-[#0a0a0a] font-bold rounded-full transition-all hover:scale-105"
          >
            Abrir Login
          </button>
        </div>
      )}
    </main>
  );
}