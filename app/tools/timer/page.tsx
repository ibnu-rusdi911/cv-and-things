'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Maximize, Minimize, Clock, Bell, Volume2, VolumeX, Settings } from 'lucide-react';
import { useApp } from '@/lib/contexts/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const content = {
  id: {
    title: "Timer & Countdown",
    subtitle: "Pomodoro Timer, Countdown, dan Stopwatch dengan fullscreen",
    mode: "Mode",
    pomodoro: "Pomodoro",
    countdown: "Countdown",
    stopwatch: "Stopwatch",
    settings: "Pengaturan",
    timerTitle: "Judul Timer",
    titlePlaceholder: "Contoh: Fokus Kerja, Meeting, Belajar",
    logo: "Logo/Emoji",
    logoPlaceholder: "🍅",
    workDuration: "Durasi Kerja",
    breakDuration: "Durasi Istirahat",
    minutes: "Menit",
    hours: "Jam",
    countdownTime: "Waktu Countdown",
    enableSound: "Aktifkan Suara",
    autoStartBreak: "Auto Start Break",
    start: "Mulai",
    pause: "Pause",
    resume: "Lanjut",
    reset: "Reset",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit Fullscreen",
    work: "Kerja",
    break: "Istirahat",
    session: "Sesi",
    timeUp: "Waktu Habis!",
    breakTime: "Waktunya Istirahat!",
    backToWork: "Kembali Bekerja!",
    presets: "Preset",
    classic: "Klasik (25/5)",
    extended: "Extended (50/10)",
    short: "Pendek (15/3)"
  },
  en: {
    title: "Timer & Countdown",
    subtitle: "Pomodoro Timer, Countdown, and Stopwatch with fullscreen",
    mode: "Mode",
    pomodoro: "Pomodoro",
    countdown: "Countdown",
    stopwatch: "Stopwatch",
    settings: "Settings",
    timerTitle: "Timer Title",
    titlePlaceholder: "Example: Focus Work, Meeting, Study",
    logo: "Logo/Emoji",
    logoPlaceholder: "🍅",
    workDuration: "Work Duration",
    breakDuration: "Break Duration",
    minutes: "Minutes",
    hours: "Hours",
    countdownTime: "Countdown Time",
    enableSound: "Enable Sound",
    autoStartBreak: "Auto Start Break",
    start: "Start",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    fullscreen: "Fullscreen",
    exitFullscreen: "Exit Fullscreen",
    work: "Work",
    break: "Break",
    session: "Session",
    timeUp: "Time's Up!",
    breakTime: "Break Time!",
    backToWork: "Back to Work!",
    presets: "Presets",
    classic: "Classic (25/5)",
    extended: "Extended (50/10)",
    short: "Short (15/3)"
  }
};

type TimerMode = 'pomodoro' | 'countdown' | 'stopwatch';
type PomodoroPhase = 'work' | 'break';

