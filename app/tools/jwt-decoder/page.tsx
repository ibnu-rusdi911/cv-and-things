'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Copy, Check, AlertCircle, CheckCircle, Clock, Key, FileText } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const content = {
  id: {
    title: "JWT Decoder",
    subtitle: "Decode dan analisis JSON Web Token (JWT)",
    input: "JWT Token",
    placeholder: "Paste JWT token di sini...\nContoh: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    decode: "Decode",
    clear: "Clear",
    header: "Header",
    payload: "Payload",
    signature: "Signature",
    copy: "Copy",
    copied: "Copied!",
    invalid: "Token tidak valid",
    valid: "Token valid",
    algorithm: "Algorithm",
    type: "Type",
    issued: "Issued At",
    expires: "Expires At",
    notBefore: "Not Before",
    issuer: "Issuer",
    subject: "Subject",
    audience: "Audience",
    tokenStatus: "Status Token",
    expired: "Expired",
    active: "Active",
    notYetValid: "Not Yet Valid",
    expiresIn: "Expires in",
    days: "hari",
    hours: "jam",
    minutes: "menit",
    seconds: "detik",
    ago: "yang lalu",
    loadSample: "Load Sample",
    verify: "Verify Signature",
    secret: "Secret Key",
    secretPlaceholder: "Masukkan secret key (opsional)",
    signatureValid: "Signature valid!",
    signatureInvalid: "Signature invalid!",
    cannotVerify: "Tidak bisa verify (butuh secret key)",
    claims: "Claims",
    customClaims: "Custom Claims",
    rawToken: "Raw Token"
  },
  en: {
    title: "JWT Decoder",
    subtitle: "Decode and analyze JSON Web Token (JWT)",
    input: "JWT Token",
    placeholder: "Paste JWT token here...\nExample: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    decode: "Decode",
    clear: "Clear",
    header: "Header",
    payload: "Payload",
    signature: "Signature",
    copy: "Copy",
    copied: "Copied!",
    invalid: "Invalid token",
    valid: "Valid token",
    algorithm: "Algorithm",
    type: "Type",
    issued: "Issued At",
    expires: "Expires At",
    notBefore: "Not Before",
    issuer: "Issuer",
    subject: "Subject",
    audience: "Audience",
    tokenStatus: "Token Status",
    expired: "Expired",
    active: "Active",
    notYetValid: "Not Yet Valid",
    expiresIn: "Expires in",
    days: "days",
    hours: "hours",
    minutes: "minutes",
    seconds: "seconds",
    ago: "ago",
    loadSample: "Load Sample",
    verify: "Verify Signature",
    secret: "Secret Key",
    secretPlaceholder: "Enter secret key (optional)",
    signatureValid: "Signature valid!",
    signatureInvalid: "Signature invalid!",
    cannotVerify: "Cannot verify (needs secret key)",
    claims: "Claims",
    customClaims: "Custom Claims",
    rawToken: "Raw Token"
  }
};

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
  error?: string;
}

