'use client';

import React, { useState } from 'react';
import { Dices, Copy, Check, Download, RotateCcw, TrendingUp, Hash } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const content = {
  id: {
    title: "Random Number Generator",
    subtitle: "Generate angka random dengan berbagai opsi",
    settings: "Pengaturan",
    minNumber: "Angka Minimum",
    maxNumber: "Angka Maksimum",
    quantity: "Jumlah Angka",
    options: "Opsi",
    uniqueNumbers: "Angka Unik (Tanpa duplikat)",
    allowDecimals: "Izinkan Desimal",
    decimalPlaces: "Jumlah Desimal",
    sortOrder: "Urutan",
    randomOrder: "Acak",
    ascending: "Naik",
    descending: "Turun",
    excludeNumbers: "Exclude Angka",
    excludePlaceholder: "Pisahkan dengan koma (contoh: 5,13,27)",
    generate: "Generate Angka",
    generating: "Generating...",
    results: "Hasil",
    noResults: "Klik tombol generate untuk membuat angka",
    copyAll: "Copy Semua",
    copied: "Copied!",
    export: "Export .txt",
    statistics: "Statistik",
    total: "Total",
    average: "Rata-rata",
    min: "Minimum",
    max: "Maksimum",
    count: "Jumlah",
    formatOutput: "Format Output",
    list: "List",
    commaSeparated: "Pisah Koma",
    spaceSeparated: "Pisah Spasi",
    history: "Riwayat",
    noHistory: "Belum ada riwayat",
    alertMinMax: "Angka minimum harus lebih kecil dari maksimum!",
    alertQuantity: "Jumlah angka tidak valid!",
    alertUniqueLimit: "Jumlah angka unik tidak bisa melebihi range (max - min + 1)!",
    clearHistory: "Clear"
  },
  en: {
    title: "Random Number Generator",
    subtitle: "Generate random numbers with various options",
    settings: "Settings",
    minNumber: "Minimum Number",
    maxNumber: "Maximum Number",
    quantity: "Quantity",
    options: "Options",
    uniqueNumbers: "Unique Numbers (No duplicates)",
    allowDecimals: "Allow Decimals",
    decimalPlaces: "Decimal Places",
    sortOrder: "Sort Order",
    randomOrder: "Random",
    ascending: "Ascending",
    descending: "Descending",
    excludeNumbers: "Exclude Numbers",
    excludePlaceholder: "Separate with comma (e.g., 5,13,27)",
    generate: "Generate Numbers",
    generating: "Generating...",
    results: "Results",
    noResults: "Click generate button to create numbers",
    copyAll: "Copy All",
    copied: "Copied!",
    export: "Export .txt",
    statistics: "Statistics",
    total: "Total",
    average: "Average",
    min: "Minimum",
    max: "Maximum",
    count: "Count",
    formatOutput: "Output Format",
    list: "List",
    commaSeparated: "Comma Separated",
    spaceSeparated: "Space Separated",
    history: "History",
    noHistory: "No history yet",
    alertMinMax: "Minimum must be less than maximum!",
    alertQuantity: "Invalid quantity!",
    alertUniqueLimit: "Unique numbers quantity cannot exceed range (max - min + 1)!",
    clearHistory: "Clear"
  }
};

type SortOrder = 'random' | 'asc' | 'desc';
type OutputFormat = 'list' | 'comma' | 'space';

