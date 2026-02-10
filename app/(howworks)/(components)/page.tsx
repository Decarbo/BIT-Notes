'use client';

import { motion } from 'framer-motion';

interface ShimmerProps {
	width?: string;
	height?: string;
	className?: string;
	variant?: 'rect' | 'circle' | 'brutalist';
}

export default function Shimmer({ width = '100%', height = '20px', className = '', variant = 'rect' }: ShimmerProps) {
	// Brutalist variant mein hum borders aur shadows ka use karenge
	const isBrutalist = variant === 'brutalist';

	return (
		<div
			style={{ width, height }}
			className={`
        relative overflow-hidden bg-gray-200
        ${variant === 'circle' ? 'rounded-full' : 'rounded-none'}
        ${isBrutalist ? 'border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : ''}
        ${className}
      `}>
			{/* Shimmer Effect Overlay */}
			<div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/60 to-transparent shadow-2xl" />

			{/* Glassy Overlay for extra beauty */}
			<div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
		</div>
	);
}
