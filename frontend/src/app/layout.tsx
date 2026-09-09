import "./globals.css";

// Runs before first paint so the correct theme is applied to <html>
// immediately, preventing a flash of the wrong theme on load.
const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem("theme");
    var d = t === "dark";
    var el = document.documentElement;
    el.classList.toggle("dark", d);
    el.dataset.theme = d ? "dark" : "light";
    el.style.colorScheme = d ? "dark" : "light";
  } catch (_) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
