'use client';

import React from 'react';

/**
 * SHIMMER COMPONENT
 * A high-fidelity, neobrutalist skeleton loader.
 * Designed for the BIT.VAULT directory interface.
 */
export default function Shimmer() {
	return (
		<div className="w-full max-w-7xl mx-auto space-y-4 p-4 md:p-12 animate-in fade-in duration-500">
			{/* HEADER SHIMMER */}
			<div className="mb-10 space-y-4">
				<div className="h-4 w-32 bg-gray-200 border-2 border-black/5 skeleton-box overflow-hidden relative" />
				<div className="h-16 md:h-24 w-2/3 bg-gray-200 border-2 border-black/5 skeleton-box overflow-hidden relative" />
			</div>

			{/* SEARCH BAR SHIMMER */}
			<div className="h-20 w-full bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] skeleton-box overflow-hidden relative" />

			{/* LIST TABLE SHIMMER */}
			<div className="border-2 border-black bg-white divide-y-2 divide-black/10">
				{[...Array(6)].map((_, i) => (
					<div
						key={i}
						className="p-6 grid grid-cols-12 gap-4 items-center relative overflow-hidden"
						style={{ opacity: 1 - i * 0.15 }} // Fades out lower rows for a depth effect
					>
						{/* SCANLINE ANIMATION OVERLAY */}
						<div className="absolute inset-0 z-10 pointer-events-none shimmer-sweep" />

						{/* COL 1: STATUS ICON */}
						<div className="col-span-1 hidden lg:block">
							<div className="w-3 h-3 rounded-full bg-gray-200" />
						</div>

						{/* COL 2: TITLE & METADATA */}
						<div className="col-span-1 lg:col-span-4 space-y-2">
							<div className="h-5 w-3/4 bg-gray-200" />
							<div className="h-3 w-1/4 bg-gray-100" />
						</div>

						{/* COL 3: BRANCH TAG */}
						<div className="col-span-2 hidden lg:flex justify-center">
							<div className="h-6 w-16 bg-gray-100 border border-black/5" />
						</div>

						{/* COL 4: SUBJECT */}
						<div className="col-span-2 hidden lg:flex justify-center">
							<div className="h-4 w-24 bg-gray-100" />
						</div>

						{/* COL 5: ACTION BUTTON */}
						<div className="col-span-3 flex lg:justify-end">
							<div className="h-10 w-24 bg-gray-200 border-2 border-black/5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.03)]" />
						</div>
					</div>
				))}
			</div>

			{/* CSS FOR SCANLINE ANIMATION */}
			<style jsx>{`
				.skeleton-box {
					background-color: #f3f4f6;
				}

				.shimmer-sweep {
					background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%, transparent 100%);
					animation: sweep 1.5s infinite;
					background-size: 200% 100%;
				}

				@keyframes sweep {
					0% {
						background-position: 200% 0;
					}
					100% {
						background-position: -200% 0;
					}
				}

				/* Subtle scale pulsing for the entire row */
				.skeleton-row {
					animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
				}

				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.7;
					}
				}
			`}</style>
		</div>
	);
}
