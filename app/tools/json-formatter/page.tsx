'use client';

import React, { useState, useEffect } from 'react';
import { Code, Copy, Check, Download, Trash2, AlertCircle, CheckCircle, Minimize2, Maximize2, FileJson } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const content = {
  id: {
    title: "JSON Formatter",
    subtitle: "Format, Validate, Minify, dan Beautify JSON",
    input: "Input JSON",
    output: "Output",
    placeholder: "Paste JSON di sini...",
    format: "Format",
    minify: "Minify",
    validate: "Validate",
    clear: "Clear",
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    valid: "Valid JSON",
    invalid: "Invalid JSON",
    errorAt: "Error di",
    line: "baris",
    indentation: "Indentasi",
    spaces2: "2 Spasi",
    spaces4: "4 Spasi",
    tabs: "Tab",
    sortKeys: "Urutkan Keys",
    escapeUnicode: "Escape Unicode",
    statistics: "Statistik",
    characters: "Karakter",
    lines: "Baris",
    size: "Ukuran",
    keys: "Keys",
    values: "Values",
    objects: "Objects",
    arrays: "Arrays",
    sample: "Sample JSON",
    loadSample: "Load Sample",
    history: "Riwayat",
    noHistory: "Belum ada riwayat",
    clearHistory: "Clear"
  },
  en: {
    title: "JSON Formatter",
    subtitle: "Format, Validate, Minify, and Beautify JSON",
    input: "JSON Input",
    output: "Output",
    placeholder: "Paste JSON here...",
    format: "Format",
    minify: "Minify",
    validate: "Validate",
    clear: "Clear",
    copy: "Copy",
    copied: "Copied!",
    download: "Download",
    valid: "Valid JSON",
    invalid: "Invalid JSON",
    errorAt: "Error at",
    line: "line",
    indentation: "Indentation",
    spaces2: "2 Spaces",
    spaces4: "4 Spaces",
    tabs: "Tab",
    sortKeys: "Sort Keys",
    escapeUnicode: "Escape Unicode",
    statistics: "Statistics",
    characters: "Characters",
    lines: "Lines",
    size: "Size",
    keys: "Keys",
    values: "Values",
    objects: "Objects",
    arrays: "Arrays",
    sample: "Sample JSON",
    loadSample: "Load Sample",
    history: "History",
    noHistory: "No history yet",
    clearHistory: "Clear"
  }
};

type IndentType = '2' | '4' | 'tab';

interface JSONStats {
  characters: number;
  lines: number;
  size: string;
  keys: number;
  values: number;
  objects: number;
  arrays: number;
}

interface HistoryItem {
  json: string;
  timestamp: string;
  action: string;
}

