'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Plus, Search, LogOut, Terminal, Eye, User2, Sun, Moon, Globe } from 'lucide-react';

export default function Navbar() {
	const { user, signOut } = useAuth();
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [mounted, setMounted] = useState(false);

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
		<nav className={`w-full bg-white dark:bg-[#0a0a0a] border-b-[3px] border-black dark:border-white sticky top-0 z-[100] transition-all duration-500 cubic-bezier(0.23, 1, 0.32, 1) ${scrolled ? 'py-1 shadow-[0_4px_0_0_rgba(0,0,0,0.05)]' : 'py-3'}`}>
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

				@keyframes navBlurReveal {
					0% {
						filter: blur(10px);
						opacity: 0;
						transform: translateY(-10px);
					}
					100% {
						filter: blur(0px);
						opacity: 1;
						transform: translateY(0px);
					}
				}

				.animate-nav-reveal {
					animation: navBlurReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
				}

				.transition-neobrutal {
					transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
				}
			`}</style>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-1 animate-nav-reveal">
				<div className="flex justify-between h-16 items-center">
					{/* LOGO SECTION */}
					<div className="flex-shrink-0 flex items-center">
						<Link
							href="/"
							className="group relative">
							<div className="bg-black text-white px-4 py-2 border-2 dark:bg-zinc-900 border-black dark:border-white transform group-hover:-rotate-2 transition-neobrutal shadow-[4px_4px_0px_0px_rgba(144,255,144,1)] group-hover:shadow-none group-hover:translate-x-1 group-hover:translate-y-1">
								<span className="text-xl sm:text-2xl font-black tracking-tighter uppercase nav-heading">
									BIT<span className="text-[#90FF90] dark:text-pink-500">NOTES</span>
								</span>
							</div>
						</Link>
					</div>

					{/* DESKTOP NAV */}
					<div className="hidden md:flex items-center gap-1">
						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="mr-6 p-2 border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-[#90FF90] dark:hover:bg-pink-600 transition-neobrutal shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] active:shadow-none active:translate-x-1 active:translate-y-1">
							{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
						</button>

						{[
							{ href: '/notes', label: 'Explore_Nodes', icon: <Eye size={14} /> },
							{ href: '/upload', label: 'Push_Update', icon: <Plus size={14} /> },
							{ href: '/help-notes', label: 'Community', icon: <Globe size={14} /> },
						].map((link, idx) => (
							<Link
								key={link.href}
								href={link.href}
								style={{ animationDelay: `${idx * 0.1}s` }}
								className="nav-mono text-[10px] font-bold uppercase tracking-widest px-4 py-2 hover:bg-black hover:text-[#90FF90] dark:hover:bg-white dark:hover:text-black text-black dark:text-white flex items-center gap-2 transition-neobrutal rounded-sm">
								{link.icon} {link.label}
							</Link>
						))}

						<div className="w-[2px] h-4 bg-black dark:bg-white/20 mx-4 opacity-10" />

						{user ? (
							<div className="flex items-center gap-4">
								<Link
									href="/dashboard"
									className="nav-mono text-[10px] font-bold bg-[#90FF90] dark:bg-pink-600 border-2 border-black dark:border-white text-black dark:text-white px-5 py-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-neobrutal flex items-center gap-2 uppercase">
									<User2
										size={14}
										strokeWidth={2.5}
									/>{' '}
									{displayName}
								</Link>
								<button
									onClick={handleLogout}
									className="p-2 border-2 border-black dark:border-white dark:text-white hover:bg-red-500 hover:text-white transition-neobrutal shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] hover:shadow-none">
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
									className="nav-mono text-[10px] font-bold border-2 border-black dark:border-white text-black dark:text-white px-5 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-neobrutal uppercase">
									Login
								</Link>
								<Link
									href="/signup"
									className="nav-mono text-[10px] font-bold bg-black dark:bg-white text-white dark:text-black px-5 py-2 shadow-[4px_4px_0_0_rgba(144,255,144,1)] dark:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:shadow-none transition-neobrutal uppercase">
									Initialize
								</Link>
							</div>
						)}
					</div>

					{/* MOBILE TRIGGER */}
					<div className="md:hidden flex items-center gap-3">
						<button
							onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
							className="p-2 border-2 border-black dark:border-white text-black dark:text-white transition-neobrutal">
							{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
						</button>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={`p-2 border-2 border-black dark:border-white transition-neobrutal ${isOpen ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white dark:bg-black text-black dark:text-white'}`}>
							{isOpen ? <X size={20} /> : <Menu size={20} />}
						</button>
					</div>
				</div>
			</div>

			{/* MOBILE OVERLAY */}
			{isOpen && (
				<div className="md:hidden border-t-[3px] border-black dark:border-white bg-white dark:bg-[#0a0a0a] animate-nav-reveal">
					<div className="px-6 py-10 space-y-4">
						{[
							{ href: '/notes', label: 'Directory', icon: <Search size={24} /> },
							{ href: '/upload', label: 'Deploy', icon: <Plus size={24} />, color: 'text-pink-600' },
							{ href: '/dashboard', label: 'Terminal', icon: <Terminal size={24} /> },
						].map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center justify-between py-4 border-b-2 border-black dark:border-white/10 nav-heading font-black uppercase text-4xl tracking-tighter ${item.color || 'text-black dark:text-white'}`}
								onClick={() => setIsOpen(false)}>
								{item.label} {item.icon}
							</Link>
						))}
						{user && (
							<button
								onClick={handleLogout}
								className="w-full text-left py-4 nav-heading font-black uppercase text-4xl tracking-tighter text-red-500 flex items-center justify-between">
								Terminate <LogOut size={24} />
							</button>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
