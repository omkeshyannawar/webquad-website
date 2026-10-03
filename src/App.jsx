import Navbar from "./components/navigation/Navbar";
import Hero from './pages/Home/sections/Hero/Hero';
import WhatWeBuild from './pages/Home/sections/WhatWeBuild/WhatWeBuild';

export default function App() {
	return (
		<>
			<Navbar />
            <Hero/>
            <WhatWeBuild/>
			
		</>
	);
}
