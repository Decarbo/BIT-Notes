// src/app/page.tsx
'useClient';

import HowItWorks from './(howworks)/page';
import GumroadHero from './home/page';
import Navbar from './navbar/page';

export default function Page() {
	return (
		<>
			<GumroadHero />
			<HowItWorks />
		</>
	);
}
