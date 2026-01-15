'use client';

import React, { useState } from 'react';
import { Copy, RotateCcw, Check, Shield, Key, Hash } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const content = {
  id: {
    title: "Password Generator",
    subtitle: "Generate password yang kuat dan aman",
    passwordLength: "Panjang Password",
    keyword: "Keyword Wajib",
    keywordPlaceholder: "Masukkan keyword yang harus ada (opsional)",
    options: "Opsi",
    uppercase: "Huruf Besar (A-Z)",
    lowercase: "Huruf Kecil (a-z)",
    numbers: "Angka (0-9)",
    symbols: "Simbol (!@#$%^&*)",
    salt: "Salt untuk Token",
    saltPlaceholder: "Masukkan salt (opsional)",
    generate: "Generate Password",
    generating: "Generating...",
    generatedPassword: "Password yang Dihasilkan",
    copy: "Copy",
    copied: "Copied!",
    strength: "Kekuatan",
    weak: "Lemah",
    medium: "Sedang",
    strong: "Kuat",
    veryStrong: "Sangat Kuat",
    history: "Riwayat",
    noHistory: "Belum ada riwayat",
    alertNoOptions: "Pilih minimal 1 opsi karakter!",
    alertKeywordTooLong: "Keyword terlalu panjang untuk panjang password yang dipilih!",
    withKeyword: "dengan keyword",
    withSalt: "dengan salt"
  },
  en: {
    title: "Password Generator",
    subtitle: "Generate strong and secure passwords",
    passwordLength: "Password Length",
    keyword: "Required Keyword",
    keywordPlaceholder: "Enter required keyword (optional)",
    options: "Options",
    uppercase: "Uppercase (A-Z)",
    lowercase: "Lowercase (a-z)",
    numbers: "Numbers (0-9)",
    symbols: "Symbols (!@#$%^&*)",
    salt: "Salt for Token",
    saltPlaceholder: "Enter salt (optional)",
    generate: "Generate Password",
    generating: "Generating...",
    generatedPassword: "Generated Password",
    copy: "Copy",
    copied: "Copied!",
    strength: "Strength",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    veryStrong: "Very Strong",
    history: "History",
    noHistory: "No history yet",
    alertNoOptions: "Select at least 1 character option!",
    alertKeywordTooLong: "Keyword is too long for selected password length!",
    withKeyword: "with keyword",
    withSalt: "with salt"
  }
};

const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

