'use client';

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const GumroadHero = () => {
	return (
		<div className="relative w-full bg-[#FF90E8] overflow-hidden selection:bg-black selection:text-[#FF90E8]">
			{/* Grid Background Effect */}
			<div
				className="absolute inset-0 z-0 opacity-20"
				style={{
					backgroundImage: `radial-gradient(#000 1.5px, transparent 1.5px)`,
					backgroundSize: '32px 32px',
				}}></div>

			<style
				jsx
				global>{`
				@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400;700;900&display=swap');

				.heading-font {
					font-family: 'Space Grotesk', sans-serif;
				}
				.brutal-shadow {
					box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
				}
				.brutal-shadow-sm {
					box-shadow: 4px 4px 0px 0px rgba(0, 0, 0, 1);
				}

				@keyframes marquee {
					0% {
						transform: translateX(0);
					}
					100% {
						transform: translateX(-50%);
					}
				}
				.animate-marquee {
					display: flex;
					width: 200%;
					animation: marquee 25s linear infinite;
				}
			`}</style>

			{/* Main Hero Section */}
			<section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-24 lg:pt-32 lg:pb-40 grid lg:grid-cols-2 gap-16 items-center">
				{/* Left Side: Content */}
				<div className="flex flex-col items-center lg:items-start text-center lg:text-left">
					<div className="bg-white border-2 border-black px-4 py-1 mb-8 brutal-shadow-sm -rotate-2 inline-block font-black text-sm uppercase tracking-widest">The #1 PDF Hub for Students</div>

					<h1 className="heading-font text-6xl md:text-8xl lg:text-[110px] font-black leading-[0.85] tracking-tighter text-black mb-8">
						DUMP YOUR <br />
						<span className="text-white drop-shadow-[6px_6px_0px_rgba(0,0,0,1)]">NOTES.</span> <br />
						GET AN <span className="bg-yellow-300 border-4 border-black px-2">A+</span>
					</h1>

					<p className="text-xl md:text-2xl font-bold text-black max-w-lg mb-12 leading-tight">The simplest way to share lecture PDFs, exam leaks, and study guides with your collage crew. No ads, no BS.</p>

					<div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
						<Link href="/upload">
							<button className="bg-[#90FF90] border-4 border-black px-10 py-6 text-2xl font-black heading-font brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase">Start Sharing</button>
						</Link>

						<Link
							href="/notes"
							className="bg-white border-4 border-black px-10 py-6 text-2xl font-black heading-font brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase">
							Browse Vault
						</Link>
					</div>
				</div>

				{/* Right Side: Visual Mockup */}
				<div className="relative group mx-auto lg:ml-auto">
					{/* Decorative Back Cards */}
					<div className="absolute top-4 left-4 w-full h-full bg-black border-4 border-black"></div>
					<div className="absolute -top-4 -left-4 w-full h-full bg-yellow-400 border-4 border-black"></div>

					<div className="relative bg-white border-4 border-black p-4 w-full max-w-sm sm:max-w-md">
						<div className="border-4 border-black bg-blue-100 aspect-square mb-6 overflow-hidden flex flex-col items-center justify-center relative group">
							<span className="text-9xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</span>
							<div className="absolute top-4 right-4 bg-red-500 text-white font-black px-3 py-1 border-2 border-black rotate-12">PDF</div>
							<div className="absolute bottom-4 left-4 right-4 bg-black/10 h-2 rounded-full overflow-hidden">
								<div className="bg-black h-full w-2/3"></div>
							</div>
						</div>

						<div className="space-y-4">
							<div className="flex justify-between items-start">
								<div>
									<h3 className="text-2xl font-black heading-font uppercase truncate max-w-[200px]">Advanced Physics II</h3>
									<p className="font-bold text-gray-600 italic">By Professor_Chaos</p>
								</div>
								<div className="text-right">
									<span className="bg-black text-[#90FF90] font-black px-2 py-1 border-2 border-black">FREE</span>
								</div>
							</div>

							<button className="w-full bg-black text-white py-5 font-black text-2xl border-2 border-black hover:bg-[#90FF90] hover:text-black transition-colors">DOWNLOAD NOW</button>
						</div>
					</div>

					{/* Floating Sticker */}
					<div className="absolute -bottom-10 -right-8 bg-orange-400 border-4 border-black p-4 rotate-6 brutal-shadow-sm hidden md:block">
						<p className="font-black text-center leading-none uppercase">
							10k+ Notes <br />
							Shared!
						</p>
					</div>
				</div>
			</section>

			{/* Marquee Footer */}
			<div className="bg-black text-white border-t-4 border-black py-8 relative z-20 overflow-hidden">
				<div className="animate-marquee whitespace-nowrap">
					{[...Array(8)].map((_, i) => (
						<div
							key={i}
							className="inline-flex items-center mx-12">
							<span className="text-3xl font-black heading-font uppercase">No more WhatsApp spam</span>
							<span className="mx-6 text-3xl">✦</span>
							<span className="text-3xl font-black heading-font uppercase text-yellow-300">Organized Folders</span>
							<span className="mx-6 text-3xl">✦</span>
							<span className="text-3xl font-black heading-font uppercase">PDFs Only</span>
							<span className="mx-6 text-3xl">✦</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default GumroadHero;
