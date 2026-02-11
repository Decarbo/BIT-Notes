// app/auth/register/page.tsx
'use client';
import { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabase = new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Register() {
	async function register(formData: FormData) {
		'use server';

		const email = formData.get('email') as string;
		const password = formData.get('password') as string;
		const full_name = formData.get('full_name') as string;
		const university = formData.get('university') as string;

		if (!email || !password || !full_name || !university) {
			return { error: 'All fields are required' };
		}

		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: 'http://localhost:3000', // dev ke liye simple
			},
		});

		if (error) {
			redirect(`/auth/register?error=${encodeURIComponent(error.message)}`);
		}

		if (data.user) {
			await supabase.from('profiles').insert({
				id: data.user.id,
				full_name,
				university,
				is_admin: false, // default
			});
		}

		redirect('/auth/login?message=Account created! Please login.');
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md">
				<h1 className="text-3xl font-bold text-center mb-8">Create Account</h1>

				<form
					action={register}
					className="space-y-6">
					<div>
						<label className="block text-sm font-medium text-gray-700">Full Name</label>
						<input
							name="full_name"
							type="text"
							required
							className="mt-1 w-full px-4 py-3 border rounded-lg"
						/>
					</div>

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
							minLength={6}
							className="mt-1 w-full px-4 py-3 border rounded-lg"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">University</label>
						<input
							name="university"
							type="text"
							required
							className="mt-1 w-full px-4 py-3 border rounded-lg"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
						Sign Up
					</button>
				</form>

				<p className="text-center mt-6 text-gray-600">
					Already have an account?{' '}
					<a
						href="/auth/login"
						className="text-blue-600 hover:underline">
						Login
					</a>
				</p>
			</div>
		</div>
	);
}
