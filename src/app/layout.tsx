import "./globals.css";

export const metadata = { title: "Mi Tienda", description: "Vitrina e-commerce" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}
      </body>
    </html>
  );
}
