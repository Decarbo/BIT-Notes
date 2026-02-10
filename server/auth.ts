// app/server/auth.ts
'use server';

import { supabase } from '@/lib/supabaseClient'; // assuming this is the server client
import { redirect } from 'next/navigation';
import { z } from 'zod';

const registerSchema = z.object({
	fullname: z.string().min(2, 'Name must be at least 2 characters'),
	email: z.string().email('Invalid email address'),
	password: z.string().min(6, 'Password must be at least 6 characters'),
	university: z.string().min(2, 'University name must be at least 2 characters'),
});

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
});

// ────────────────────────────────────────────────
// REGISTER (Sign Up)
export const register = async (_prevState: unknown, formData: FormData) => {
	// 1. Validate input
	const validated = registerSchema.safeParse(Object.fromEntries(formData));
	if (!validated.success) {
		return { error: validated.error.errors[0]?.message ?? 'Validation failed' };
	}

	const { email, password, fullname, university } = validated.data;

	// 2. Sign up
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
			// You can also pass data that goes into auth.users → raw_user_meta_data
			data: {
				full_name: fullname,
				university,
			},
		},
	});

	if (error) {
		// Very common: "User already registered" when trying duplicate email
		if (error.message.includes('already registered')) {
			return { error: 'This email is already registered. Please log in.' };
		}
		return { error: error.message };
	}

	// ────────────────────────────────────────────────
	// IMPORTANT BEHAVIOR (with email confirmation ON – default):
	// data.user     → exists
	// data.session  → null
	//
	// So we CAN insert profile here (user.id exists)
	// ────────────────────────────────────────────────

	if (data.user) {
		const { error: profileError } = await supabase.from('profiles').insert({
			id: data.user.id,
			full_name: fullname,
			university,
			is_admin: false,
		});

		if (profileError) {
			console.error('Profile insert failed:', profileError);
			// Option A: soft fail (most common)
			return {
				success: true,
				message: 'Account created! Check your email to confirm. Profile setup will complete after confirmation.',
			};
			// Option B: hard fail → delete user (more complex, needs service_role key)
		}
	}

	// Success path – tell user to check email
	return {
		success: true,
		message: 'Account created! Please check your email to confirm your account.',
	};
	// DO NOT redirect here – let the client show success message
	// redirect('/login?success=Check your email to confirm');
};

// ────────────────────────────────────────────────
// LOGIN
export const login = async (_prevState: unknown, formData: FormData) => {
	const validated = loginSchema.safeParse(Object.fromEntries(formData));
	if (!validated.success) {
		return { error: validated.error.errors[0]?.message ?? 'Validation failed' };
	}

	const { email, password } = validated.data;

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		if (error.message.includes('Email not confirmed')) {
			return { error: 'Please confirm your email before logging in.' };
		}
		return { error: error.message };
	}

	// Login success → Supabase automatically sets the cookie/session
	redirect('/dashboard');
};
