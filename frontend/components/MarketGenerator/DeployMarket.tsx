import { useState, useEffect } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { ethers } from "ethers";
import {
	PREDICTION_MARKET_ABI,
	PREDICTION_MARKET_ADDRESS,
	MOCKED_USDC_ABI,
	MOCKED_USDC_ADDRESS,
} from "@/lib/ABI";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface DeployMarketProps {
	question: string;
	expirationDate: string;
	initialLiquidity: number; // 文字列から数値に変更
}

export default function DeployMarket({
	question,
	expirationDate,
	initialLiquidity,
}: DeployMarketProps) {
	const [status, setStatus] = useState("");
	const [isDeploying, setIsDeploying] = useState(false);
	const { primaryWallet } = useDynamicContext();

	const provider = new ethers.providers.Web3Provider(window?.ethereum as any);
	useEffect(() => {
		console.log("Primary Wallet:", primaryWallet);
	}, [primaryWallet, provider]);
	if (primaryWallet?.address) {
		console.log("Web3 Provider:", provider);
	}

	const approveUSDC = async (amount: number) => {
		// 文字列から数値に変更
		if (!primaryWallet || !provider) {
			console.log("ウォレットを接続してください");
			return;
		}

		try {
			const signer = provider.getSigner();
			const usdcContract = new ethers.Contract(
				MOCKED_USDC_ADDRESS,
				MOCKED_USDC_ABI,
				signer
			);

			const approvalAmount = ethers.utils
				.parseUnits(amount.toString(), 6)
				.mul(2);
			const tx = await usdcContract.approve(
				PREDICTION_MARKET_ADDRESS,
				approvalAmount
			);
			console.log("Approval transaction sent:", tx.hash);
			await tx.wait();
			console.log("USDC approved successfully!");
		} catch (error) {
			console.error("USDCの承認エラー:", error);
		}
	};

	const deployMarket = async () => {
		if (!primaryWallet || !provider) {
			setStatus("ウォレットを接続してください");
			return;
		}

		try {
			setIsDeploying(true);

			// 入力値のバリデーションを追加
			if (!question || question.trim() === "") {
				throw new Error("質問が入力されていません");
			}

			if (!expirationDate || isNaN(new Date(expirationDate).getTime())) {
				throw new Error("有効期限が無効です");
			}

			if (typeof initialLiquidity !== "number" || isNaN(initialLiquidity)) {
				throw new Error("初期流動性が無効です");
			}

			await approveUSDC(initialLiquidity);

			const signer = provider.getSigner();
			const contract = new ethers.Contract(
				PREDICTION_MARKET_ADDRESS,
				PREDICTION_MARKET_ABI,
				signer
			);

			const expirationTimestamp = Math.floor(
				new Date(expirationDate).getTime() / 1000
			);
			const liquidityAmount = ethers.utils.parseUnits(
				initialLiquidity.toString(),
				6
			);

			// デバッグ用のログ
			console.log("質問:", question);
			console.log("有効期限タイムスタンプ:", expirationTimestamp);
			console.log("初期流動性額:", liquidityAmount.toString());

			// ガス制限を手動で設定
			const gasLimit = await contract.estimateGas
				.createMarket(question, expirationTimestamp, liquidityAmount)
				.catch((error) => {
					console.error("ガス見積もりエラー:", error);
					return ethers.BigNumber.from(1000000);
				});

			setStatus("マーケットを作成中...");
			console.log("マーケットを作成中...");
			console.log(question);
			console.log(expirationTimestamp);
			console.log(liquidityAmount);
			console.log(gasLimit);
			const tx = await contract.createMarket(
				question,
				expirationTimestamp,
				liquidityAmount,
				{ gasLimit: gasLimit.mul(150).div(100) }
			);
			setStatus("トランザクションを送信しました。確認を待っています...");
			await tx.wait();
			setStatus("マーケットが正常に作成されました！");
		} catch (error) {
			console.error("マーケット作成エラー:", error);
			setStatus(`エラー: ${error.message}`);
		} finally {
			setIsDeploying(false);
		}
	};

	return (
		<div>
			<h2>マーケットをデプロイ</h2>
			{!primaryWallet || !provider ? (
				<p>マーケットをデプロイするにはウォレットを接続してください。</p>
			) : (
				<div>
					<p>質問: {question}</p>
					<p>有効期限: {new Date(expirationDate).toLocaleString()}</p>
					<p>初期流動性: {initialLiquidity}</p>
					<button onClick={deployMarket} disabled={isDeploying}>
						{isDeploying ? "デプロイ中..." : "マーケットをデプロイ"}
					</button>
				</div>
			)}
			{status && (
				<Alert className="mt-4">
					<AlertTitle>ステータス</AlertTitle>
					<AlertDescription>{status}</AlertDescription>
				</Alert>
			)}
		</div>
	);
}