export default function PasswordGeneratorPage() {
  const { darkMode, language } = useApp();
  const [passwordLength, setPasswordLength] = useState(16);
  const [keyword, setKeyword] = useState('');
  const [salt, setSalt] = useState('');
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<Array<{ password: string; timestamp: string; meta: string }>>([]);

  const t = content[language];

  const calculateStrength = (password: string): { score: number; label: string; color: string } => {
    let score = 0;
    
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score, label: t.weak, color: darkMode ? '#ef4444' : '#dc2626' };
    if (score <= 4) return { score, label: t.medium, color: darkMode ? '#f59e0b' : '#d97706' };
    if (score <= 6) return { score, label: t.strong, color: darkMode ? '#10b981' : '#059669' };
    return { score, label: t.veryStrong, color: darkMode ? '#3b82f6' : '#2563eb' };
  };

  const generatePassword = () => {
    // Validation
    const hasAnyOption = Object.values(options).some(v => v);
    if (!hasAnyOption) {
      alert(t.alertNoOptions);
      return;
    }

    if (keyword && keyword.length > passwordLength) {
      alert(t.alertKeywordTooLong);
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      let charset = '';
      if (options.uppercase) charset += CHAR_SETS.uppercase;
      if (options.lowercase) charset += CHAR_SETS.lowercase;
      if (options.numbers) charset += CHAR_SETS.numbers;
      if (options.symbols) charset += CHAR_SETS.symbols;

      let password = '';
      const availableLength = passwordLength - keyword.length;

      // Generate random part
      for (let i = 0; i < availableLength; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }

      // Insert keyword at random position
      if (keyword) {
        const position = Math.floor(Math.random() * (password.length + 1));
        password = password.slice(0, position) + keyword + password.slice(position);
        password = password.slice(0, passwordLength); // Ensure exact length
      }

      // Apply salt if provided (simple hash simulation)
      if (salt) {
        const combined = password + salt;
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
          const char = combined.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        password = password + '-' + Math.abs(hash).toString(36).toUpperCase();
      }

      setGeneratedPassword(password);

      // Add to history
      const meta = [];
      if (keyword) meta.push(`${t.withKeyword}: "${keyword}"`);
      if (salt) meta.push(`${t.withSalt}: "${salt}"`);
      
      setHistory(prev => [{
        password,
        timestamp: new Date().toLocaleString(language === 'id' ? 'id-ID' : 'en-US'),
        meta: meta.join(', ')
      }, ...prev.slice(0, 9)]); // Keep last 10

      setIsGenerating(false);
    }, 300);
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

  const strength = generatedPassword ? calculateStrength(generatedPassword) : null;

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            <Key className="w-10 h-10" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Settings */}
          <div>
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-6" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.options}
              </h2>

              {/* Password Length */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.passwordLength}
                  </label>
                  <input
                    type="number"
                    min="4"
                    max="128"
                    value={passwordLength}
                    onChange={(e) => setPasswordLength(Math.min(128, Math.max(4, parseInt(e.target.value) || 4)))}
                    className="w-20 px-3 py-1 rounded-lg border text-center"
                    style={{
                      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                      color: darkMode ? '#E6E6E6' : '#3A3A3A',
                      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                    }}
                  />
                </div>
                <input
                  type="range"
                  min="4"
                  max="128"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full"
                  style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                />
              </div>

              {/* Keyword */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  {t.keyword}
                </label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={t.keywordPlaceholder}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#E6E6E6' : '#3A3A3A',
                    borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                  }}
                  onFocus={(e) => e.target.style.borderColor = darkMode ? '#B6861F' : '#C9A227'}
                  onBlur={(e) => e.target.style.borderColor = darkMode ? '#2a2a2a' : '#ddd4b8'}
                />
              </div>

              {/* Character Options */}
              <div className="space-y-3 mb-6">
                {[
                  { key: 'uppercase', label: t.uppercase },
                  { key: 'lowercase', label: t.lowercase },
                  { key: 'numbers', label: t.numbers },
                  { key: 'symbols', label: t.symbols }
                ].map(option => (
                  <div key={option.key} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={option.key}
                      checked={options[option.key as keyof typeof options]}
                      onChange={(e) => setOptions({ ...options, [option.key]: e.target.checked })}
                      className="w-4 h-4 rounded"
                      style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                    />
                    <label htmlFor={option.key} className="text-sm cursor-pointer" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>

              {/* Salt */}
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 flex items-center gap-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                  <Hash className="w-4 h-4" />
                  {t.salt}
                </label>
                <input
                  type="text"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  placeholder={t.saltPlaceholder}
                  className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                  style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#E6E6E6' : '#3A3A3A',
                    borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                  }}
                  onFocus={(e) => e.target.style.borderColor = darkMode ? '#B6861F' : '#C9A227'}
                  onBlur={(e) => e.target.style.borderColor = darkMode ? '#2a2a2a' : '#ddd4b8'}
                />
                <p className="text-xs mt-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  Salt akan ditambahkan sebagai hash di akhir password
                </p>
              </div>

              <button
                onClick={generatePassword}
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

          {/* Right Panel - Result */}
          <div>
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.generatedPassword}
              </h2>

              {generatedPassword ? (
                <>
                  <div className="p-4 rounded-lg mb-4 break-all font-mono text-lg" style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#B6861F' : '#C9A227',
                    border: `2px solid ${darkMode ? '#2a2a2a' : '#ddd4b8'}`
                  }}>
                    {generatedPassword}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => copyToClipboard(generatedPassword)}
                      className="flex-1 px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? t.copied : t.copy}
                    </button>
                  </div>

                  {/* Strength Indicator */}
                  {strength && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm flex items-center gap-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                          <Shield className="w-4 h-4" />
                          {t.strength}:
                        </span>
                        <span className="text-sm font-bold" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(strength.score / 7) * 100}%`,
                            backgroundColor: strength.color
                          }}
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  <Key className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p>Klik tombol generate untuk membuat password</p>
                </div>
              )}
            </Card>

            {/* History */}
            {history.length > 0 && (
              <Card>
                <h3 className="font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {t.history} ({history.length})
                </h3>

                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}
                    >
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <code className="text-sm font-mono break-all flex-1" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {item.password}
                        </code>
                        <button
                          onClick={() => copyToClipboard(item.password)}
                          className="p-1 rounded hover:opacity-70 transition-opacity flex-shrink-0"
                        >
                          <Copy className="w-4 h-4" style={{ color: darkMode ? '#808080' : '#8a8a8a' }} />
                        </button>
                      </div>
                      <div className="text-xs" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                        {item.timestamp}
                        {item.meta && <span className="ml-2">• {item.meta}</span>}
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