export default function RandomNumberGeneratorPage() {
  const { darkMode, language } = useApp();
  const [minNumber, setMinNumber] = useState(1);
  const [maxNumber, setMaxNumber] = useState(100);
  const [quantity, setQuantity] = useState(10);
  const [uniqueNumbers, setUniqueNumbers] = useState(false);
  const [allowDecimals, setAllowDecimals] = useState(false);
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [sortOrder, setSortOrder] = useState<SortOrder>('random');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('list');
  const [excludeNumbers, setExcludeNumbers] = useState('');
  const [results, setResults] = useState<number[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ numbers: number[]; timestamp: string; config: string }>>([]);

  const t = content[language];

  const parseExcludeNumbers = (): number[] => {
    if (!excludeNumbers.trim()) return [];
    return excludeNumbers
      .split(',')
      .map(n => parseFloat(n.trim()))
      .filter(n => !isNaN(n));
  };

  const generateNumbers = () => {
    // Validation
    if (minNumber >= maxNumber) {
      alert(t.alertMinMax);
      return;
    }

    if (quantity < 1 || quantity > 10000) {
      alert(t.alertQuantity);
      return;
    }

    const range = maxNumber - minNumber + 1;
    if (uniqueNumbers && quantity > range) {
      alert(t.alertUniqueLimit);
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const excluded = parseExcludeNumbers();
      let generated: number[] = [];

      if (uniqueNumbers) {
        // Generate unique numbers
        const available: number[] = [];
        for (let i = minNumber; i <= maxNumber; i++) {
          if (!excluded.includes(i)) {
            available.push(i);
          }
        }

        // Shuffle and pick
        const shuffled = available.sort(() => Math.random() - 0.5);
        generated = shuffled.slice(0, Math.min(quantity, shuffled.length));
      } else {
        // Generate with possible duplicates
        for (let i = 0; i < quantity; i++) {
          let num: number;
          do {
            if (allowDecimals) {
              num = Math.random() * (maxNumber - minNumber) + minNumber;
              num = parseFloat(num.toFixed(decimalPlaces));
            } else {
              num = Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
            }
          } while (excluded.includes(num));
          
          generated.push(num);
        }
      }

      // Apply sorting
      if (sortOrder === 'asc') {
        generated.sort((a, b) => a - b);
      } else if (sortOrder === 'desc') {
        generated.sort((a, b) => b - a);
      }
      // 'random' keeps original order

      setResults(generated);

      // Add to history
      const config = `${minNumber}-${maxNumber}, qty:${quantity}${uniqueNumbers ? ', unique' : ''}${allowDecimals ? ', decimal' : ''}`;
      setHistory(prev => [{
        numbers: generated,
        timestamp: new Date().toLocaleString(language === 'id' ? 'id-ID' : 'en-US'),
        config
      }, ...prev.slice(0, 9)]);

      setIsGenerating(false);
    }, 300);
  };

  const formatNumbers = (numbers: number[]): string => {
    if (outputFormat === 'comma') return numbers.join(', ');
    if (outputFormat === 'space') return numbers.join(' ');
    return numbers.join('\n');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const exportToFile = () => {
    const text = formatNumbers(results);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `random-numbers-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateStats = () => {
    if (results.length === 0) return null;
    const sum = results.reduce((acc, n) => acc + n, 0);
    return {
      total: sum.toFixed(allowDecimals ? decimalPlaces : 0),
      average: (sum / results.length).toFixed(allowDecimals ? decimalPlaces : 2),
      min: Math.min(...results).toFixed(allowDecimals ? decimalPlaces : 0),
      max: Math.max(...results).toFixed(allowDecimals ? decimalPlaces : 0),
      count: results.length
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            <Dices className="w-10 h-10" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div>
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-6" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.settings}
              </h2>

              {/* Min & Max */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.minNumber}
                  </label>
                  <input
                    type="number"
                    value={minNumber}
                    onChange={(e) => setMinNumber(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                      color: darkMode ? '#E6E6E6' : '#3A3A3A',
                      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.maxNumber}
                  </label>
                  <input
                    type="number"
                    value={maxNumber}
                    onChange={(e) => setMaxNumber(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                      color: darkMode ? '#E6E6E6' : '#3A3A3A',
                      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                    }}
                  />
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  {t.quantity}
                </label>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#E6E6E6' : '#3A3A3A',
                    borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                  }}
                />
              </div>

              {/* Options */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  {t.options}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="uniqueNumbers"
                      checked={uniqueNumbers}
                      onChange={(e) => setUniqueNumbers(e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                    />
                    <label htmlFor="uniqueNumbers" className="text-sm cursor-pointer" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                      {t.uniqueNumbers}
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="allowDecimals"
                      checked={allowDecimals}
                      onChange={(e) => setAllowDecimals(e.target.checked)}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                    />
                    <label htmlFor="allowDecimals" className="text-sm cursor-pointer" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                      {t.allowDecimals}
                    </label>
                  </div>

                  {allowDecimals && (
                    <div className="ml-7">
                      <label className="block text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                        {t.decimalPlaces}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={decimalPlaces}
                        onChange={(e) => setDecimalPlaces(Math.max(1, Math.min(10, parseInt(e.target.value) || 2)))}
                        className="w-24 px-3 py-1 rounded-lg border text-sm"
                        style={{
                          backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                          color: darkMode ? '#E6E6E6' : '#3A3A3A',
                          borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sort Order */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  {t.sortOrder}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'random' as SortOrder, label: t.randomOrder },
                    { value: 'asc' as SortOrder, label: t.ascending },
                    { value: 'desc' as SortOrder, label: t.descending }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortOrder(option.value)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                      style={{
                        backgroundColor: sortOrder === option.value ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#252525' : '#e8e1ca'),
                        color: sortOrder === option.value ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a')
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exclude Numbers */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  {t.excludeNumbers}
                </label>
                <input
                  type="text"
                  value={excludeNumbers}
                  onChange={(e) => setExcludeNumbers(e.target.value)}
                  placeholder={t.excludePlaceholder}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#E6E6E6' : '#3A3A3A',
                    borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                  }}
                />
              </div>

              <button
                onClick={generateNumbers}
                disabled={isGenerating}
                className="w-full px-6 py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                  color: '#FEFAF3'
                }}
              >
                <RotateCcw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                {isGenerating ? t.generating : t.generate}
              </button>
            </Card>
          </div>

          {/* Right Panel - Results */}
          <div>
            <Card className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {t.results}
                </h2>
                
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(formatNumbers(results))}
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? t.copied : t.copyAll}
                    </button>
                    <button
                      onClick={exportToFile}
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      <Download className="w-4 h-4" />
                      {t.export}
                    </button>
                  </div>
                )}
              </div>

              {/* Format Output */}
              {results.length > 0 && (
                <div className="mb-4">
                  <label className="block text-xs mb-2" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                    {t.formatOutput}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'list' as OutputFormat, label: t.list },
                      { value: 'comma' as OutputFormat, label: t.commaSeparated },
                      { value: 'space' as OutputFormat, label: t.spaceSeparated }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setOutputFormat(option.value)}
                        className="px-2 py-1 rounded text-xs font-medium transition-all"
                        style={{
                          backgroundColor: outputFormat === option.value ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#252525' : '#e8e1ca'),
                          color: outputFormat === option.value ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a')
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 ? (
                <div
                  className="p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto"
                  style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#B6861F' : '#C9A227',
                    border: `2px solid ${darkMode ? '#2a2a2a' : '#ddd4b8'}`,
                    whiteSpace: outputFormat === 'list' ? 'pre-line' : 'pre-wrap'
                  }}
                >
                  {formatNumbers(results)}
                </div>
              ) : (
                <div className="text-center py-12" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  <Hash className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>{t.noResults}</p>
                </div>
              )}
            </Card>

            {/* Statistics */}
            {stats && (
              <Card className="mb-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  <TrendingUp className="w-5 h-5" />
                  {t.statistics}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t.count, value: stats.count },
                    { label: t.total, value: stats.total },
                    { label: t.average, value: stats.average },
                    { label: t.min, value: stats.min },
                    { label: t.max, value: stats.max }
                  ].map((stat, idx) => (
                    <div key={idx} className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                      <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                        {stat.label}
                      </div>
                      <div className="text-lg font-bold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* History */}
            {history.length > 0 && (
              <Card>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                    {t.history} ({history.length})
                  </h3>
                  <button
                    onClick={() => setHistory([])}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                      color: darkMode ? '#808080' : '#8a8a8a'
                    }}
                  >
                    {t.clearHistory}
                  </button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                      style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}
                      onClick={() => {
                        setResults(item.numbers);
                        copyToClipboard(formatNumbers(item.numbers));
                      }}
                    >
                      <div className="text-sm font-mono mb-1" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                        {item.numbers.slice(0, 10).join(', ')}{item.numbers.length > 10 ? '...' : ''}
                      </div>
                      <div className="text-xs" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                        {item.timestamp} • {item.config}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}