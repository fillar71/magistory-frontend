"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-indigo-600 via-purple-700 to-pink-500 text-white px-6 py-10">
      
      {/* Header */}
      <header className="w-full flex justify-between items-center max-w-5xl">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Magistory" className="w-10 h-10 rounded-lg shadow-md" />
          <h1 className="text-2xl font-extrabold tracking-wide">Magistory</h1>
        </div>
        <Link href="/editor">
          <button className="hidden sm:block bg-white text-indigo-700 px-5 py-2 rounded-lg font-semibold hover:bg-indigo-100 transition-all">
            Mulai Sekarang
          </button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col items-center text-center mt-10 flex-1">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4"
        >
          Ubah Ide Menjadi <span className="text-yellow-300">Video Instan</span> 🎬
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-sm sm:text-lg text-gray-100 max-w-xl mb-8"
        >
          Magistory membantu kamu membuat skrip & video otomatis seperti CapCut atau Fliki.
          Cukup masukkan ide, pilih gaya video, dan lihat hasilnya!
        </motion.p>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 100 }}
        >
          <Link href="/editor">
            <button className="bg-yellow-400 text-indigo-900 font-bold text-lg px-8 py-3 rounded-full shadow-xl hover:scale-105 hover:bg-yellow-300 transition-transform">
              🚀 Mulai Buat Video
            </button>
          </Link>
        </motion.div>

        {/* Showcase Preview */}
        <div className="mt-12 w-full flex justify-center">
          <motion.img
            src="https://cdn.dribbble.com/users/1162077/screenshots/15487335/media/4e6d72b411ea2184f54533d47a41f25a.gif"
            alt="Preview"
            className="rounded-xl shadow-2xl border border-white/20 w-full max-w-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-sm text-gray-200 mt-10">
        © {new Date().getFullYear()} Magistory — Powered by Gemini & Pexels API ⚡
      </footer>
    </div>
  );
}