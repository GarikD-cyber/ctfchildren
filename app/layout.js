import "./globals.css";

export const metadata = {
  title: "Защитники Кибергорода",
  description: "Квестовое приключение о цифровой безопасности для детей 8–13 лет",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#102a56",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
