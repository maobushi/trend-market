"use client";

import React, { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import Header from "@/components/Header/Header";

const ERC20_ABI = [
	"function balanceOf(address owner) view returns (uint256)",
	"function mint(address to, uint256 amount) returns (bool)",
];
const tokenAddress = "0x6187d42265184Cc098AAC7D08aF6c1Dfae0877F2";

const Portfolio = () => {
	const { primaryWallet } = useDynamicContext();
	const [balance, setBalance] = useState<string>("0");

	const fetchBalance = async () => {
		if (primaryWallet?.address) {
			const provider = new ethers.providers.Web3Provider(
				window?.ethereum as any
			);
			const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
			const balance = await contract.balanceOf(primaryWallet.address);
			setBalance(balance.toString());
		}
	};

	useEffect(() => {
		fetchBalance();
	}, [primaryWallet]);

	const claimMUSDC = async () => {
		if (primaryWallet?.address) {
			try {
				const provider = new ethers.providers.Web3Provider(
					window?.ethereum as any
				);
				await provider.send("eth_requestAccounts", []); // ウォレット接続を要求
				const signer = provider.getSigner();
				const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

				const amount = "100";
				const tx = await contract.mint(primaryWallet.address, amount);
				await tx.wait();
				alert("100 mUSDCが正常にミントされました！");
				fetchBalance();
			} catch (error) {
				console.error("mUSDCのミントに失敗しました:", error);
				alert(
					"mUSDCのミントに失敗しました。ウォレットが接続されていることを確認してください。"
				);
			}
		} else {
			alert("ウォレットが接続されていません。");
		}
	};

	const markets = [
		{ name: "BTC/mUSDC", yes: 50, no: 30 },
		{ name: "ETH/mUSDC", yes: 20, no: 40 },
		{ name: "SOL/mUSDC", yes: 10, no: 15 },
	];

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
						<p className="text-3xl font-semibold mb-4">{balance} mUSDC</p>
						<button
							onClick={claimMUSDC}
							className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-300 transform hover:scale-105 mb-4"
						>
							100 mUSDC をClaim
						</button>
						<button
							onClick={fetchBalance}
							className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300"
						>
							残高を更新
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Portfolio;
