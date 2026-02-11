// lib/queries/useBookmarks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/client';

const supabase = createClient();

export function useBookmarks(userId?: string) {
	const queryClient = useQueryClient();

	const bookmarksQuery = useQuery({
		queryKey: ['bookmarks', userId],
		enabled: !!userId,
		queryFn: async () => {
			const { data, error } = await supabase.from('bookmarks').select('note_id').eq('user_id', userId);

			if (error) throw error;
			return data.map((b) => b.note_id);
		},
	});

	const toggleBookmark = useMutation({
		mutationFn: async ({ noteId, isBookmarked }: any) => {
			if (isBookmarked) {
				return supabase.from('bookmarks').delete().eq('user_id', userId).eq('note_id', noteId);
			}
			return supabase.from('bookmarks').insert([{ user_id: userId, note_id: noteId }]);
		},
		onMutate: async ({ noteId, isBookmarked }) => {
			await queryClient.cancelQueries({ queryKey: ['bookmarks', userId] });

			const prev = queryClient.getQueryData<string[]>(['bookmarks', userId]) || [];

			queryClient.setQueryData(['bookmarks', userId], isBookmarked ? prev.filter((id) => id !== noteId) : [...prev, noteId]);

			return { prev };
		},
		onError: (_err, _vars, ctx) => {
			queryClient.setQueryData(['bookmarks', userId], ctx?.prev);
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['bookmarks', userId] });
		},
	});

	return { ...bookmarksQuery, toggleBookmark };
}
