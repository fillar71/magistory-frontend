// src/app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "Magistory Instant Video",
  description: "Buat video otomatis dari ide dalam hitungan detik!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-gray-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
