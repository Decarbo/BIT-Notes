'use client';

import React from 'react';
import { UserPlus, FileUp, Layers, Share2, AlertCircle } from 'lucide-react';

const steps = [
	{
		id: '01',
		label: 'SIGN UP',
		title: 'Build Your Identity',
		description: 'Join the ecosystem. Activate your account with a single email and start building your Community Karma profile.',
		icon: <UserPlus size={32} />,
		color: 'bg-[#FF90E8]', // Gumroad Pink
	},
	{
		id: '02',
		label: 'DRAG & DROP',
		title: 'The Smart Drop',
		description: 'Throw your PDFs into the vault. Our engine reads the file and auto-suggests the Subject and Chapter for you.',
		icon: <FileUp size={32} />,
		color: 'bg-[#90FF90]', // Mint Green
	},
	{
		id: '03',
		label: 'ORGANIZE',
		title: 'Vaulted & Secured',
		description: 'Files are encrypted in our community storage. Metadata is indexed so your notes are searchable forever.',
		icon: <Layers size={32} />,
		color: 'bg-yellow-300', // Cyber Yellow
	},
	{
		id: '04',
		label: 'DISCOVER',
		title: 'Search & Conquer',
		description: 'Filter by Branch, Subject, or Tags. Find exactly what you need in seconds without the WhatsApp noise.',
		icon: <Share2 size={32} />,
		color: 'bg-blue-400', // Sky Blue
	},
];

export default function HowItWorks() {
	return (
		<section className="bg-[#F0F0F0] py-24 px-6 border-t-4 border-black font-sans">
			<div className="max-w-7xl mx-auto">
				{/* Header Section */}
				<div className="text-center mb-20">
					<h2
						className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6"
						style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
						HOW IT <span className="bg-black text-[#90FF90] px-4">WORKS</span>
					</h2>
					<p className="text-xl md:text-2xl font-bold text-gray-700 max-w-2xl mx-auto">Direct, bold, and action-oriented. Share knowledge in four simple steps.</p>
				</div>

				{/* Steps Grid */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
					{steps.map((step, index) => (
						<div
							key={index}
							className={`relative ${step.color} border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group`}>
							{/* Floating ID Tag */}
							<div className="absolute -top-6 -right-4 bg-white border-4 border-black px-3 py-1 font-black text-2xl rotate-6 group-hover:rotate-0 transition-transform">{step.id}</div>

							{/* Icon Container */}
							<div className="mb-6 bg-white border-2 border-black w-fit p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-black">{step.icon}</div>

							<h3 className="text-xs font-black tracking-widest uppercase mb-2 text-black/60">{step.label}</h3>
							<h4 className="text-2xl font-black mb-4 uppercase leading-none text-black">{step.title}</h4>
							<p className="font-bold leading-tight text-black/80">{step.description}</p>
						</div>
					))}
				</div>

				{/* Vault Rules & Pro-Tips Section */}
				<div className="bg-black text-white p-8 md:p-12 border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,144,232,1)] relative overflow-hidden">
					<div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
						<AlertCircle size={150} />
					</div>

					<div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
						<div className="flex-1 text-center md:text-left">
							<h3
								className="text-4xl font-black mb-4 text-yellow-300 uppercase italic"
								style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
								Vault Rules & Pro-Tips
							</h3>
							<p className="text-lg font-bold text-gray-400 italic">Keep the system clean. Follow the protocols:</p>
						</div>

						<div className="flex-1 grid gap-4 w-full">
							{[
								{ rule: '01', text: 'Only PDF files allowed. No images or docs.' },
								{ rule: '02', text: 'Maximum file size: 50MB per upload.' },
								{ rule: '03', text: 'No spam, duplicate, or empty documents.' },
							].map((item, i) => (
								<div
									key={i}
									className="bg-white/5 border-2 border-white/20 p-4 flex items-center gap-4 hover:bg-white/10 transition-colors">
									<span className="bg-[#FF90E8] text-black px-2 py-1 font-black text-xs">{item.rule}</span>
									<p className="font-bold text-sm md:text-base">{item.text}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
