'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Plus, Search, LogOut, Terminal, Eye, User2, Sun, Moon } from 'lucide-react';

export default function Navbar() {
	const { user, signOut } = useAuth();
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Prevent hydration mismatch: only render theme-dependent UI after mounting
	useEffect(() => {
		setMounted(true);
		const handleScroll = () => setScrolled(window.scrollY > 20);
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const displayName = user?.email?.split('@')[0] || 'Guest';

	const handleLogout = async () => {
		await signOut();
		router.push('/login');
		setIsOpen(false);
	};

	if (!mounted) return null;

	return (
		<nav className={`w-full bg-white dark:bg-[#0a0a0a] border-b-[3px] border-black dark:border-white sticky top-0 z-[100] transition-colors duration-300 ${scrolled ? 'py-1 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]' : 'py-3'}`}>
			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=JetBrains+Mono:wght@500;700&display=swap');
				.nav-heading {
					font-family: 'Space Grotesk', sans-serif;
				}
				.nav-mono {
					font-family: 'JetBrains Mono', monospace;
				}
			`}</style>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-1">
				<div className="flex justify-between h-16 items-center">
					{/* LOGO */}
					<div className="flex-shrink-0">
						<Link
							href="/"
							className="group flex items-center gap-2">
							<div className="bg-black dark:bg-white text-white dark:text-black p-2 border-2 border-black dark:border-white group-hover:rotate-6 transition-transform">
								<Terminal
									size={20}
									className="text-[#90FF90] dark:text-pink-600"
								/>
							</div>
							<span className="nav-heading text-2xl font-bold tracking-tighter uppercase hidden sm:block text-black dark:text-white">
								BIT<span className="text-pink-600">.</span>NOTES
							</span>
						</Link>
					</div>

					{/* DESKTOP NAV */}
					<div className="hidden md:flex items-center gap-1">
						{/* DARK MODE TOGGLE */}
						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="mr-4 p-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-yellow-300 dark:hover:bg-pink-600 transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
							{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
						</button>

						<Link
							href="/notes"
							className="nav-mono text-[11px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-black dark:text-white flex items-center gap-2 transition-colors">
							<Eye
								size={14}
								strokeWidth={2.5}
							/>{' '}
							Explore_Notes
						</Link>
						<Link
							href="/upload"
							className="nav-mono text-[11px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-black dark:text-white flex items-center gap-2 transition-colors">
							<Plus
								size={14}
								strokeWidth={2.5}
							/>{' '}
							Push_Notes
						</Link>

						<div className="w-[2px] h-4 bg-gray-200 dark:bg-zinc-800 mx-4" />

						{user ? (
							<div className="flex items-center gap-3">
								<Link
									href="/dashboard"
									className="nav-mono text-[11px] font-bold bg-[#90FF90] dark:bg-pink-600 border-2 border-black dark:border-white text-black dark:text-white px-4 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all flex items-center gap-2 uppercase">
									<User2
										size={14}
										strokeWidth={2.5}
									/>{' '}
									{displayName}
								</Link>
								<button
									onClick={handleLogout}
									className="p-2 border-2 border-black dark:border-white dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none">
									<LogOut
										size={16}
										strokeWidth={2.5}
									/>
								</button>
							</div>
						) : (
							<div className="flex items-center gap-3">
								<Link
									href="/login"
									className="nav-mono text-[11px] font-bold border-2 border-black dark:border-white text-black dark:text-white px-5 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all uppercase">
									Login
								</Link>
								<Link
									href="/signup"
									className="nav-mono text-[11px] font-bold bg-black dark:bg-white text-white dark:text-black px-5 py-2 shadow-[4px_4px_0_0_rgba(144,255,144,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none transition-all uppercase">
									Initialize
								</Link>
							</div>
						)}
					</div>

					{/* MOBILE TRIGGER */}
					<div className="md:hidden flex items-center gap-3">
						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="p-2 border-2 border-black dark:border-white text-black dark:text-white">
							{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
						</button>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={`p-2 border-2 border-black dark:border-white transition-all ${isOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-black text-black dark:text-white'}`}>
							{isOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>
			</div>

			{/* MOBILE OVERLAY */}
			{isOpen && (
				<div className="md:hidden border-t-[3px] border-black dark:border-white bg-white dark:bg-[#0a0a0a] animate-in slide-in-from-top duration-300">
					<div className="px-6 py-10 space-y-2">
						<Link
							href="/notes"
							className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-zinc-800 nav-heading font-bold uppercase text-3xl tracking-tighter text-black dark:text-white"
							onClick={() => setIsOpen(false)}>
							Directory <Search size={24} />
						</Link>
						<Link
							href="/upload"
							className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-zinc-800 nav-heading font-bold uppercase text-3xl tracking-tighter text-pink-600"
							onClick={() => setIsOpen(false)}>
							Deploy <Plus size={24} />
						</Link>
					</div>
				</div>
			)}
		</nav>
	);
}
