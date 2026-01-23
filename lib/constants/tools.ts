import { Users,Hash,Key,ImageIcon,QrCode,FileJson, Clock } from 'lucide-react';

export const toolsList = {
  id: [
    {
      id: "random-name-picker",
      name: "Random Name Picker",
      description: "Undian nama secara random dan fair. Cocok untuk giveaway, lucky draw, atau pemilihan acak.",
      icon: Users,
      available: true
    },
    {
      id: "random-number",
      name: "Random Number Generator",
      description: "Generate angka random dengan range custom. Berguna untuk undian nomor atau kebutuhan random lainnya.",
      icon: Hash,
      available: true
    },
    {
      id: "password-generator",
      name: "Password Generator",
      description: "Generate password yang kuat dan aman dengan berbagai opsi kustomisasi.",
      icon: Key,
      available: true
    },
    {
      id: "background-remover",
      name: "Background Remover",
      description: "Hapus background gambar untuk PNG, TTD, Stiker WA dengan mudah dan gratis.",
      icon: ImageIcon,
      available: true,
    },
    {
      id: "qr-code-generator",
      name: "QR Code Generator",
      description: "Buat QR Code untuk URL, WiFi, vCard, Email, dan lainnya dengan mudah.",
      icon: QrCode,
      available: true
    },
    {
      id: "json-formatter",
      name: "JSON Formatter",
      description: "Format, validate, minify JSON dengan mudah. Dilengkapi statistik dan error detection.",
      icon: FileJson,
      available: true
    },
    {
      id: "timer",
      name: "Timer & Countdown",
      description: "Pomodoro timer, countdown, dan stopwatch dengan fullscreen support.",
      icon: Clock,
      available: true
    }
  ],
  en: [
    {
      id: "random-name-picker",
      name: "Random Name Picker",
      description: "Random and fair name drawing. Perfect for giveaways, lucky draws, or random selection.",
      icon: Users,
      available: true
    },
    {
      id: "random-number",
      name: "Random Number Generator",
      description: "Generate random numbers with custom range. Useful for number draws or other random needs.",
      icon: Hash,
      available: true
    },
    {
      id: "password-generator",
      name: "Password Generator",
      description: "Generate strong and secure passwords with various customization options.",
      icon: Key,
      available: true
    },
    {
      id: "background-remover",
      name: "Background Remover",
      description: "Remove image background for PNG, Signature, WA Stickers easily and free.",
      icon: ImageIcon,
      available: true
    },
    {
      id: "qr-code-generator",
      name: "QR Code Generator",
      description: "Create QR Code for URL, WiFi, vCard, Email, and more easily.",
      icon: QrCode,
      available: true
    },
    {
      id: "json-formatter",
      name: "JSON Formatter",
      description: "Format, validate, minify JSON easily. With statistics and error detection.",
      icon: FileJson,
      available: true
    },
    {
      id: "timer",
      name: "Timer & Countdown",
      description: "Pomodoro timer, countdown, and stopwatch with fullscreen support.",
      icon: Clock,
      available: true
    }
  ]
};