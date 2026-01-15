'use client';

import React, { useState, useRef } from 'react';
import { QrCode, Download, Copy, Check, Trash2, Wifi, Mail, Phone, User, Link as LinkIcon } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import QRCodeStyling from 'qrcode';

const content = {
  id: {
    title: "QR Code Generator",
    subtitle: "Buat QR Code untuk URL, Text, WiFi, vCard, dan lainnya",
    type: "Tipe QR Code",
    typeUrl: "URL / Link",
    typeText: "Text Biasa",
    typeWifi: "WiFi",
    typeVcard: "vCard (Kontak)",
    typeEmail: "Email",
    typePhone: "Telepon",
    content: "Konten",
    urlPlaceholder: "https://example.com",
    textPlaceholder: "Masukkan text yang ingin di-encode",
    wifiSSID: "Nama WiFi (SSID)",
    wifiPassword: "Password WiFi",
    wifiEncryption: "Enkripsi",
    vcardName: "Nama Lengkap",
    vcardPhone: "Nomor Telepon",
    vcardEmail: "Email",
    vcardOrg: "Organisasi/Perusahaan",
    emailAddress: "Alamat Email",
    emailSubject: "Subject (opsional)",
    emailBody: "Pesan (opsional)",
    phoneNumber: "Nomor Telepon",
    customization: "Kustomisasi",
    foregroundColor: "Warna QR",
    backgroundColor: "Warna Background",
    size: "Ukuran",
    errorCorrection: "Error Correction",
    low: "Rendah",
    medium: "Sedang",
    quartile: "Tinggi",
    high: "Sangat Tinggi",
    generate: "Generate QR Code",
    download: "Download PNG",
    downloadSVG: "Download SVG",
    copy: "Copy sebagai Image",
    copied: "Copied!",
    preview: "Preview QR Code",
    noQR: "QR Code akan muncul di sini",
    history: "Riwayat",
    noHistory: "Belum ada riwayat",
    clearHistory: "Clear",
    alertEmpty: "Konten tidak boleh kosong!",
    scanMe: "Scan saya!"
  },
  en: {
    title: "QR Code Generator",
    subtitle: "Create QR Code for URL, Text, WiFi, vCard, and more",
    type: "QR Code Type",
    typeUrl: "URL / Link",
    typeText: "Plain Text",
    typeWifi: "WiFi",
    typeVcard: "vCard (Contact)",
    typeEmail: "Email",
    typePhone: "Phone",
    content: "Content",
    urlPlaceholder: "https://example.com",
    textPlaceholder: "Enter text to encode",
    wifiSSID: "WiFi Name (SSID)",
    wifiPassword: "WiFi Password",
    wifiEncryption: "Encryption",
    vcardName: "Full Name",
    vcardPhone: "Phone Number",
    vcardEmail: "Email",
    vcardOrg: "Organization/Company",
    emailAddress: "Email Address",
    emailSubject: "Subject (optional)",
    emailBody: "Message (optional)",
    phoneNumber: "Phone Number",
    customization: "Customization",
    foregroundColor: "QR Color",
    backgroundColor: "Background Color",
    size: "Size",
    errorCorrection: "Error Correction",
    low: "Low",
    medium: "Medium",
    quartile: "High",
    high: "Very High",
    generate: "Generate QR Code",
    download: "Download PNG",
    downloadSVG: "Download SVG",
    copy: "Copy as Image",
    copied: "Copied!",
    preview: "QR Code Preview",
    noQR: "QR Code will appear here",
    history: "History",
    noHistory: "No history yet",
    clearHistory: "Clear",
    alertEmpty: "Content cannot be empty!",
    scanMe: "Scan me!"
  }
};

type QRType = 'url' | 'text' | 'wifi' | 'vcard' | 'email' | 'phone';
type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface QRHistory {
  type: QRType;
  content: string;
  dataUrl: string;
  timestamp: string;
}

