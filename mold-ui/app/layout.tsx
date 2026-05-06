import "./globals.css";

export const metadata = {
  title: "Mold AI System",
  description: "Bacteria AI Recognition Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body>{children}</body>
    </html>
  );
}