export default function TimerPage() {
  const { darkMode, language } = useApp();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [isRunning, setIsRunning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Settings
  const [timerTitle, setTimerTitle] = useState('Focus Time');
  const [logo, setLogo] = useState('🍅');
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [countdownHours, setCountdownHours] = useState(0);
  const [countdownMinutes, setCountdownMinutes] = useState(10);
  const [enableSound, setEnableSound] = useState(true);
  const [autoStartBreak, setAutoStartBreak] = useState(false);
  
  // Timer states
  const [timeLeft, setTimeLeft] = useState(25 * 60); // seconds
  const [pomodoroPhase, setPomodoroPhase] = useState<PomodoroPhase>('work');
  const [sessionCount, setSessionCount] = useState(0);
  const [stopwatchTime, setStopwatchTime] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const t = content[language];

  useEffect(() => {
    // Create audio element for notification
    audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGN0fPTgjMGHm7A7+OZSA0PVqvn77BZFgxBpuLyvmkiCDKJ0vPNeTMGHmzB8N+USQ0OVrDn77NbFQtFo+HyvmkkCDKI0fPOejUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQtFo+LyvmklCDKI0fPNeTUHHWy+8N+WTA0OVrDo77RbFQ==');
  }, []);

  useEffect(() => {
    if (mode === 'pomodoro') {
      setTimeLeft(workDuration * 60);
      setPomodoroPhase('work');
    } else if (mode === 'countdown') {
      setTimeLeft((countdownHours * 60 + countdownMinutes) * 60);
    } else {
      setStopwatchTime(0);
    }
  }, [mode, workDuration, breakDuration, countdownHours, countdownMinutes]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setStopwatchTime(prev => prev + 1);
        } else {
          setTimeLeft(prev => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (enableSound && audioRef.current) {
      audioRef.current.play();
    }

    if (mode === 'pomodoro') {
      if (pomodoroPhase === 'work') {
        setSessionCount(prev => prev + 1);
        setPomodoroPhase('break');
        setTimeLeft(breakDuration * 60);
        
        if (autoStartBreak) {
          setTimeout(() => setIsRunning(true), 1000);
        }
      } else {
        setPomodoroPhase('work');
        setTimeLeft(workDuration * 60);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDisplayTime = (): string => {
    if (mode === 'stopwatch') {
      return formatTime(stopwatchTime);
    }
    return formatTime(timeLeft);
  };

  const getProgress = (): number => {
    if (mode === 'stopwatch') return 0;
    
    const total = mode === 'pomodoro' 
      ? (pomodoroPhase === 'work' ? workDuration : breakDuration) * 60
      : (countdownHours * 60 + countdownMinutes) * 60;
    
    return ((total - timeLeft) / total) * 100;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      setTimeLeft(workDuration * 60);
      setPomodoroPhase('work');
      setSessionCount(0);
    } else if (mode === 'countdown') {
      setTimeLeft((countdownHours * 60 + countdownMinutes) * 60);
    } else {
      setStopwatchTime(0);
    }
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const applyPreset = (work: number, brk: number) => {
    setWorkDuration(work);
    setBreakDuration(brk);
    setTimeLeft(work * 60);
    setPomodoroPhase('work');
  };

  const circleRadius = 120;
  const circleCircumference = 2 * Math.PI * circleRadius;
  const circleProgress = circleCircumference - (getProgress() / 100) * circleCircumference;

  return (
    <div 
      className={`min-h-screen transition-colors duration-300 ${isFullscreen ? 'flex items-center justify-center' : ''}`}
      style={{ backgroundColor: darkMode ? '#101010' : '#FEFAF3' }}
    >
      {!isFullscreen ? (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center gap-3" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
              <Clock className="w-10 h-10" style={{ color: darkMode ? '#B6861F' : '#C9A227' }} />
              {t.title}
            </h1>
            <p style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>{t.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings Panel */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                  <Settings className="w-5 h-5" />
                  {t.settings}
                </h2>

                {/* Mode Selection */}
                <div className="mb-6">
                  <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.mode}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'pomodoro' as TimerMode, label: t.pomodoro },
                      { value: 'countdown' as TimerMode, label: t.countdown },
                      { value: 'stopwatch' as TimerMode, label: t.stopwatch }
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setMode(option.value);
                          setIsRunning(false);
                        }}
                        className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          backgroundColor: mode === option.value ? (darkMode ? '#B6861F' : '#C9A227') : (darkMode ? '#252525' : '#e8e1ca'),
                          color: mode === option.value ? '#FEFAF3' : (darkMode ? '#c4c4c4' : '#5a5a5a')
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.timerTitle}
                  </label>
                  <input
                    type="text"
                    value={timerTitle}
                    onChange={(e) => setTimerTitle(e.target.value)}
                    placeholder={t.titlePlaceholder}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                      color: darkMode ? '#E6E6E6' : '#3A3A3A',
                      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                    }}
                  />
                </div>

                {/* Logo */}
                <div className="mb-6">
                  <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {t.logo}
                  </label>
                  <input
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder={t.logoPlaceholder}
                    className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 text-center text-4xl"
                    style={{
                      backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                      color: darkMode ? '#E6E6E6' : '#3A3A3A',
                      borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                    }}
                    maxLength={2}
                  />
                </div>

                {/* Pomodoro Settings */}
                {mode === 'pomodoro' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                        {t.presets}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => applyPreset(25, 5)}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                            color: darkMode ? '#c4c4c4' : '#5a5a5a'
                          }}
                        >
                          {t.classic}
                        </button>
                        <button
                          onClick={() => applyPreset(50, 10)}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                            color: darkMode ? '#c4c4c4' : '#5a5a5a'
                          }}
                        >
                          {t.extended}
                        </button>
                        <button
                          onClick={() => applyPreset(15, 3)}
                          className="px-2 py-1 rounded text-xs"
                          style={{
                            backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                            color: darkMode ? '#c4c4c4' : '#5a5a5a'
                          }}
                        >
                          {t.short}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                          {t.workDuration}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="120"
                            value={workDuration}
                            onChange={(e) => setWorkDuration(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{
                              backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                              color: darkMode ? '#E6E6E6' : '#3A3A3A',
                              borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                            }}
                          />
                          <span className="text-sm" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                            {t.minutes}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                          {t.breakDuration}
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={breakDuration}
                            onChange={(e) => setBreakDuration(parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 rounded-lg border"
                            style={{
                              backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                              color: darkMode ? '#E6E6E6' : '#3A3A3A',
                              borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                            }}
                          />
                          <span className="text-sm" style={{ color: darkMode ? '#808080' : '#8a8a8a' }}>
                            {t.minutes}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <input
                        type="checkbox"
                        id="autoStartBreak"
                        checked={autoStartBreak}
                        onChange={(e) => setAutoStartBreak(e.target.checked)}
                        className="w-4 h-4 rounded"
                        style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                      />
                      <label htmlFor="autoStartBreak" className="text-sm cursor-pointer" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                        {t.autoStartBreak}
                      </label>
                    </div>
                  </>
                )}

                {/* Countdown Settings */}
                {mode === 'countdown' && (
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                        {t.hours}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="23"
                        value={countdownHours}
                        onChange={(e) => setCountdownHours(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                          color: darkMode ? '#E6E6E6' : '#3A3A3A',
                          borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                        }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                        {t.minutes}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        value={countdownMinutes}
                        onChange={(e) => setCountdownMinutes(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{
                          backgroundColor: darkMode ? '#101010' : '#FEFAF3',
                          color: darkMode ? '#E6E6E6' : '#3A3A3A',
                          borderColor: darkMode ? '#2a2a2a' : '#ddd4b8'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Sound Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enableSound"
                    checked={enableSound}
                    onChange={(e) => setEnableSound(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: darkMode ? '#B6861F' : '#C9A227' }}
                  />
                  <label htmlFor="enableSound" className="text-sm cursor-pointer flex items-center gap-2" style={{ color: darkMode ? '#c4c4c4' : '#5a5a5a' }}>
                    {enableSound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    {t.enableSound}
                  </label>
                </div>
              </Card>
            </div>

            {/* Timer Display */}
            <div className="lg:col-span-2">
              <Card>
                <div className="flex flex-col items-center justify-center py-12">
                  {/* Logo */}
                  <div className="text-8xl mb-6">{logo}</div>

                  {/* Title */}
                  <h2 className="text-3xl font-bold mb-4" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                    {timerTitle}
                  </h2>

                  {/* Phase Indicator (Pomodoro) */}
                  {mode === 'pomodoro' && (
                    <div className="mb-4 px-4 py-2 rounded-full" style={{
                      backgroundColor: pomodoroPhase === 'work' 
                        ? (darkMode ? 'rgba(182, 134, 31, 0.2)' : 'rgba(201, 162, 39, 0.2)')
                        : (darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)'),
                      color: pomodoroPhase === 'work' 
                        ? (darkMode ? '#B6861F' : '#C9A227')
                        : (darkMode ? '#10b981' : '#059669')
                    }}>
                      {pomodoroPhase === 'work' ? `💼 ${t.work}` : `☕ ${t.break}`}
                    </div>
                  )}

                  {/* Circular Progress */}
                  <div className="relative mb-8">
                    <svg width="300" height="300" className="transform -rotate-90">
                      <circle
                        cx="150"
                        cy="150"
                        r={circleRadius}
                        stroke={darkMode ? '#252525' : '#e8e1ca'}
                        strokeWidth="12"
                        fill="none"
                      />
                      <circle
                        cx="150"
                        cy="150"
                        r={circleRadius}
                        stroke={darkMode ? '#B6861F' : '#C9A227'}
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={circleCircumference}
                        strokeDashoffset={circleProgress}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-6xl font-bold font-mono" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
                        {getDisplayTime()}
                      </div>
                    </div>
                  </div>

                  {/* Session Count (Pomodoro) */}
                  {mode === 'pomodoro' && sessionCount > 0 && (
                    <div className="mb-6 text-lg" style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>
                      {t.session}: {sessionCount}
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleStartPause}
                      className="px-8 py-4 rounded-lg font-semibold text-lg transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                        color: '#FEFAF3'
                      }}
                    >
                      {isRunning ? (
                        <>
                          <Pause className="w-6 h-6" />
                          {t.pause}
                        </>
                      ) : (
                        <>
                          <Play className="w-6 h-6" />
                          {t.start}
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleReset}
                      className="px-6 py-4 rounded-lg font-semibold text-lg transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      <RotateCcw className="w-6 h-6" />
                      {t.reset}
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="px-6 py-4 rounded-lg font-semibold text-lg transition-all flex items-center gap-2"
                      style={{
                        backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                        color: darkMode ? '#c4c4c4' : '#5a5a5a'
                      }}
                    >
                      <Maximize className="w-6 h-6" />
                      {t.fullscreen}
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        /* Fullscreen Mode */
        <div className="w-full h-full flex flex-col items-center justify-center p-12">
          <div className="text-9xl mb-8">{logo}</div>
          <h1 className="text-6xl font-bold mb-8" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            {timerTitle}
          </h1>
          
          {mode === 'pomodoro' && (
            <div className="mb-8 px-8 py-4 rounded-full text-3xl font-bold" style={{
              backgroundColor: pomodoroPhase === 'work' 
                ? (darkMode ? 'rgba(182, 134, 31, 0.2)' : 'rgba(201, 162, 39, 0.2)')
                : (darkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(5, 150, 105, 0.2)'),
              color: pomodoroPhase === 'work' 
                ? (darkMode ? '#B6861F' : '#C9A227')
                : (darkMode ? '#10b981' : '#059669')
            }}>
              {pomodoroPhase === 'work' ? `💼 ${t.work}` : `☕ ${t.break}`}
            </div>
          )}

          <div className="text-9xl font-bold font-mono mb-12" style={{ color: darkMode ? '#E6E6E6' : '#3A3A3A' }}>
            {getDisplayTime()}
          </div>

          {mode === 'pomodoro' && sessionCount > 0 && (
            <div className="mb-8 text-3xl" style={{ color: darkMode ? '#a8a8a8' : '#5a5a5a' }}>
              {t.session}: {sessionCount}
            </div>
          )}

          <div className="flex gap-6 mb-8">
            <button
              onClick={handleStartPause}
              className="px-12 py-6 rounded-lg font-bold text-2xl transition-all flex items-center gap-3"
              style={{
                backgroundColor: darkMode ? '#B6861F' : '#C9A227',
                color: '#FEFAF3'
              }}
            >
              {isRunning ? (
                <>
                  <Pause className="w-8 h-8" />
                  {t.pause}
                </>
              ) : (
                <>
                  <Play className="w-8 h-8" />
                  {t.start}
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="px-12 py-6 rounded-lg font-bold text-2xl transition-all flex items-center gap-3"
              style={{
                backgroundColor: darkMode ? '#252525' : '#e8e1ca',
                color: darkMode ? '#c4c4c4' : '#5a5a5a'
              }}
            >
              <RotateCcw className="w-8 h-8" />
              {t.reset}
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className="px-8 py-4 rounded-lg font-semibold text-xl transition-all flex items-center gap-2"
            style={{
              backgroundColor: darkMode ? '#252525' : '#e8e1ca',
              color: darkMode ? '#c4c4c4' : '#5a5a5a'
            }}
          >
            <Minimize className="w-6 h-6" />
            {t.exitFullscreen}
          </button>
        </div>
      )}
    </div>
  );
}