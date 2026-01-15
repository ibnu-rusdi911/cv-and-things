'use client';

import React, { useState, useRef } from 'react';
import { Upload, Trash2, RotateCcw, Sparkles, Download, Users } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const content = {
  id: {
    title: "Random Name Picker",
    subtitle: "Undian nama secara random & fair",
    participants: "Daftar Peserta",
    upload: "Upload .txt",
    placeholder: "Masukkan nama (satu nama per baris)\nContoh:\nBudi Santoso\nSiti Nurhaliza\nAhmad Zaki",
    total: "Total",
    clear: "Clear",
    settings: "Pengaturan",
    numWinners: "Jumlah Pemenang",
    removeAfter: "Hapus pemenang dari daftar setelah dipilih",
    winner: "Pemenang",
    startDraw: "Mulai Undian",
    drawing: "Mengundi...",
    waitingText: "Tekan tombol untuk memulai undian",
    history: "Riwayat Pemenang",
    export: "Export",
    alertMinName: "Masukkan minimal 1 nama!",
    alertExceedParticipants: "Jumlah pemenang lebih banyak dari jumlah peserta!"
  },
  en: {
    title: "Random Name Picker",
    subtitle: "Random & fair name drawing",
    participants: "Participants List",
    upload: "Upload .txt",
    placeholder: "Enter names (one name per line)\nExample:\nJohn Doe\nJane Smith\nBob Wilson",
    total: "Total",
    clear: "Clear",
    settings: "Settings",
    numWinners: "Number of Winners",
    removeAfter: "Remove winners from list after selection",
    winner: "Winner",
    startDraw: "Start Draw",
    drawing: "Drawing...",
    waitingText: "Press button to start drawing",
    history: "Winners History",
    export: "Export",
    alertMinName: "Enter at least 1 name!",
    alertExceedParticipants: "Number of winners exceeds number of participants!"
  }
};

export default function RandomNamePickerPage() {
  const { darkMode, language } = useApp();
  const [names, setNames] = useState<string[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentDisplay, setCurrentDisplay] = useState('');
  const [winners, setWinners] = useState<Array<{ name: string; timestamp: string }>>([]);
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [removeAfterPick, setRemoveAfterPick] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const spinIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const t = content[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    const nameList = e.target.value.split('\n').filter(name => name.trim() !== '');
    setNames(nameList);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text);
        const nameList = text.split('\n').filter(name => name.trim() !== '');
        setNames(nameList);
      };
      reader.readAsText(file);
    }
  };

  const pickWinner = () => {
    if (names.length === 0) {
      alert(t.alertMinName);
      return;
    }

    if (numberOfWinners > names.length) {
      alert(`${t.alertExceedParticipants} (${numberOfWinners} > ${names.length})`);
      return;
    }

    setIsSpinning(true);
    let counter = 0;
    const maxSpins = 30;

    spinIntervalRef.current = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setCurrentDisplay(randomName);
      counter++;

      if (counter >= maxSpins) {
        if (spinIntervalRef.current) {
          clearInterval(spinIntervalRef.current);
        }
        
        const shuffled = [...names].sort(() => 0.5 - Math.random());
        const selectedWinners = shuffled.slice(0, numberOfWinners);
        
        setWinners(prev => [...prev, ...selectedWinners.map(name => ({
          name,
          timestamp: new Date().toLocaleString(language === 'id' ? 'id-ID' : 'en-US')
        }))]);
        
        setCurrentDisplay(selectedWinners.join(', '));
        setIsSpinning(false);
        setShowConfetti(true);
        
        setTimeout(() => setShowConfetti(false), 3000);

        if (removeAfterPick) {
          const remainingNames = names.filter(name => !selectedWinners.includes(name));
          setNames(remainingNames);
          setInputText(remainingNames.join('\n'));
        }
      }
    }, 100);
  };

  const clearAll = () => {
    setInputText('');
    setNames([]);
    setCurrentDisplay('');
    setWinners([]);
  };

  const removeWinner = (index: number) => {
    setWinners(prev => prev.filter((_, i) => i !== index));
  };

  const exportWinners = () => {
    const text = winners.map((w, i) => `${i + 1}. ${w.name} - ${w.timestamp}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pemenang-undian-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10px',
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles style={{ color: darkMode ? '#B6861F' : '#C9A227' }} className="w-4 h-4" />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  <Users className="w-5 h-5" />
                  {t.participants}
                </h2>
                <label className="cursor-pointer">
                  <Button variant="secondary" className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    {t.upload}
                  </Button>
                  <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <textarea
                value={inputText}
                onChange={handleInputChange}
                placeholder={t.placeholder}
                className="w-full h-64 p-4 rounded-lg border resize-none focus:outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                  color: darkMode ? '#E6E6E6' : '#3A3A3A',
                  borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                }}
                onFocus={(e) => e.target.style.borderColor = darkMode ? '#B6861F' : '#C9A227'}
                onBlur={(e) => e.target.style.borderColor = darkMode ? '#2a2a2a' : '#ddd4b8'}
              />

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm" style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>
                  {t.total}: <strong style={{ color: darkMode ? '#B6861F' : '#C9A227' }}>{names.length}</strong>
                </span>
                <Button onClick={clearAll} variant="secondary" className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  {t.clear}
                </Button>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>{t.settings}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.numWinners}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={numberOfWinners}
                    onChange={(e) => setNumberOfWinners(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                      color: darkMode ? '#E6E6E6' : '#3A3A3A',
                      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                    }}
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="removeAfterPick"
                    checked={removeAfterPick}
                    onChange={(e) => setRemoveAfterPick(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                  />
                  <label htmlFor="removeAfterPick" className="text-sm cursor-pointer" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.removeAfter}
                  </label>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="mb-6 text-center" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h2 className="text-xl font-semibold mb-6" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                🎉 {t.winner}
              </h2>
              
              <div className="mb-8">
                {currentDisplay ? (
                  <div className={`text-3xl md:text-4xl font-bold transition-all duration-300 ${isSpinning ? 'scale-110' : 'scale-100'}`}
                    style={{ color: darkMode ? '#B6861F' : '#C9A227' }}>
                    {currentDisplay}
                  </div>
                ) : (
                  <div className="text-lg" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                    {t.waitingText}
                  </div>
                )}
              </div>

              <button
                onClick={pickWinner}
                disabled={isSpinning || names.length === 0}
                className="px-8 py-4 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                style={{
                  backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                  color: '#FEFAF3'
                }}
              >
                <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                {isSpinning ? t.drawing : t.startDraw}
              </button>
            </Card>

            {winners.length > 0 && (
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                    {t.history} ({winners.length})
                  </h3>
                  <Button onClick={exportWinners} variant="secondary" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    {t.export}
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {winners.map((winner, index) => (
                    <div key={index} className="flex justify-between items-center p-3 rounded-lg"
                      style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                      <div>
                        <div className="font-medium" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {index + 1}. {winner.name}
                        </div>
                        <div className="text-xs" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {winner.timestamp}
                        </div>
                      </div>
                      <button
                        onClick={() => removeWinner(index)}
                        className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" style={{ color: darkMode ? '#808080' : '#8a8a8a' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall linear forwards;
        }
      `}</style>
    </div>
  );
}