export default function JWTDecoderPage() {
  const { darkMode, language } = useApp();
  const [jwtToken, setJwtToken] = useState('');
  const [decoded, setDecoded] = useState<DecodedJWT | null>(null);
  const [copiedSection, setCopiedSection] = useState<string>('');
  const [secretKey, setSecretKey] = useState('');
  const [signatureStatus, setSignatureStatus] = useState<'valid' | 'invalid' | 'unknown'>('unknown');

  const t = content[language];

  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjIsImlzcyI6ImV4YW1wbGUuY29tIiwiYXVkIjoidXNlcnMifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  const base64UrlDecode = (str: string): string => {
    try {
      // Replace URL-safe characters
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding
      while (base64.length % 4) {
        base64 += '=';
      }
      // Decode base64
      const decoded = atob(base64);
      // Decode URI component
      return decodeURIComponent(decoded.split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      return str;
    }
  };

  const decodeJWT = (token: string): DecodedJWT | null => {
    try {
      const parts = token.trim().split('.');
      
      if (parts.length !== 3) {
        return {
          header: {},
          payload: {},
          signature: '',
          isValid: false,
          error: 'Invalid JWT format. Token must have 3 parts separated by dots.'
        };
      }

      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      const signature = parts[2];

      return {
        header,
        payload,
        signature,
        isValid: true
      };
    } catch (error: any) {
      return {
        header: {},
        payload: {},
        signature: '',
        isValid: false,
        error: error.message || 'Failed to decode token'
      };
    }
  };

  const handleDecode = () => {
    if (!jwtToken.trim()) return;
    const result = decodeJWT(jwtToken);
    setDecoded(result);
    setSignatureStatus('unknown');
  };

  const verifySignature = async () => {
    if (!decoded || !secretKey) return;

    try {
      // Split token
      const parts = jwtToken.trim().split('.');
      const header = parts[0];
      const payload = parts[1];
      const signature = parts[2];

      // Create signing input
      const signingInput = `${header}.${payload}`;

      // Import secret key
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secretKey);
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      // Sign
      const signatureArrayBuffer = await crypto.subtle.sign(
        'HMAC',
        cryptoKey,
        encoder.encode(signingInput)
      );

      // Convert to base64url
      const signatureArray = Array.from(new Uint8Array(signatureArrayBuffer));
      const signatureBase64 = btoa(String.fromCharCode(...signatureArray));
      const signatureBase64Url = signatureBase64
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');

      // Compare
      setSignatureStatus(signatureBase64Url === signature ? 'valid' : 'invalid');
    } catch (error) {
      console.error('Signature verification error:', error);
      setSignatureStatus('invalid');
    }
  };

  useEffect(() => {
    if (jwtToken) {
      handleDecode();
    } else {
      setDecoded(null);
    }
  }, [jwtToken]);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString(language === 'id' ? 'id-ID' : 'en-US');
  };

  const getTimeRemaining = (exp: number): string => {
    const now = Math.floor(Date.now() / 1000);
    const diff = exp - now;
    
    if (diff < 0) {
      const absDiff = Math.abs(diff);
      const days = Math.floor(absDiff / 86400);
      const hours = Math.floor((absDiff % 86400) / 3600);
      const minutes = Math.floor((absDiff % 3600) / 60);
      
      if (days > 0) return `${days} ${t.days} ${t.ago}`;
      if (hours > 0) return `${hours} ${t.hours} ${t.ago}`;
      return `${minutes} ${t.minutes} ${t.ago}`;
    }
    
    const days = Math.floor(diff / 86400);
    const hours = Math.floor((diff % 86400) / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    
    if (days > 0) return `${days} ${t.days}`;
    if (hours > 0) return `${hours} ${t.hours}`;
    return `${minutes} ${t.minutes}`;
  };

  const getTokenStatus = () => {
    if (!decoded?.payload) return null;
    
    const now = Math.floor(Date.now() / 1000);
    const exp = decoded.payload.exp;
    const nbf = decoded.payload.nbf;
    
    if (exp && now > exp) {
      return { status: 'expired', color: '#ef4444', label: t.expired };
    }
    
    if (nbf && now < nbf) {
      return { status: 'notyet', color: '#f59e0b', label: t.notYetValid };
    }
    
    return { status: 'active', color: '#10b981', label: t.active };
  };

  const renderJSONPretty = (obj: any) => {
    return (
      <pre className="text-sm font-mono whitespace-pre-wrap break-all">
        {JSON.stringify(obj, null, 2)}
      </pre>
    );
  };

  const status = getTokenStatus();
  const standardClaims = ['iss', 'sub', 'aud', 'exp', 'nbf', 'iat', 'jti'];
  const customClaims = decoded?.payload ? Object.keys(decoded.payload).filter(key => !standardClaims.includes(key)) : [];

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            <Shield className="w-10 h-10" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
            {t.title}
          </h1>
          <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div>
            <Card className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  {t.input}
                </h2>
                <button
                  onClick={() => setJwtToken(sampleToken)}
                  className="px-3 py-1 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                    color: darkMode ? '#c4c4c4' : '#5a5a5a'
                  }}
                >
                  {t.loadSample}
                </button>
              </div>

              <textarea
                value={jwtToken}
                onChange={(e) => setJwtToken(e.target.value)}
                placeholder={t.placeholder}
                className="w-full h-64 p-4 rounded-lg border font-mono text-sm resize-none focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                  color: darkMode ? '#E6E6E6' : '#3A3A3A',
                  borderColor: decoded?.isValid === false ? '#ef4444' : (darkMode ? '#2a2a2a' : '#ddd4b8')
                }}
                onFocus={(e) => decoded?.isValid !== false && (e.target.style.borderColor = darkMode ? '#B6861F' : '#C9A227')}
                onBlur={(e) => decoded?.isValid !== false && (e.target.style.borderColor = darkMode ? '#2a2a2a' : '#ddd4b8')}
              />

              {decoded?.error && (
                <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }} />
                  <p className="text-sm" style={{ color: '#ef4444' }}>
                    {decoded.error}
                  </p>
                </div>
              )}
            </Card>

            {/* Signature Verification */}
            {decoded?.isValid && (
              <Card>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  <Key className="w-5 h-5" />
                  {t.verify}
                </h3>

                <div className="mb-4">
                  <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.secret}
                  </label>
                  <input
                    type="text"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    placeholder={t.secretPlaceholder}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                      color: darkMode ? '#E6E6E6' : '#3A3A3A',
                      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                    }}
                  />
                </div>

                <button
                  onClick={verifySignature}
                  disabled={!secretKey}
                  className="w-full px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                    color: '#FEFAF3'
                  }}
                >
                  <Shield className="w-4 h-4" />
                  {t.verify}
                </button>

                {signatureStatus !== 'unknown' && (
                  <div className="mt-4 p-3 rounded-lg flex items-center gap-2" style={{
                    backgroundColor: signatureStatus === 'valid' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                  }}>
                    {signatureStatus === 'valid' ? (
                      <>
                        <CheckCircle className="w-5 h-5" style={{ color: '#10b981' }} />
                        <span style={{ color: '#10b981' }}>{t.signatureValid}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" style={{ color: '#ef4444' }} />
                        <span style={{ color: '#ef4444' }}>{t.signatureInvalid}</span>
                      </>
                    )}
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Output Panel */}
          <div>
            {decoded?.isValid ? (
              <>
                {/* Token Status */}
                {status && (
                  <Card className="mb-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                        <Clock className="w-5 h-5" />
                        {t.tokenStatus}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                        <span className="font-medium" style={{ color: status.color }}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {decoded.payload.exp && (
                      <div className="mt-4 text-sm" style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>
                        {status.status === 'active' && (
                          <p>{t.expiresIn}: <strong>{getTimeRemaining(decoded.payload.exp)}</strong></p>
                        )}
                        {status.status === 'expired' && (
                          <p>{t.expired} {getTimeRemaining(decoded.payload.exp)}</p>
                        )}
                      </div>
                    )}
                  </Card>
                )}

                {/* Header */}
                <Card className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                      {t.header}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(decoded.header, null, 2), 'header')}
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      {copiedSection === 'header' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedSection === 'header' ? t.copied : t.copy}
                    </button>
                  </div>
                  <div className="p-4 rounded-lg overflow-auto" style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#E6E6E6' : '#3A3A3A'
                  }}>
                    {renderJSONPretty(decoded.header)}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                      <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                        {t.algorithm}
                      </div>
                      <div className="font-medium" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                        {decoded.header.alg || '-'}
                      </div>
                    </div>
                    <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                      <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                        {t.type}
                      </div>
                      <div className="font-medium" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                        {decoded.header.typ || '-'}
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Payload - Standard Claims */}
                <Card className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                      {t.payload}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(decoded.payload, null, 2), 'payload')}
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      {copiedSection === 'payload' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedSection === 'payload' ? t.copied : t.copy}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {decoded.payload.iss && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                        <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.issuer} (iss)
                        </div>
                        <div className="font-medium break-all" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {decoded.payload.iss}
                        </div>
                      </div>
                    )}

                    {decoded.payload.sub && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                        <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.subject} (sub)
                        </div>
                        <div className="font-medium break-all" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {decoded.payload.sub}
                        </div>
                      </div>
                    )}

                    {decoded.payload.aud && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                        <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.audience} (aud)
                        </div>
                        <div className="font-medium break-all" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {Array.isArray(decoded.payload.aud) ? decoded.payload.aud.join(', ') : decoded.payload.aud}
                        </div>
                      </div>
                    )}

                    {decoded.payload.iat && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                        <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.issued} (iat)
                        </div>
                        <div className="font-medium" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {formatTimestamp(decoded.payload.iat)}
                        </div>
                      </div>
                    )}

                    {decoded.payload.exp && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                        <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.expires} (exp)
                        </div>
                        <div className="font-medium" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {formatTimestamp(decoded.payload.exp)}
                        </div>
                      </div>
                    )}

                    {decoded.payload.nbf && (
                      <div className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                        <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                          {t.notBefore} (nbf)
                        </div>
                        <div className="font-medium" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                          {formatTimestamp(decoded.payload.nbf)}
                        </div>
                      </div>
                    )}

                    {customClaims.length > 0 && (
                      <>
                        <div className="pt-4 border-t" style={{ borderColor: darkMode ? '#2a2a2a' : '#ddd4b8' }}>
                          <h4 className="text-sm font-semibold mb-3" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                            {t.customClaims}
                          </h4>
                        </div>
                        {customClaims.map(claim => (
                          <div key={claim} className="p-3 rounded-lg" style={{ backgroundColor: darkMode ? '#252525' : '#e8e1ca' }}>
                            <div className="text-xs mb-1" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                              {claim}
                            </div>
                            <div className="font-medium break-all" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                              {typeof decoded.payload[claim] === 'object' 
                                ? JSON.stringify(decoded.payload[claim]) 
                                : String(decoded.payload[claim])}
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </Card>

                {/* Signature */}
                <Card>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                      {t.signature}
                    </h3>
                    <button
                      onClick={() => copyToClipboard(decoded.signature, 'signature')}
                      className="px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      {copiedSection === 'signature' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copiedSection === 'signature' ? t.copied : t.copy}
                    </button>
                  </div>
                  <div className="p-4 rounded-lg overflow-auto font-mono text-sm break-all" style={{
                    backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                    color: darkMode ? '#E6E6E6' : '#3A3A3A'
                  }}>
                    {decoded.signature}
                  </div>
                </Card>
              </>
            ) : (
              <Card>
                <div className="text-center py-20" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                  <FileText className="w-20 h-20 mx-auto mb-4 opacity-30" />
                  <p>Paste JWT token untuk melihat hasilnya</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}