'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, Image as ImageIcon, Loader, X, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const content = {
  id: {
    title: "Background Remover",
    subtitle: "Hapus background gambar untuk PNG, TTD, Stiker WA, dll",
    upload: "Upload Gambar",
    dragDrop: "Drag & drop gambar di sini atau klik untuk browse",
    supportedFormats: "Format: JPG, PNG, WebP (Max 10MB)",
    processing: "Memproses...",
    original: "Asli",
    result: "Hasil",
    download: "Download PNG",
    remove: "Hapus",
    quality: "Kualitas",
    low: "Rendah (Cepat)",
    medium: "Sedang",
    high: "Tinggi (Lambat)",
    processImage: "Proses Gambar",
    noImage: "Belum ada gambar yang diupload",
    history: "Riwayat",
    noHistory: "Belum ada riwayat",
    clearHistory: "Clear",
    showComparison: "Tampilkan Perbandingan",
    hideComparison: "Sembunyikan Perbandingan",
    alertFileSize: "Ukuran file terlalu besar! Maksimal 10MB",
    alertFileType: "Format file tidak didukung! Gunakan JPG, PNG, atau WebP",
    processingTime: "Waktu proses",
    seconds: "detik",
    fileName: "Nama file"
  },
  en: {
    title: "Background Remover",
    subtitle: "Remove background from images for PNG, Signature, WA Stickers, etc",
    upload: "Upload Image",
    dragDrop: "Drag & drop image here or click to browse",
    supportedFormats: "Formats: JPG, PNG, WebP (Max 10MB)",
    processing: "Processing...",
    original: "Original",
    result: "Result",
    download: "Download PNG",
    remove: "Remove",
    quality: "Quality",
    low: "Low (Fast)",
    medium: "Medium",
    high: "High (Slow)",
    processImage: "Process Image",
    noImage: "No image uploaded yet",
    history: "History",
    noHistory: "No history yet",
    clearHistory: "Clear",
    showComparison: "Show Comparison",
    hideComparison: "Hide Comparison",
    alertFileSize: "File size too large! Maximum 10MB",
    alertFileType: "Unsupported file format! Use JPG, PNG, or WebP",
    processingTime: "Processing time",
    seconds: "seconds",
    fileName: "File name"
  }
};

type Quality = 'low' | 'medium' | 'high';

interface ProcessedImage {
  original: string;
  result: string;
  fileName: string;
  timestamp: string;
  processingTime: number;
}

