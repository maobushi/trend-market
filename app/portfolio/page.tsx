"use client";
import React from "react";
import Header from "@/components/Header/Header";

const Portfolio = () => {
	const [mUsdcBalance, setMUsdcBalance] = React.useState(1000.5);
	const markets = [
		{ name: "BTC/mUSDC", yes: 50, no: 30 },
		{ name: "ETH/mUSDC", yes: 20, no: 40 },
		{ name: "SOL/mUSDC", yes: 10, no: 15 },
	];

	const handleClaim = () => {
		setMUsdcBalance((prevBalance) => prevBalance + 100);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
			<Header />
			<div className="container mx-auto p-8">
				<h1 className="text-4xl font-bold mb-8">ポートフォリオ</h1>
				<div className="flex flex-col md:flex-row gap-8">
					<div className="flex-1 bg-gray-800 rounded-lg p-6 shadow-lg">
						<h2 className="text-2xl mb-4">参加中のマーケット</h2>
						<div className="space-y-4">
							{markets.map((market, index) => (
								<div
									key={index}
									className="bg-gray-700 rounded-lg p-4 transition-all hover:shadow-md hover:scale-105"
								>
									<h3 className="text-xl font-semibold mb-2">{market.name}</h3>
									<div className="flex justify-between">
										<p className="text-green-400">Yes: {market.yes}</p>
										<p className="text-red-400">No: {market.no}</p>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="md:w-1/3 bg-gray-800 rounded-lg p-6 shadow-lg">
						<h2 className="text-2xl mb-4">mUSDC残高</h2>
						<p className="text-3xl font-semibold mb-4">
							{mUsdcBalance.toFixed(2)} mUSDC
						</p>
						<button
							onClick={handleClaim}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300 transform hover:scale-105"
						>
							100 mUSDC をClaim
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Portfolio;
