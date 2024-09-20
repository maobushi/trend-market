import React from "react";

const Header = () => {
	return (
		<header className="bg-gray-900 text-white shadow-lg">
			<div className="container mx-auto flex justify-between items-center py-4 px-6">
				<div className="text-2xl font-bold tracking-tight">
					<span className="text-blue-400">Trend</span>Market
				</div>
				<nav className="flex items-center space-x-6">
					<a href="#" className="hover:text-blue-400 transition-colors">
						ホーム
					</a>
					<a href="#" className="hover:text-blue-400 transition-colors">
						マーケット
					</a>
					<a href="#" className="hover:text-blue-400 transition-colors">
						ポートフォリオ
					</a>
					<w3m-button />
				</nav>
			</div>
		</header>
	);
};

export default Header;
