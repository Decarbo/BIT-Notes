'use client';

import { useEffect, useState } from 'react';
import { createClient } from './client';
import { User } from '@supabase/supabase-js';

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const supabase = createClient();

		// Initial session check
		supabase.auth.getUser().then(({ data: { user } }) => {
			setUser(user);
			setLoading(false);
		});

		// Listen to auth changes
		const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		return () => {
			listener.subscription.unsubscribe();
		};
	}, []);

	const signUp = async (email: string, password: string) => {
		const supabase = createClient();
		return supabase.auth.signUp({ email, password });
	};

	const signIn = async (email: string, password: string) => {
		const supabase = createClient();
		return supabase.auth.signInWithPassword({ email, password });
	};

	const signOut = async () => {
		const supabase = createClient();
		return supabase.auth.signOut();
	};

	return { user, loading, signUp, signIn, signOut };
}
