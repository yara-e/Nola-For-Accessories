import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NOLA',
  description: 'Handcrafted pieces and everyday essentials.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FAF9F6] text-[#281836]">
        {children}
      </body>
    </html>
  );
}