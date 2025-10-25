import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Highlights Intelligence Platform",
  description: "MVP workspace for spaced repetition, imports, and digests"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          <div className="badge">Highlights MVP</div>
          <ul>
            <li>
              <Link href="/">Dashboard</Link>
            </li>
            <li>
              <Link href="/imports">Imports</Link>
            </li>
            <li>
              <Link href="/library">Library</Link>
            </li>
            <li>
              <Link href="/digests">Digests</Link>
            </li>
            <li>
              <Link href="/analytics">Analytics</Link>
            </li>
          </ul>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
