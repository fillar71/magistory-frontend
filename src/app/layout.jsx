import "./globals.css";

export const metadata = {
  title: "Magistory - AI Video Generator",
  description: "Buat video instan berbasis ide menggunakan AI dan Pexels API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="font-sans bg-gray-50 text-gray-800">
        {children}
      </body>
    </html>
  );
}
