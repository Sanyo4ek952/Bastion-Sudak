import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hotel Bastion",
  description: "Hotel Bastion landing page"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen font-sans antialiased">
        <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-12">
          {children}
        </main>
      </body>
    </html>
  );
}
