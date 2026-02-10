'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { signIn } = useAuth();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const { data, error } = await signIn(email, password);
			if (error) {
				setError(error.message);
				return;
			}
			router.push('/dashboard');
		} catch (err: any) {
			setError(err.message || 'Login failed. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-[#FF90E8] p-6 selection:bg-black selection:text-[#FF90E8]">
			{/* Background Grid - Keeping the brand theme */}
			<div
				className="absolute inset-0 z-0 opacity-10"
				style={{
					backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`,
					backgroundSize: '32px 32px',
				}}></div>

			<div className="relative z-10 max-w-md w-full bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 md:p-12">
				<div className="text-center mb-10">
					<h2
						className="text-4xl font-black uppercase tracking-tighter text-black"
						style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
						Welcome <span className="bg-yellow-300 border-2 border-black px-2">Back</span>
					</h2>
					<p className="mt-3 font-bold text-gray-700">Sign in to access the vault.</p>
				</div>

				<form
					className="space-y-6"
					onSubmit={handleSubmit}>
					{/* Email Field */}
					<div className="space-y-2">
						<label
							htmlFor="email"
							className="block text-sm font-black uppercase tracking-widest text-black">
							Email Address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-4 py-4 border-4 border-black bg-white focus:bg-yellow-50 focus:outline-none font-bold placeholder-gray-400 transition-colors"
							placeholder="niraj@bit-sindri.ac.in"
						/>
					</div>

					{/* Password Field */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label
								htmlFor="password"
								className="block text-sm font-black uppercase tracking-widest text-black">
								Password
							</label>
							<Link
								href="/forgot-password"
								size-sm
								className="text-xs font-bold underline decoration-2 hover:text-pink-600">
								Forgot?
							</Link>
						</div>
						<input
							id="password"
							name="password"
							type="password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-4 border-4 border-black bg-white focus:bg-yellow-50 focus:outline-none font-bold placeholder-gray-400 transition-colors"
							placeholder="••••••••"
						/>
					</div>

					{/* Error Message */}
					{error && <div className="p-4 bg-red-100 border-2 border-black font-bold text-red-700 text-sm">{error}</div>}

					{/* Submit Button */}
					<button
						type="submit"
						disabled={loading}
						className="group relative w-full flex justify-center py-5 border-4 border-black text-xl font-black uppercase tracking-widest text-black bg-[#90FF90] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-50">
						{loading ? (
							<span className="flex items-center gap-2">
								<svg
									className="animate-spin h-5 w-5 text-black"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24">
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Processing...
							</span>
						) : (
							'Sign In →'
						)}
					</button>
				</form>

				<div className="mt-8 pt-8 border-t-2 border-black text-center">
					<p className="font-bold text-gray-700">
						Don't have an account?{' '}
						<Link
							href="/signup"
							className="text-black underline decoration-4 hover:bg-yellow-300 transition-colors px-1">
							Sign up now
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
}
