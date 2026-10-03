import { useState } from "react";
import { Link } from "react-router-dom";

const navigation = [
	{ label: "Services", path: "/services" },
	{ label: "Products", path: "/products" },
	{ label: "About", path: "/about" },
	{ label: "Careers", path: "/careers" },
	{ label: "Contact", path: "/contact" },
];

export default function MobileMenu() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="mobile-menu">
			<button
				className="mobile-menu__toggle"
				type="button"
				aria-label={isOpen ? "Close navigation" : "Open navigation"}
				aria-expanded={isOpen}
				aria-controls="mobile-navigation"
				onClick={() => setIsOpen(!isOpen)}
			>
				<span />
				<span />
			</button>
			<nav
				className="mobile-menu__panel"
				id="mobile-navigation"
				aria-label="Mobile navigation"
				hidden={!isOpen}
			>
				{navigation.map((item) => (
					<Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}>
						{item.label}
					</Link>
				))}
			</nav>
		</div>
	);
}