export default function JSONFormatterPage() {
  const { darkMode, language } = useApp();
  const [inputJSON, setInputJSON] = useState('');
  const [outputJSON, setOutputJSON] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [indentType, setIndentType] = useState<IndentType>('2');
  const [sortKeys, setSortKeys] = useState(false);
  const [escapeUnicode, setEscapeUnicode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<JSONStats | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const t = content[language];

  const sampleJSON = {
    "name": "John Doe",
    "age": 30,
    "email": "john@example.com",
    "address": {
      "street": "123 Main St",
      "city": "Jakarta",
      "country": "Indonesia"
    },
    "hobbies": ["reading", "coding", "gaming"],
    "isActive": true,
    "balance": 1250.50
  };

  const getIndentString = (): string | number => {
    if (indentType === 'tab') return '\t';
    return parseInt(indentType);
  };

  const sortObjectKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(item => sortObjectKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj)
        .sort()
        .reduce((sorted: any, key) => {
          sorted[key] = sortObjectKeys(obj[key]);
          return sorted;
        }, {});
    }
    return obj;
  };

  const calculateStats = (jsonString: string): JSONStats => {
    const lines = jsonString.split('\n').length;
    const characters = jsonString.length;
    const bytes = new Blob([jsonString]).size;
    const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(2)} KB`;

    let keys = 0;
    let values = 0;
    let objects = 0;
    let arrays = 0;

    const count = (obj: any) => {
      if (Array.isArray(obj)) {
        arrays++;
        obj.forEach(item => count(item));
      } else if (obj !== null && typeof obj === 'object') {
        objects++;
        Object.entries(obj).forEach(([key, value]) => {
          keys++;
          values++;
          count(value);
        });
      } else {
        values++;
      }
    };

    try {
      const parsed = JSON.parse(jsonString);
      count(parsed);
    } catch (e) {
      // Ignore
    }

    return { characters, lines, size, keys, values, objects, arrays };
  };

  const validateJSON = (json: string): boolean => {
    if (!json.trim()) {
      setIsValid(null);
      setErrorMessage('');
      return false;
    }

    try {
      JSON.parse(json);
      setIsValid(true);
      setErrorMessage('');
      return true;
    } catch (e: any) {
      setIsValid(false);
      const match = e.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lines = json.substring(0, position).split('\n');
        const lineNumber = lines.length;
        setErrorMessage(`${t.errorAt} ${t.line} ${lineNumber}: ${e.message}`);
      } else {
        setErrorMessage(e.message);
      }
      return false;
    }
  };

  const formatJSON = () => {
    if (!validateJSON(inputJSON)) return;

    try {
      let parsed = JSON.parse(inputJSON);
      
      if (sortKeys) {
        parsed = sortObjectKeys(parsed);
      }

      let formatted = JSON.stringify(parsed, null, getIndentString());

      if (escapeUnicode) {
        formatted = formatted.replace(/[\u007F-\uFFFF]/g, (char) => {
          return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
        });
      }

      setOutputJSON(formatted);
      setStats(calculateStats(formatted));
      
      addToHistory(formatted, 'Format');
    } catch (e) {
      console.error('Format error:', e);
    }
  };

  const minifyJSON = () => {
    if (!validateJSON(inputJSON)) return;

    try {
      const parsed = JSON.parse(inputJSON);
      const minified = JSON.stringify(parsed);
      
      setOutputJSON(minified);
      setStats(calculateStats(minified));
      
      addToHistory(minified, 'Minify');
    } catch (e) {
      console.error('Minify error:', e);
    }
  };

  const addToHistory = (json: string, action: string) => {
    setHistory(prev => [{
      json: json.substring(0, 200) + (json.length > 200 ? '...' : ''),
      timestamp: new Date().toLocaleString(language === 'id' ? 'id-ID' : 'en-US'),
      action
    }, ...prev.slice(0, 9)]);
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

  const downloadJSON = () => {
    if (!outputJSON) return;
    
    const blob = new Blob([outputJSON], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => {
    const sample = JSON.stringify(sampleJSON, null, 2);
    setInputJSON(sample);
    validateJSON(sample);
  };

  const clearAll = () => {
    setInputJSON('');
    setOutputJSON('');
    setIsValid(null);
    setErrorMessage('');
    setStats(null);
  };

  // Auto-validate on input change
  useEffect(() => {
    if (inputJSON) {
      validateJSON(inputJSON);
    }
  }, [inputJSON]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            <FileJson className="w-10 h-10" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        {/* Options Bar */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Indentation */}
            <div>
              <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                {t.indentation}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: '2' as IndentType, label: t.spaces2 },
                  { value: '4' as IndentType, label: t.spaces4 },
                  { value: 'tab' as IndentType, label: t.tabs }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setIndentType(option.value)}
                    className="px-2 py-1 rounded text-xs font-medium transition-all"
                    style={{
                      backgroundColor: indentType === option.value ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#252525' : '#e8e1ca'),
                      color: indentType === option.value ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a')
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sortKeys"
                  checked={sortKeys}
                  onChange={(e) => setSortKeys(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                />
                <label htmlFor="sortKeys" className="text-sm cursor-pointer" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  {t.sortKeys}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="escapeUnicode"
                  checked={escapeUnicode}
                  onChange={(e) => setEscapeUnicode(e.target.checked)}
                  className="w-4 h-4 rounded"
                  style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                />
                <label htmlFor="escapeUnicode" className="text-sm cursor-pointer" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  {t.escapeUnicode}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={formatJSON}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                  color: '#FEFAF3'
                }}
              >
                <Maximize2 className="w-4 h-4" />
                {t.format}
              </button>
              <button
                onClick={minifyJSON}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                  color: darkMode ? '#c4c4c4' : '#5a5a5a'
                }}
              >
                <Minimize2 className="w-4 h-4" />
                {t.minify}
              </button>
              <button
                onClick={loadSample}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                  color: darkMode ? '#c4c4c4' : '#5a5a5a'
                }}
              >
                {t.loadSample}
              </button>
              <button
                onClick={clearAll}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                style={{
                  backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                  color: darkMode ? '#c4c4c4' : '#5a5a5a'
                }}
              >
                <Trash2 className="w-4 h-4" />
                {t.clear}
              </button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <Card>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  <Code className="w-5 h-5" />
                  {t.input}
                </h2>
                {isValid !== null && (
                  <div className="flex items-center gap-2">
                    {isValid ? (
                      <>
                        <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                        <span className="text-sm font-medium" style={{ color: '#10b981' }}>
                          {t.valid}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                        <span className="text-sm font-medium" style={{ color: '#ef4444' }}>
                          {t.invalid}
                        </span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <textarea
                value={inputJSON}
                onChange={(e) => setInputJSON(e.target.value)}
                placeholder={t.placeholder}
                className="w-full h-96 p-4 rounded-lg border font-mono text-sm resize-none focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                  color: darkMode ? '#E6E6E6' : '#3A3A3A',
                  borderColor: isValid === false ? '#ef4444' : (darkMode ? '#2a2a2a' : '#ddd4b8')
                }}
                onFocus={(e) => isValid !== false && (e.target.style.borderColor = darkMode ? '#B6861F' : '#C9A227')}
                onBlur={(e) => isValid !== false && (e.target.style.borderColor = darkMode ? '#2a2a2a' : '#ddd4b8')}
              />

              {errorMessage && (
                <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    {errorMessage}
                  </p>
                </div>
              )}
            </Card>
          </div>

          {/* Output */}
          <div>
            <Card className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {t.output}
                </h2>
                {outputJSON && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(outputJSON)}
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? t.copied : t.copy}
                    </button>
                    <button
                      onClick={downloadJSON}
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                        color: '#FEFAF3'
                      }}
                    >
                      <Download className="w-4 h-4" />
                      {t.download}
                    </button>
                  </div>
                )}
              </div>

              <div
                className="w-full h-96 p-4 rounded-lg border font-mono text-sm overflow-auto"
                style={{
                  backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                  color: darkMode ? '#E6E6E6' : '#3A3A3A',
                  borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                }}
              >
                <pre className="whitespace-pre">{outputJSON || '// Output akan muncul di sini'}</pre>
              </div>
            </Card>

            {/* Statistics */}
            {stats && (
              <Card>
                <h3 className="font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {t.statistics}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: t.characters, value: stats.characters },
                    { label: t.lines, value: stats.lines },
                    { label: t.size, value: stats.size },
                    { label: t.keys, value: stats.keys },
                    { label: t.values, value: stats.values },
                    { label: t.objects, value: stats.objects },
                    { label: t.arrays, value: stats.arrays }
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
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <Card className="mt-6">
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
                    setInputJSON(item.json);
                    validateJSON(item.json);
                  }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs px-2 py-1 rounded" style={{
                      backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                      color: '#FEFAF3'
                    }}>
                      {item.action}
                    </span>
                    <span className="text-xs" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                      {item.timestamp}
                    </span>
                  </div>
                  <pre className="text-xs font-mono truncate" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                    {item.json}
                  </pre>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}