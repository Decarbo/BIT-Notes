'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const { signUp } = useAuth();
	const router = useRouter();

	const handleSignup = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setMessage(null);

		try {
			const { error } = await signUp(email, password);

			if (error) {
				setError(error.message);
				return;
			}

			setMessage('Check your email to confirm signup! 🚀');
		} catch (err: any) {
			setError('Something went wrong. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#FF90E8] p-6 selection:bg-black selection:text-[#FF90E8]">
			{/* Background Grid Pattern */}
			<div
				className="absolute inset-0 z-0 opacity-10"
				style={{
					backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`,
					backgroundSize: '32px 32px',
				}}></div>

			<div className="relative z-10 max-w-md w-full bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
				<div className="mb-10 text-center">
					<h1
						className="text-4xl font-black uppercase tracking-tighter text-black"
						style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
						Create <span className="bg-[#90FF90] border-2 border-black px-2 inline-block -rotate-1">Account</span>
					</h1>
					<p className="mt-4 font-bold text-gray-700 italic">Start sharing PDFs with your collage squad today.</p>
				</div>

				<form
					onSubmit={handleSignup}
					className="space-y-6">
					<div className="space-y-2">
						<label className="block text-sm font-black uppercase tracking-widest text-black">Your Email</label>
						<input
							type="email"
							placeholder="you@collage.edu"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full p-4 border-4 border-black bg-white focus:bg-yellow-50 focus:outline-none font-bold placeholder-gray-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
							required
						/>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-black uppercase tracking-widest text-black">Password</label>
						<input
							type="password"
							placeholder="••••••••"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full p-4 border-4 border-black bg-white focus:bg-yellow-50 focus:outline-none font-bold placeholder-gray-400 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-black text-white p-5 text-xl font-black uppercase tracking-widest border-4 border-black shadow-[6px_6px_0px_0px_rgba(144,255,144,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50">
						{loading ? 'PROCESSING...' : 'JOIN THE VAULT →'}
					</button>
				</form>

				{/* Status Messages */}
				{error && <div className="mt-6 p-4 bg-red-100 border-4 border-black font-black text-red-700 uppercase text-xs text-center">{error}</div>}

				{message && <div className="mt-6 p-4 bg-[#90FF90] border-4 border-black font-black text-black uppercase text-xs text-center animate-bounce">{message}</div>}

				<div className="mt-10 pt-6 border-t-4 border-black text-center font-bold">
					<p>
						Already a member?{' '}
						<Link
							href="/login"
							className="text-black underline decoration-4 hover:bg-yellow-300 transition-all">
							Login here
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
