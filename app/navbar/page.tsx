'use client';

import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, PlusCircle, Search, LogOut, User } from 'lucide-react';

export default function Navbar() {
	const { user, signOut } = useAuth();
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);

	const displayName = user?.name || user?.email?.split('@')[0] || 'Explorer';

	const handleLogout = async () => {
		await signOut();
		router.push('/login');
		setIsOpen(false);
	};

	return (
		<nav className="w-full bg-white border-b-4 border-black sticky top-0 z-[100] font-sans selection:bg-black selection:text-[#90FF90]">
			{/* Warli Pattern Border Accent (Minimal Indian Touch) */}
			<div className="h-1 w-full bg-black flex overflow-hidden opacity-20">
				{[...Array(20)].map((_, i) => (
					<div
						key={i}
						className="flex-shrink-0 w-20 h-full border-r border-white/30 skew-x-12"
					/>
				))}
			</div>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-20 items-center">
					{/* Logo Section */}
					<div className="flex-shrink-0 flex items-center">
						<Link
							href="/"
							className="group relative">
							<div className="bg-black text-white px-4 py-2 border-2 border-black transform group-hover:-rotate-2 transition-transform shadow-[4px_4px_0px_0px_rgba(255,144,232,1)]">
								<span
									className="text-xl sm:text-2xl font-black tracking-tighter uppercase"
									style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
									BIT<span className="text-[#90FF90]">NOTES</span>
								</span>
							</div>
						</Link>
					</div>

					{/* Desktop Navigation Links */}
					<div className="hidden md:flex items-center gap-8">
						<Link
							href="/notes"
							className="font-black uppercase text-sm tracking-widest hover:text-pink-500 transition-colors flex items-center gap-2">
							<Search
								size={18}
								strokeWidth={3}
							/>{' '}
							Explore
						</Link>
						<Link
							href="/upload"
							className="font-black uppercase text-sm tracking-widest hover:text-[#90FF90] transition-colors flex items-center gap-2">
							<PlusCircle
								size={18}
								strokeWidth={3}
							/>{' '}
							Upload
						</Link>

						<div className="h-8 w-1 bg-black/10 mx-2" />

						{user ? (
							<div className="flex items-center gap-4">
								<Link
									href="/dashboard"
									className="flex items-center gap-2 px-4 py-2 bg-yellow-300 border-2 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all uppercase">
									<User
										size={18}
										strokeWidth={3}
									/>{' '}
									{displayName}
								</Link>
								<button
									onClick={handleLogout}
									className="p-2 border-2 border-black hover:bg-red-500 hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
									title="Logout">
									<LogOut
										size={20}
										strokeWidth={3}
									/>
								</button>
							</div>
						) : (
							<div className="flex items-center gap-4 font-bold text-lg">
								<Link
									href="/login"
									className="bg-white text-black px-6 py-2 border-2 border-black hover:bg-[#F0F0F0] font-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm uppercase">
									Login
								</Link>
								<Link
									href="/signup"
									className="bg-[#90FF90] text-black px-6 py-2 border-2 border-black font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-sm uppercase">
									Join
								</Link>
							</div>
						)}
					</div>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className={`p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all ${isOpen ? 'bg-red-500' : 'bg-[#FF90E8]'}`}>
							{isOpen ? (
								<X
									size={24}
									strokeWidth={4}
								/>
							) : (
								<Menu
									size={24}
									strokeWidth={4}
								/>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden border-t-4 border-black bg-white relative overflow-hidden">
					{/* Decorative background circle for mobile menu */}
					<div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-300 border-4 border-black rounded-full opacity-20 pointer-events-none" />

					<div className="px-6 py-8 space-y-4">
						<Link
							href="/explore"
							className="flex items-center gap-4 py-4 border-b-2 border-black/5 font-black uppercase text-2xl tracking-tighter"
							onClick={() => setIsOpen(false)}>
							<Search
								size={28}
								strokeWidth={3}
							/>{' '}
							Explore
						</Link>
						<Link
							href="/upload"
							className="flex items-center gap-4 py-4 border-b-2 border-black/5 font-black uppercase text-2xl tracking-tighter"
							onClick={() => setIsOpen(false)}>
							<PlusCircle
								size={28}
								strokeWidth={3}
							/>{' '}
							Upload
						</Link>

						{user ? (
							<div className="pt-6 space-y-4">
								<div className="bg-gray-100 p-4 border-2 border-black font-black flex items-center gap-3">
									<User
										size={20}
										className="text-pink-500"
									/>{' '}
									{displayName}
								</div>
								<button
									onClick={handleLogout}
									className="w-full bg-black text-white py-5 border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] font-black uppercase text-xl">
									LOGOUT
								</button>
							</div>
						) : (
							<div className="pt-6 grid grid-cols-2 gap-4">
								<Link
									href="/login"
									className="bg-white text-black py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-center"
									onClick={() => setIsOpen(false)}>
									LOGIN
								</Link>
								<Link
									href="/signup"
									className="bg-[#90FF90] text-black py-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase text-center"
									onClick={() => setIsOpen(false)}>
									JOIN
								</Link>
							</div>
						)}
					</div>
				</div>
			)}
		</nav>
	);
}
