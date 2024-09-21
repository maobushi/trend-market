"use client";
import React, { useState } from "react";
import Header from "@/components/Header/Header";
import { ethers } from "ethers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import {
	PREDICTION_MARKET_ADDRESS,
	PREDICTION_MARKET_ABI,
	MOCKED_USDC_ADDRESS,
	MOCKED_USDC_ABI,
} from "@/lib/ABI";
const PredictionMarketCreator = () => {
	const [question, setQuestion] = useState("");
	const [expirationTime, setExpirationTime] = useState("");
	const [initialLiquidity, setInitialLiquidity] = useState("");
	const [status, setStatus] = useState("");

	const provider = new ethers.providers.Web3Provider(window?.ethereum as any);

	const handleCreateMarket = async () => {
		if (!provider) {
			setStatus("ウォレットを先に接続してください。");
			return;
		}

		try {
			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				PREDICTION_MARKET_ADDRESS,
				PREDICTION_MARKET_ABI,
				signer
			);

			// 有効な日時文字列であることを確認
			if (isNaN(Date.parse(expirationTime))) {
				throw new Error("無効な日時形式です。");
			}

			const expirationTimestamp = Math.floor(
				new Date(expirationTime).getTime() / 1000
			);
			const liquidityInWei = ethers.utils.parseUnits(initialLiquidity, 6);

			// USDCの承認（必要な場合）
			const usdcContract = new ethers.Contract(
				MOCKED_USDC_ADDRESS,
				MOCKED_USDC_ABI,
				signer
			);
			const approveTx = await usdcContract.approve(
				PREDICTION_MARKET_ADDRESS,
				liquidityInWei
			);
			await approveTx.wait();

			// ガス制限を手動で設定
			const gasLimit = await contract.estimateGas
				.createMarket(question, expirationTimestamp, liquidityInWei)
				.catch((error) => {
					console.error("ガス見積もりエラー:", error);
					return ethers.BigNumber.from(1000000); // フォールバックのガス制限を増やす
				});

			const tx = await contract.createMarket(
				question,
				expirationTimestamp,
				liquidityInWei,
				{ gasLimit: gasLimit.mul(150).div(100) } // 50%のバッファを追加
			);
			setStatus("トランザクションを送信しました。確認を待っています...");

			const receipt = await tx.wait();
			if (receipt.status === 0) {
				throw new Error("トランザクションが失敗しました。");
			}
			setStatus("マーケットが正常に作成されました！");
		} catch (error) {
			console.error("詳細なエラー:", error);
			setStatus(`エラー: ${error.message}`);
		}
	};

	return (
		<>
			<Header />
			<div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
				<h2 className="text-2xl font-bold mb-4">Create Prediction Market</h2>
				<div className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Question
						</label>
						<input
							type="text"
							value={question}
							onChange={(e) => setQuestion(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Expiration Time
						</label>
						<input
							type="datetime-local"
							value={expirationTime}
							onChange={(e) => setExpirationTime(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Initial Liquidity (USDC)
						</label>
						<input
							type="number"
							value={initialLiquidity}
							onChange={(e) => setInitialLiquidity(e.target.value)}
							className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
						/>
					</div>
					<button
						onClick={handleCreateMarket}
						className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						Create Market
					</button>
				</div>
				{status && (
					<Alert className="mt-4">
						<AlertTitle>Status</AlertTitle>
						<AlertDescription>{status}</AlertDescription>
					</Alert>
				)}
			</div>
		</>
	);
};

export default PredictionMarketCreator;
