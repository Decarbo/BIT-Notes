'use client';

import React from 'react';
import { UserPlus, FileUp, Layers, Share2, AlertCircle, Zap, Instagram, ArrowUpRight } from 'lucide-react';

const steps = [
	{
		id: '01',
		label: 'SIGN UP',
		title: 'Build Your Identity',
		description: 'Join the ecosystem. Activate your account with a single email and start building your Community Karma profile.',
		icon: <UserPlus size={32} />,
		color: 'bg-[#FF90E8]', // Gumroad Pink
		darkColor: 'bg-pink-600',
	},
	{
		id: '02',
		label: 'DRAG & DROP',
		title: 'The Smart Drop',
		description: 'Throw your PDFs into the vault. Our engine reads the file and auto-suggests the Subject and Chapter for you.',
		icon: <FileUp size={32} />,
		color: 'bg-[#90FF90]', // Mint Green
		darkColor: 'bg-green-600',
	},
	{
		id: '03',
		label: 'ORGANIZE',
		title: 'Vaulted & Secured',
		description: 'Files are encrypted in our community storage. Metadata is indexed so your notes are searchable forever.',
		icon: <Layers size={32} />,
		color: 'bg-yellow-300', // Cyber Yellow
		darkColor: 'bg-yellow-500',
	},
	{
		id: '04',
		label: 'DISCOVER',
		title: 'Search & Conquer',
		description: 'Filter by Branch, Subject, or Tags. Find exactly what you need in seconds without the WhatsApp noise.',
		icon: <Share2 size={32} />,
		color: 'bg-blue-400', // Sky Blue
		darkColor: 'bg-blue-600',
	},
];

export default function HowItWorks() {
	return (
		<section className="bg-[#F0F0F0] dark:bg-gray-950 py-24 px-6 border-t-4 border-black dark:border-gray-300 font-sans transition-colors duration-300">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-20">
					<h2
						className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6 text-black dark:text-white"
						style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
						HOW IT <span className="bg-black text-[#90FF90] dark:bg-white dark:text-black px-4">WORKS</span>
					</h2>
					<p className="text-xl md:text-2xl font-bold text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">Direct, bold, and action-oriented. Share knowledge in four simple steps.</p>
				</div>

				{/* Steps Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
					{steps.map((step, index) => (
						<div
							key={index}
							className={`relative ${step.color} dark:${step.darkColor} border-4 border-black dark:border-gray-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.3)] transition-all group`}>
							{/* Floating ID Tag */}
							<div className="absolute -top-6 -right-4 bg-white dark:bg-gray-800 border-4 border-black dark:border-gray-300 px-3 py-1 font-black text-2xl rotate-6 group-hover:rotate-0 transition-transform text-black dark:text-white">{step.id}</div>

							{/* Icon Container */}
							<div className="mb-6 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-300 w-fit p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] text-black dark:text-white">{step.icon}</div>

							<h3 className="text-xs font-black tracking-widest uppercase mb-2 text-black/60 dark:text-gray-400">{step.label}</h3>
							<h4 className="text-2xl font-black mb-4 uppercase leading-none text-black dark:text-white">{step.title}</h4>
							<p className="font-bold leading-tight text-black/80 dark:text-gray-200">{step.description}</p>
						</div>
					))}
				</div>

				{/* Vault Rules & Pro-Tips Section */}
				<div className="bg-black text-white dark:bg-gray-900 dark:text-gray-100 p-8 md:p-12 border-4 border-black dark:border-gray-300 shadow-[12px_12px_0px_0px_rgba(255,144,232,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.15)] relative overflow-hidden transition-colors">
					<div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
						<AlertCircle
							size={150}
							className="text-white dark:text-gray-400"
						/>
					</div>
					<div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
						<div className="flex-1 text-center md:text-left">
							<h3
								className="text-4xl font-black mb-4 text-yellow-300 dark:text-yellow-400 uppercase italic"
								style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
								Vault Rules & Pro-Tips
							</h3>
							<p className="text-lg font-bold text-gray-400 dark:text-gray-500 italic">Keep the system clean. Follow the protocols:</p>
						</div>
						<div className="flex-1 grid gap-4 w-full">
							{[
								{ rule: '01', text: 'Only PDF files allowed. No images or docs.' },
								{ rule: '02', text: 'Maximum file size: 50MB per upload.' },
								{ rule: '03', text: 'No spam, duplicate, or empty documents.' },
							].map((item, i) => (
								<div
									key={i}
									className="bg-white/5 dark:bg-white/10 border-2 border-white/20 dark:border-gray-600 p-4 flex items-center gap-4 hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
									<span className="bg-[#FF90E8] dark:bg-pink-600 text-black dark:text-white px-2 py-1 font-black text-xs">{item.rule}</span>
									<p className="font-bold text-sm md:text-base">{item.text}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
			<footer className="mt-32 border-t-8 border-black pt-0 overflow-hidden bg-white">
				<div className="p-8 md:p-12">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
						{/* 2. Brand Identity Block */}
						<div className="max-w-md">
							<div className="flex items-center gap-3 mb-4">
								<div className="w-10 h-10 bg-black flex items-center justify-center text-[#90FF90]">
									<Zap
										size={24}
										fill="currentColor"
									/>
								</div>
								<h2 className="text-3xl font-black uppercase tracking-tighter">
									BIT<span className="text-pink-500">.NOTES</span>
								</h2>
							</div>
						</div>

						{/* 3. Tactile Social Card */}
						<a
							href="https://www.instagram.com/hey_reactant/"
							target="_blank"
							className="group relative inline-block">
							<div className="absolute inset-0 bg-black translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
							<div className="relative bg-[#90FF90] border-4 border-black px-8 py-6 flex items-center gap-4 group-hover:-translate-x-2 group-hover:-translate-y-2 transition-transform">
								<div className="bg-black text-white p-2">
									<Instagram size={28} />
								</div>
								<div>
									<p className="text-[10px] font-black uppercase mono-font opacity-60">Visual_Log</p>
									<p className="text-xl font-black uppercase tracking-tight">@Hey_Reactant</p>
								</div>
								<ArrowUpRight
									className="ml-4 group-hover:rotate-45 transition-transform"
									size={24}
								/>
							</div>
						</a>
					</div>

					{/* 4. Bottom Metadata Bar */}
					<div className="mt-20 pt-8 border-t-4 border-black/10 flex flex-col md:flex-row justify-between items-center gap-4">
						<div className="flex items-center gap-6">
							<p className="mono-font text-[10px] font-black uppercase text-gray-400">© 2026 Collective_Notes_System</p>
							<div className="flex items-center gap-2">
								<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
								<span className="mono-font text-[9px] font-bold text-green-600 uppercase">System_Active</span>
							</div>
						</div>

						<div className="flex gap-4">
							{['Github'].map((link) => (
								<a
									key={link}
									href="https://github.com/Decarbo"
									className="mono-font text-[10px] font-black uppercase hover:text-pink-600 transition-colors">
									[{link}]
								</a>
							))}
						</div>
					</div>
				</div>
			</footer>
		</section>
	);
}
