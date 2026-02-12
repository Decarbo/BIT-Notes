'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClient } from '@/lib/client';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, ArrowUpRight, AlertCircle, Cpu, Bookmark, Loader2, Zap, Star, ChevronLeft, ChevronRight, Send, History, Lock } from 'lucide-react';
import Shimmer from '../(howworks)/(components)/page';
import { LockClosedIcon } from '@heroicons/react/16/solid';

const supabase = createClient();

type Note = {
	id: string;
	title: string;
	subject: string;
	chapter?: string;
	branch?: string;
	file_url: string;
	created_at: string;
	uploader_email?: string;
};

export default function PublicNotes() {
	const { user, loading: authLoading, signOut } = useAuth();
	const router = useRouter();
	const queryClient = useQueryClient();

	const [search, setSearch] = useState('');
	const [selectedBranch, setSelectedBranch] = useState('ALL');

	// ── Pagination State ──────────────────────────────────────
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 6;

	// ── Fetch all notes ───────────────────────────────────────
	const { data: notes = [], isLoading: notesLoading } = useQuery<Note[]>({
		queryKey: ['public-notes'],
		queryFn: async () => {
			const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
			if (error) throw error;
			return data || [];
		},
		enabled: !authLoading,
	});

	// ── Fetch bookmarks ───────────────────────────────────────
	const { data: bookmarks = [] } = useQuery<string[]>({
		queryKey: ['user-bookmarks', user?.id],
		queryFn: async () => {
			if (!user) return [];
			const { data, error } = await supabase.from('bookmarks').select('note_id').eq('user_id', user.id);
			if (error) throw error;
			return data?.map((b) => b.note_id) || [];
		},
		enabled: !!user && !authLoading,
	});

	// ── Filtering Logic (Search + Dropdown) ───────────────────
	const filteredNotes = useMemo(() => {
		return notes.filter((note) => {
			const isCommunity = note.subject === 'CONTRIBUTION';

			// Agar Search Box mein kuch hai: Sab kuch search karo
			if (search) {
				const term = search.toLowerCase();
				return note.title?.toLowerCase().includes(term) || note.subject?.toLowerCase().includes(term);
			}

			// Agar Search nahi hai, toh Dropdown ke hisaab se filter karo
			if (selectedBranch === 'BOOKMARKED') return bookmarks.includes(note.id);
			if (selectedBranch === 'COMMUNITY') return isCommunity;
			if (selectedBranch === 'ALL') return !isCommunity; // Default feed mein community hide rakho

			// Specific Branch ke liye (CSE/MECH etc)
			return note.branch === selectedBranch && !isCommunity;
		});
	}, [notes, selectedBranch, bookmarks, search]);

	// Pagination Math
	const totalPages = Math.ceil(filteredNotes.length / ITEMS_PER_PAGE);
	const paginatedNotes = filteredNotes.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

	const handlePageChange = (newPage: number) => {
		setCurrentPage(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	const toggleBookmarkMutation = useMutation({
		mutationFn: async (noteId: string) => {
			if (!user) {
				router.push('/login');
				throw new Error('Auth required');
			}
			const isBookmarked = bookmarks.includes(noteId);
			if (isBookmarked) {
				await supabase.from('bookmarks').delete().eq('user_id', user.id).eq('note_id', noteId);
			} else {
				await supabase.from('bookmarks').insert([{ user_id: user.id, note_id: noteId }]);
			}
		},
		onSettled: () => queryClient.invalidateQueries({ queryKey: ['user-bookmarks', user?.id] }),
	});

	if (notesLoading || authLoading) return <Shimmer />;

	return (
		<div className="min-h-screen bg-[#FBFBFB] text-black selection:bg-[#90FF90]">
			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700;800&family=JetBrains+Mono:wght@700&display=swap');
				body {
					font-family: 'Space Grotesk', sans-serif;
				}
				.mono-font {
					font-family: 'JetBrains Mono', monospace;
				}
				.neubrutal-shadow {
					box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
				}
				.neubrutal-btn:active {
					transform: translate(2px, 2px);
					box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
				}
			`}</style>

			<div className="max-w-7xl mx-auto p-6 md:p-12">
				{/* Header Section */}
				<header className="mb-12">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12">
						<h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.8]">
							THE_<span className="text-[#FF90E8]">ARCHIVE</span>
						</h1>
						{user ? (
							<button
								onClick={() => signOut()}
								className="neubrutal-btn neubrutal-shadow bg-[#FF5C00] text-white border-2 border-black px-6 py-3 font-black uppercase text-sm">
								LOGOUT_{user.email?.split('@')[0]}
							</button>
						) : (
							<button
								onClick={() => router.push('/login')}
								className="neubrutal-btn neubrutal-shadow bg-[#90FF90] border-2 border-black px-8 py-4 font-black uppercase text-lg">
								LOGIN
							</button>
						)}
					</div>

					{/* Search & Filter Bar */}
					<div className="grid grid-cols-1 md:grid-cols-4 border-2 border-black bg-white neubrutal-shadow overflow-hidden">
						<div className="md:col-span-3 relative border-b-4 md:border-b-0 md:border-r-4 border-black">
							<Search
								className="absolute left-6 top-1/2 -translate-y-1/2 opacity-30"
								size={18}
							/>
							<input
								type="text"
								placeholder=" (Searches everything)..."
								className="w-full pl-16 p-6 font-bold text-xl outline-none focus:bg-[#90FF90]/10"
								value={search}
								onChange={(e) => {
									setSearch(e.target.value);
									setCurrentPage(1);
								}}
							/>
						</div>
						<div className="relative bg-[#FFD700]">
							<select
								className="w-full h-full p-6 font-black uppercase text-sm bg-transparent outline-none cursor-pointer appearance-none"
								value={selectedBranch}
								onChange={(e) => {
									setSelectedBranch(e.target.value);
									setCurrentPage(1);
								}}>
								<option value="ALL">ALL_SECTORS</option>
								<option value="COMMUNITY">
									COMMUNITY_ARCHIVE <Lock className="inline-block" />{' '}
								</option>
								<option value="BOOKMARKED">SAVED_ITEMS ({bookmarks.length})</option>
								<option value="CSE">CSE_DEPT</option>
								<option value="MECH">MECH_DEPT</option>
							</select>
							<Cpu
								className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none"
								size={20}
							/>
						</div>
					</div>
				</header>

				{/* Results Label */}
				<div className="mb-8 flex items-center gap-3">
					<div className="bg-black text-white px-4 py-1 font-black uppercase text-[10px] tracking-widest">{search ? 'Global_Search_Results' : `${selectedBranch}_Feed`}</div>
					<div className="h-[2px] flex-grow bg-black/10"></div>
				</div>

				{/* Paginated Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
					{paginatedNotes.length === 0 ? (
						<div className="col-span-full border-2 border-dashed border-black/20 py-32 text-center bg-white/50">
							<AlertCircle
								size={64}
								className="mx-auto mb-4 opacity-20"
							/>
							<h3 className="mono-font text-xl font-black uppercase opacity-20 italic">No_Intel_Found</h3>
						</div>
					) : (
						paginatedNotes.map((note) => {
							const isBookmarked = bookmarks.includes(note.id);
							const isCommunity = note.subject === 'CONTRIBUTION';
							const isSyncing = toggleBookmarkMutation.isPending && toggleBookmarkMutation.variables === note.id;

							return (
								<div
									key={note.id}
									className={`group border-2 border-black flex flex-col transition-all duration-200 relative neubrutal-shadow hover:-translate-y-2 ${isCommunity ? 'bg-gray-50' : 'bg-white'}`}>
									<div className={`p-2 px-4 flex justify-between items-center ${isCommunity ? 'bg-blue-600' : 'bg-black'} text-white`}>
										<div className="flex items-center gap-2">
											{isCommunity ? (
												<History size={12} />
											) : (
												<Zap
													size={12}
													fill="#90FF90"
												/>
											)}
											<span className="mono-font text-[10px] font-bold tracking-[0.2em]">{isCommunity ? 'COMMUNITY_SOURCE' : note.branch || 'SYSTEM_CORE'}</span>
										</div>
										<Star
											size={12}
											fill={isBookmarked ? '#90FF90' : 'none'}
											color={isBookmarked ? '#90FF90' : 'white'}
										/>
									</div>

									<div className="p-6 flex flex-col h-full">
										<div className="flex justify-between items-start mb-4">
											<h2 className="text-2xl font-black uppercase leading-[0.95] tracking-tighter break-all line-clamp-3 min-h-[70px]">{note.title?.includes('-') ? note.title.split('-').slice(1).join('-') : note.title}</h2>
											<button
												onClick={() => toggleBookmarkMutation.mutate(note.id)}
												className={`p-2 border-2 border-black neubrutal-btn transition-colors ${isBookmarked ? 'bg-[#90FF90]' : 'bg-white'}`}>
												{isSyncing ? (
													<Loader2
														size={18}
														className="animate-spin"
													/>
												) : (
													<Bookmark size={18} />
												)}
											</button>
										</div>

										<div className="space-y-4 mb-8 flex-grow">
											<div className="flex items-center gap-3">
												<BookOpen size={16} />
												<span className="text-sm font-black uppercase truncate italic">{note.subject}</span>
											</div>
											<div className="pt-4 border-t-2 border-black/5 flex justify-between items-center opacity-40 mono-font text-[9px] font-bold uppercase">
												<span>ID: {note.uploader_email}</span>
												<span>{new Date(note.created_at).toLocaleDateString()}</span>
											</div>
										</div>

										<a
											href={note.file_url}
											target="_blank"
											rel="noopener noreferrer"
											className="neubrutal-btn bg-black text-white py-4 flex items-center justify-center gap-3 font-black uppercase text-sm border-2 border-black hover:bg-[#90FF90] hover:text-black transition-all">
											View <ArrowUpRight size={20} />
										</a>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* Brutalist Pagination */}
				{totalPages > 1 && (
					<div className="flex flex-col md:flex-row items-center justify-between gap-6 border-t-4 border-black pt-12 mb-12">
						<div className="mono-font text-[10px] font-black uppercase tracking-widest bg-black text-white px-4 py-2">
							Sector_Page: {currentPage} / {totalPages}
						</div>

						<div className="flex items-center gap-2">
							<button
								disabled={currentPage === 1}
								onClick={() => handlePageChange(currentPage - 1)}
								className={`neubrutal-btn p-2 border-2 border-black neubrutal-shadow transition-all ${currentPage === 1 ? 'bg-gray-200 opacity-50' : 'bg-[#FFD700]'}`}>
								<ChevronLeft
									size={24}
									strokeWidth={3}
								/>
							</button>

							<div className="flex gap-2">
								{[...Array(totalPages)].map((_, i) => (
									<button
										key={i}
										onClick={() => handlePageChange(i + 1)}
										className={`w-12 h-12 border-2 font-black transition-all neubrutal-shadow ${currentPage === i + 1 ? 'bg-black text-white' : 'bg-white hover:bg-pink-100'}`}>
										{i + 1}
									</button>
								))}
							</div>

							<button
								disabled={currentPage === totalPages}
								onClick={() => handlePageChange(currentPage + 1)}
								className={`neubrutal-btn p-2 border-2 border-black neubrutal-shadow transition-all ${currentPage === totalPages ? 'bg-gray-200 opacity-50' : 'bg-[#90FF90]'}`}>
								<ChevronRight
									size={24}
									strokeWidth={3}
								/>
							</button>
						</div>
					</div>
				)}

				<footer className="mt-20 pt-4  border-t-4 border-black">
					<div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
						<div className="flex items-center gap-4">
							<div className="bg-black p-2 text-[#90FF90]">
								<Zap
									size={32}
									fill="currentColor"
								/>
							</div>
							<h2 className="text-4xl font-black uppercase tracking-tighter italic">
								BIT<span className="text-pink-500">.NOTES</span>
							</h2>
						</div>
					</div>
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 py-6 border-t-4 border-black/5 opacity-40">
						<p className="mono-font text-[10px] font-black uppercase italic">© 2026 Collective_Notes_System // </p>
						<div className="flex items-center gap-2">
							<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
							<span className="mono-font text-[9px] font-bold uppercase tracking-widest text-green-600">Sync_Complete</span>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