export default function QRCodeGeneratorPage() {
  const { darkMode, language } = useApp();
  const [qrType, setQrType] = useState<QRType>('url');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Content fields
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [vcardName, setVcardName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardOrg, setVcardOrg] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Customization
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [size, setSize] = useState(300);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('M');
  
  const [history, setHistory] = useState<QRHistory[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const t = content[language];

  const getQRContent = (): string => {
    switch (qrType) {
      case 'url':
        return urlInput;
      case 'text':
        return textInput;
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};;`;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${vcardName}\nTEL:${vcardPhone}\nEMAIL:${vcardEmail}\nORG:${vcardOrg}\nEND:VCARD`;
      case 'email':
        return `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber}`;
      default:
        return '';
    }
  };

  const generateQR = async () => {
    const content = getQRContent();
    
    if (!content.trim()) {
      alert(t.alertEmpty);
      return;
    }

    try {
      const canvas = canvasRef.current;
      if (!canvas) return;

      await QRCodeStyling.toCanvas(canvas, content, {
        errorCorrectionLevel: errorCorrection,
        width: size,
        color: {
          dark: fgColor,
          light: bgColor
        },
        margin: 2
      });

      const dataUrl = canvas.toDataURL('image/png');
      setQrDataUrl(dataUrl);

      // Add to history
      setHistory(prev => [{
        type: qrType,
        content: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
        dataUrl,
        timestamp: new Date().toLocaleString(language === 'id' ? 'id-ID' : 'en-US')
      }, ...prev.slice(0, 9)]);

    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Error generating QR code. Please try again.');
    }
  };

  const downloadQR = (format: 'png' | 'svg' = 'png') => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode-${Date.now()}.${format}`;
    link.click();
  };

  const copyQR = async () => {
    if (!qrDataUrl) return;

    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      alert('Failed to copy. Try download instead.');
    }
  };

  const renderContentInputs = () => {
    const inputStyle = {
      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
      color: darkMode ? '#E6E6E6' : '#3A3A3A',
      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
    };

    switch (qrType) {
      case 'url':
        return (
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder={t.urlPlaceholder}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            style={inputStyle}
          />
        );
      
      case 'text':
        return (
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t.textPlaceholder}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
            style={inputStyle}
            rows={4}
          />
        );
      
      case 'wifi':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                {t.wifiSSID}
              </label>
              <input
                type="text"
                value={wifiSSID}
                onChange={(e) => setWifiSSID(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                {t.wifiPassword}
              </label>
              <input
                type="text"
                value={wifiPassword}
                onChange={(e) => setWifiPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                {t.wifiEncryption}
              </label>
              <select
                value={wifiEncryption}
                onChange={(e) => setWifiEncryption(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={inputStyle}
              >
                <option value="WPA">WPA/WPA2</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password</option>
              </select>
            </div>
          </div>
        );
      
      case 'vcard':
        return (
          <div className="space-y-4">
            <input
              type="text"
              value={vcardName}
              onChange={(e) => setVcardName(e.target.value)}
              placeholder={t.vcardName}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={inputStyle}
            />
            <input
              type="tel"
              value={vcardPhone}
              onChange={(e) => setVcardPhone(e.target.value)}
              placeholder={t.vcardPhone}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={inputStyle}
            />
            <input
              type="email"
              value={vcardEmail}
              onChange={(e) => setVcardEmail(e.target.value)}
              placeholder={t.vcardEmail}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={inputStyle}
            />
            <input
              type="text"
              value={vcardOrg}
              onChange={(e) => setVcardOrg(e.target.value)}
              placeholder={t.vcardOrg}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={inputStyle}
            />
          </div>
        );
      
      case 'email':
        return (
          <div className="space-y-4">
            <input
              type="email"
              value={emailAddress}
              onChange={(e) => setEmailAddress(e.target.value)}
              placeholder={t.emailAddress}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={inputStyle}
            />
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              placeholder={t.emailSubject}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
              style={inputStyle}
            />
            <textarea
              value={emailBody}
              onChange={(e) => setEmailBody(e.target.value)}
              placeholder={t.emailBody}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none"
              style={inputStyle}
              rows={3}
            />
          </div>
        );
      
      case 'phone':
        return (
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder={t.phoneNumber}
            className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
            style={inputStyle}
          />
        );
      
      default:
        return null;
    }
  };

  const qrTypes = [
    { value: 'url' as QRType, label: t.typeUrl, icon: LinkIcon },
    { value: 'text' as QRType, label: t.typeText, icon: QrCode },
    { value: 'wifi' as QRType, label: t.typeWifi, icon: Wifi },
    { value: 'vcard' as QRType, label: t.typeVcard, icon: User },
    { value: 'email' as QRType, label: t.typeEmail, icon: Mail },
    { value: 'phone' as QRType, label: t.typePhone, icon: Phone }
  ];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            <QrCode className="w-10 h-10" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div>
            {/* QR Type Selection */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.type}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {qrTypes.map(type => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setQrType(type.value)}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: qrType === type.value ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#252525' : '#e8e1ca'),
                        color: qrType === type.value ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a')
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Content Input */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.content}
              </h2>
              {renderContentInputs()}
            </Card>

            {/* Customization */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.customization}
              </h2>
              
              <div className="space-y-4">
                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                      {t.foregroundColor}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-12 h-10 rounded border cursor-pointer"
                        style={{ borderColor: darkMode ? '#2a2a2a' : '#ddd4b8' }}
                      />
                      <input
                        type="text"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border text-sm"
                        style={{
                          backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                          color: darkMode ? '#E6E6E6' : '#3A3A3A',
                          borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                      {t.backgroundColor}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-12 h-10 rounded border cursor-pointer"
                        style={{ borderColor: darkMode ? '#2a2a2a' : '#ddd4b8' }}
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-lg border text-sm"
                        style={{
                          backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                          color: darkMode ? '#E6E6E6' : '#3A3A3A',
                          borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Size */}
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                      {t.size}
                    </label>
                    <span className="text-sm font-medium" style={{ color: darkMode ? '#B6861F' : '#C9A227' }}>
                      {size}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="600"
                    step="50"
                    value={size}
                    onChange={(e) => setSize(parseInt(e.target.value))}
                    className="w-full"
                    style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                  />
                </div>

                {/* Error Correction */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.errorCorrection}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'L' as ErrorCorrectionLevel, label: t.low },
                      { value: 'M' as ErrorCorrectionLevel, label: t.medium },
                      { value: 'Q' as ErrorCorrectionLevel, label: t.quartile },
                      { value: 'H' as ErrorCorrectionLevel, label: t.high }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setErrorCorrection(option.value)}
                        className="px-2 py-1 rounded text-xs font-medium transition-all"
                        style={{
                          backgroundColor: errorCorrection === option.value ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#252525' : '#e8e1ca'),
                          color: errorCorrection === option.value ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a')
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={generateQR}
                className="w-full mt-6 px-6 py-3 rounded-lg font-semibold text-lg transition-all flex items-center justify-center gap-2"
                style={{
                  backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                  color: '#FEFAF3'
                }}
              >
                <QrCode className="w-5 h-5" />
                {t.generate}
              </button>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div>
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.preview}
              </h2>

              <div className="flex flex-col items-center">
                {qrDataUrl ? (
                  <>
                    <div className="mb-4 p-4 rounded-lg" style={{ backgroundColor: bgColor }}>
                      <img src={qrDataUrl} alt="QR Code" className="w-full max-w-sm" />
                    </div>
                    
                    <p className="text-sm mb-4" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                      {t.scanMe}
                    </p>

                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        onClick={() => downloadQR('png')}
                        className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                        style={{
                          backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                          color: '#FEFAF3'
                        }}
                      >
                        <Download className="w-4 h-4" />
                        {t.download}
                      </button>
                      
                      <button
                        onClick={copyQR}
                        className="px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
                        style={{
                          backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                          color: darkMode ? '#c4c4c4' : '#5a5a5a'
                        }}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? t.copied : t.copy}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-20" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                    <QrCode className="w-20 h-20 mx-auto mb-4 opacity-30" />
                    <p>{t.noQR}</p>
                  </div>
                )}
              </div>
            </Card>

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

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg flex gap-3 items-start"
                      style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}
                    >
                      <img src={item.dataUrl} alt="QR" className="w-16 h-16 rounded" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs mb-1" style={{ color: darkMode ? '#B6861F' : '#C9A227' }}>
                          {item.type.toUpperCase()}
                        </p>
                        <p className="text-sm truncate mb-1" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {item.content}
                        </p>
                        <p className="text-xs" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {item.timestamp}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = item.dataUrl;
                          link.download = `qrcode-${Date.now()}.png`;
                          link.click();
                        }}
                        className="p-2 rounded-lg hover:opacity-70 transition-opacity flex-shrink-0"
                      >
                        <Download className="w-4 h-4" style={{ color: darkMode ? '#808080' : '#8a8a8a' }} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for QR generation */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}