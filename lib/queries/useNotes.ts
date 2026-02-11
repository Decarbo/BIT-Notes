// lib/queries/useNotes.ts
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/client';

const supabase = createClient();

export function useNotes(search: string, branch: string, bookmarks?: string[]) {
	return useQuery({
		queryKey: ['notes', search, branch, bookmarks],
		queryFn: async () => {
			let query = supabase.from('notes').select('*');

			if (branch !== 'ALL' && branch !== 'BOOKMARKED') {
				query = query.eq('branch', branch);
			}

			if (search) {
				query = query.or(`title.ilike.%${search}%,subject.ilike.%${search}%,chapter.ilike.%${search}%`);
			}

			const { data, error } = await query.order('created_at', { ascending: false });
			if (error) throw error;

			if (branch === 'BOOKMARKED' && bookmarks) {
				return data?.filter((n) => bookmarks.includes(n.id));
			}

			return data ?? [];
		},
	});
}
