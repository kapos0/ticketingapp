import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ToastContainer } from "react-toastify";
import "@/assets/globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <meta charSet="UTF-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <meta
                    name="description"
                    content="A Better Auth Starter Kit for Next.js"
                />
                <link rel="icon" href="/favicon.ico" />
                <title>Better Auth Demo</title>
            </head>
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Navbar />
                    {children}
                </ThemeProvider>
                <ToastContainer />
            </body>
        </html>
    );
}
