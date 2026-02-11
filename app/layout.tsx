// app/layout.tsx
import { ThemeProvider } from 'next-themes';
import Navbar from './navbar/page';
import './globals.css';
import Providers from './providers';
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html
			lang="en"
			suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="light" // or "system" if you prefer OS default
					enableSystem={true} // respects prefers-color-scheme
					disableTransitionOnChange // prevents flash on toggle (optional)
				>
					<Navbar />
					<Providers>{children}</Providers>
				</ThemeProvider>
			</body>
		</html>
	);
}
