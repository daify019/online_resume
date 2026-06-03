import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "金融求职简历制作器",
  description: "面向金融类求职者的在线双语简历编辑、诊断与导出体验。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