export default function BackgroundRemoverPage() {
  const { darkMode, language } = useApp();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState<Quality>('medium');
  const [showComparison, setShowComparison] = useState(true);
  const [history, setHistory] = useState<ProcessedImage[]>([]);
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = content[language];

  const handleFileSelect = (file: File) => {
    // Validation
    if (file.size > 10 * 1024 * 1024) {
      alert(t.alertFileSize);
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert(t.alertFileType);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setFileName(file.name);
      setResultImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processImage = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    const startTime = Date.now();

    try {
      console.log('Starting background removal...');
      
      // Dynamically import the library (client-side only)
      const { removeBackground } = await import('@imgly/background-removal');
      console.log('Library loaded successfully');

      // Process with background removal - simplified config
      const config: any = {
        debug: true,
        progress: (key: string, current: number, total: number) => {
          console.log(`Loading ${key}: ${current} of ${total}`);
        }
      };

      // Quality settings
      if (quality === 'low') {
        config.model = 'small';
      } else if (quality === 'medium') {
        config.model = 'medium';
      } else {
        config.model = 'medium'; // Use medium instead of large for better compatibility
      }

      console.log('Processing with config:', config);

      // Convert base64 to blob first
      const response = await fetch(originalImage);
      const imageBlob = await response.blob();
      
      console.log('Image blob created, starting removal...');
      const resultBlob = await removeBackground(imageBlob, config);
      console.log('Background removed successfully');

      const url = URL.createObjectURL(resultBlob);

      const endTime = Date.now();
      const timeElapsed = ((endTime - startTime) / 1000).toFixed(1);

      setResultImage(url);
      setProcessingTime(parseFloat(timeElapsed));

      // Add to history
      setHistory(prev => [{
        original: originalImage,
        result: url,
        fileName,
        timestamp: new Date().toLocaleString(language === 'id' ? 'id-ID' : 'en-US'),
        processingTime: parseFloat(timeElapsed)
      }, ...prev.slice(0, 9)]);

      console.log('Process completed in', timeElapsed, 'seconds');

    } catch (error: any) {
      console.error('Detailed error:', error);
      console.error('Error stack:', error?.stack);
      console.error('Error message:', error?.message);
      
      let errorMessage = 'Error processing image. ';
      if (error?.message?.includes('fetch')) {
        errorMessage += 'Network error - check your internet connection.';
      } else if (error?.message?.includes('model')) {
        errorMessage += 'Model loading failed - try using "Low" quality setting.';
      } else {
        errorMessage += 'Please try again or use a different image.';
      }
      
      alert(errorMessage + '\n\nCheck browser console (F12) for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (imageUrl: string, name: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${name.replace(/\.[^/.]+$/, '')}-no-bg.png`;
    link.click();
  };

  const clearImage = () => {
    setOriginalImage(null);
    setResultImage(null);
    setFileName('');
    setProcessingTime(0);
  };

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            <ImageIcon className="w-10 h-10" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload & Settings */}
          <div>
            {/* Upload Area */}
            <Card className="mb-6">
              <h2 className="text-xl font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.upload}
              </h2>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
                style={{
                  borderColor: isDragging ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#2a2a2a' : '#ddd4b8'),
                  backgroundColor: isDragging ? (darkMode ? 'rgba(182, 134, 31, 0.1)' : 'rgba(201, 162, 39, 0.1)') : 'transparent'
                }}
              >
                <Upload className="w-12 h-12 mx-auto mb-4" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
                <p className="mb-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {t.dragDrop}
                </p>
                <p className="text-sm" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  {t.supportedFormats}
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />

              {fileName && (
                <div className="mt-4 p-3 rounded-lg flex items-center justify-between" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                  <span className="text-sm truncate" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                    📁 {fileName}
                  </span>
                  <button onClick={clearImage} className="ml-2">
                    <X className="w-4 h-4" style={{ color: darkMode ? '#808080' : '#8a8a8a' }} />
                  </button>
                </div>
              )}
            </Card>

            {/* Settings */}
            <Card className="mb-6">
              <h3 className="text-lg font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                {t.quality}
              </h3>

              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { value: 'low' as Quality, label: t.low },
                  { value: 'medium' as Quality, label: t.medium },
                  { value: 'high' as Quality, label: t.high }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setQuality(option.value)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: quality === option.value ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#252525' : '#e8e1ca'),
                      color: quality === option.value ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a')
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <button
                onClick={processImage}
                disabled={!originalImage || isProcessing}
                className="w-full px-6 py-3 rounded-lg font-semibold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{
                  backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                  color: '#FEFAF3'
                }}
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    {t.processing}
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-5 h-5" />
                    {t.processImage}
                  </>
                )}
              </button>

              {processingTime > 0 && (
                <p className="text-sm text-center mt-3" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  {t.processingTime}: {processingTime} {t.seconds}
                </p>
              )}
            </Card>

            {/* Preview Original */}
            {originalImage && (
              <Card>
                <h3 className="text-lg font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {t.original}
                </h3>
                <div className="rounded-lg overflow-hidden" style={{ 
                  backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                  backgroundImage: 'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                }}>
                  <img src={originalImage} alt="Original" className="w-full h-auto" />
                </div>
              </Card>
            )}
          </div>

          {/* Right Panel - Result */}
          <div>
            {resultImage ? (
              <>
                <Card className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                      {t.result}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowComparison(!showComparison)}
                        className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                        style={{
                          backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                          color: darkMode ? '#c4c4c4' : '#5a5a5a'
                        }}
                      >
                        {showComparison ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showComparison ? t.hideComparison : t.showComparison}
                      </button>
                      <button
                        onClick={() => downloadImage(resultImage, fileName)}
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
                  </div>

                  <div className="rounded-lg overflow-hidden" style={{ 
                    backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                    backgroundImage: 'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                  }}>
                    <img src={resultImage} alt="Result" className="w-full h-auto" />
                  </div>
                </Card>

                {/* Comparison */}
                {showComparison && originalImage && (
                  <Card>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                      {t.original} vs {t.result}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs mb-2 text-center" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.original}
                        </p>
                        <div className="rounded-lg overflow-hidden" style={{ 
                          backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                          backgroundImage: 'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                        }}>
                          <img src={originalImage} alt="Original small" className="w-full h-auto" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs mb-2 text-center" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.result}
                        </p>
                        <div className="rounded-lg overflow-hidden" style={{ 
                          backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                          backgroundImage: 'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px'
                        }}>
                          <img src={resultImage} alt="Result small" className="w-full h-auto" />
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <div className="text-center py-20" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  <ImageIcon className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p>{t.noImage}</p>
                </div>
              </Card>
            )}

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

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {history.map((item, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate mb-1" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                            {item.fileName}
                          </p>
                          <p className="text-xs mb-2" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                            {item.timestamp} • {item.processingTime}s
                          </p>
                          <div className="rounded overflow-hidden" style={{ 
                            backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                            backgroundImage: 'repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 10px 10px'
                          }}>
                            <img src={item.result} alt="History" className="w-full h-auto" />
                          </div>
                        </div>
                        <button
                          onClick={() => downloadImage(item.result, item.fileName)}
                          className="p-2 rounded-lg hover:opacity-70 transition-opacity"
                          style={{ backgroundColor: darkMode ? '#B6861F' : '#C9A227' }}
                        >
                          <Download className="w-4 h-4" style={{ color: '#FEFAF3' }} />
                        </button>
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