import type { Metadata } from "next";
import { GlobalLogoutAction } from "@/components/logout-action";
import { AppNavigation } from "@/components/navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sikim POS",
  description: "Shell inicial del TPV interno de Sikim.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full bg-slate-950 text-slate-100">
        <AppNavigation />
        <GlobalLogoutAction />
        {children}
      </body>
    </html>
  );
}
