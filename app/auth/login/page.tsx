// app/auth/login/page.tsx
'use client';
import { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabase = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Login() {
	async function login(formData: FormData) {
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
		}

		redirect('/');
	}

	const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
				<h1 className="text-3xl font-bold text-center mb-8">Welcome Back</h1>

				{urlParams.get('message') && <p className="text-green-600 text-center mb-4">{urlParams.get('message')}</p>}

				{urlParams.get('error') && <p className="text-red-600 text-center mb-4">{decodeURIComponent(urlParams.get('error') || '')}</p>}

				<form
					action={login}
					className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">Email</label>
						<input
							name="email"
							type="email"
							required
							className="mt-1 w-full px-4 py-3 border rounded-lg"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">Password</label>
						<input
							name="password"
							type="password"
							required
							className="mt-1 w-full px-4 py-3 border rounded-lg"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
						Login
					</button>
				</form>

				<p className="text-center mt-6 text-gray-600">
					No account?{' '}
					<a
						href="/auth/register"
						className="text-blue-600 hover:underline">
						Register
					</a>
				</p>
			</div>
		</div>
	);
}
