import type { Metadata } from "next";
import "./globals.css";
import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';

// Load dev tools in development mode
if (process.env.NODE_ENV === 'development') {
  import('../src/libs/clear-auth-storage');
}


export const metadata: Metadata = {
  title: "Torisho - Japanese Learning Platform",
  description: "Your all-in-one platform for mastering Japanese",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
