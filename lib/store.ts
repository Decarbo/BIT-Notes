import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface NoteStore {
	notes: any[];
	bookmarks: string[];
	setNotes: (notes: any[]) => void;
	setBookmarks: (ids: string[]) => void;
	addBookmark: (id: string) => void;
	removeBookmark: (id: string) => void;
}

export const useNoteStore = create<NoteStore>()(
	persist(
		(set) => ({
			notes: [],
			bookmarks: [],
			setNotes: (notes) => set({ notes }),
			setBookmarks: (bookmarks) => set({ bookmarks }),
			addBookmark: (id) => set((state) => ({ bookmarks: [...state.bookmarks, id] })),
			removeBookmark: (id) =>
				set((state) => ({
					bookmarks: state.bookmarks.filter((bId) => bId !== id),
				})),
		}),
		{
			name: 'notes-storage', // localstorage key
			storage: createJSONStorage(() => localStorage),
		}
	)
);
