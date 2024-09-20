"use client";
import React from "react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Link from "next/link";
const ERC20_ABI = ["function balanceOf(address owner) view returns (uint256)"];
const tokenAddress = "0x6187d42265184Cc098AAC7D08aF6c1Dfae0877F2"; // ERC20トークンのアドレス

const Header = () => {
	const { primaryWallet } = useDynamicContext();
	const [balance, setBalance] = useState<string>("0");

	useEffect(() => {
		const fetchBalance = async () => {
			if (primaryWallet?.address) {
				const provider = new ethers.providers.Web3Provider(
					window?.ethereum as any
				);
				const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
				const balance = await contract.balanceOf(primaryWallet.address);
				setBalance(balance.toString()); // デシマルを18と仮定
			}
		};

		fetchBalance();
	}, [primaryWallet]);

	return (
		<header className="bg-gray-900 text-white shadow-lg">
			<div className="container mx-auto flex justify-between items-center py-4 px-6">
				<Link href="/">
					<div className="text-2xl font-bold tracking-tight">
						<span className="text-blue-400">Trend</span>Market
					</div>
				</Link>
				<nav className="flex items-center space-x-6">
					<a
						href="/portfolio"
						className="hover:text-blue-400 transition-colors font-bold"
					>
						Portfolio
					</a>
					<a>
						<DynamicWidget />
					</a>
				</nav>
			</div>
		</header>
	);
};

export default Header;
