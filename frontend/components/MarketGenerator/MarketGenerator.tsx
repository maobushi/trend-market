"use client";
import React, { useState } from "react";
import { parseUnits } from "viem";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { isEthereumWallet } from "@dynamic-labs/ethereum";
import { ethers } from "ethers";
interface MarketGeneratorProps {
	title: string;
	description: string;
	provider: string;
	provider_link: string;
	published_at: string;
	category: string;
}
import { PREDICTION_MARKET_ABI, PREDICTION_MARKET_ADDRESS } from "@/lib/ABI";

import { MarketItem } from "@/components/MarketGenerator/MarketItem";

interface MarketItem {
	title: string;
	initialLiquidity: number;
	contract_id: number;
	description: string;
	category: string;
	deadline: number;
	yesPrice: number;
	noPrice: number;
	attention: number;
	volume: number;
	providers: { name: string; link: string; iconPath: string }[];
	oracles: { name: string; link: string; iconPath: string }[];
}

const MarketGenerator: React.FC<MarketGeneratorProps> = ({
	title,
	description,
	provider,
	provider_link,
	published_at,
	category,
}) => {
	const [markets, setMarkets] = useState<MarketItem[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [feeTxHash, setFeeTxHash] = useState("");
	const [deployTxHash, setDeployTxHash] = useState("");
	const { primaryWallet, network } = useDynamicContext();
	const [error, setError] = useState<string | null>(null);
	const [deployedMarketIndex, setDeployedMarketIndex] = useState<number | null>(
		null
	);

	console.log("Primary Wallet:", primaryWallet);
	console.log("Connected Network:", network);

	const provider_c = new ethers.providers.Web3Provider(window?.ethereum as any);
	const signer = provider_c.getSigner();
	const contract = new ethers.Contract(
		PREDICTION_MARKET_ADDRESS,
		PREDICTION_MARKET_ABI,
		signer
	);
	const generateMarkets = async () => {
		setIsLoading(true);
		setError(null);
		try {
			if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
				throw new Error("有効なEthereumウォレットが接続されていません。");
			}

			const walletClient = await primaryWallet.getWalletClient();
			if (!walletClient) {
				throw new Error("ウォレットクライアントの取得に失敗しました。");
			}

			const publicClient = await primaryWallet.getPublicClient();
			if (!publicClient) {
				throw new Error("パブリッククライアントの取得に失敗しました。");
			}

			// ネットワークの確認
			const chainId = await walletClient.getChainId();
			if (chainId !== 11155111) {
				// SepoliaのチェーンID
				throw new Error("SepoliaテストネットワークにSwitchしてください。");
			}

			const transaction = {
				to: "0x73C4a0309E1955074fF5728c0f196b8F295a952d",
				value: parseUnits("0.01", 6), // mUSDCは6桁の精度を持つと仮定
				chain: { id: chainId }, // チェーン情報を追加
			};

			const hash = await walletClient.sendTransaction(transaction);
			setFeeTxHash(hash);

			// トランザクションの確認を待つ
			const receipt = await publicClient.waitForTransactionReceipt({
				hash,
				timeout: 60_000, // 60秒のタイムアウト
			});

			console.log("Transaction receipt:", receipt);

			// ここでバックエンドAPIを呼び出し、LLMを使用してマーケットを生成します
			const response = await fetch("/api/llm", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					systemMessage: `
                    # Prediction Market Generation Prompt

                    Please generate 3 prediction markets that can be clearly judged by an LLM (Large Language Model) reading relevant news at a later date. Adhere to the following conditions:
                    
                    ## Essential Requirements
                    
                    1. **Verifiability**
                       - Generate only markets that an LLM can clearly judge by reading related news at a later date
                    
                    2. **Time Frame**
                       - Set the judgment period between 1 to 365 days
                       - set the deadline as a number of UNIX timestamp
                       - Example: Not "Will Russia invade Ukraine?" but "Will Russia invade Ukraine within the next six months?"
                    
                    3. **Judgment Format**
                       - The judgment should be binary: "Yes" or "No"
                    
                    4. **Diversity**
                       - Generate markets from a wide range of fields, including politics, economy, technology, entertainment, etc.
                       - Include not only general topics but also gossip and interesting predictions
                    
                    5. **Specificity**
                       - Avoid vague expressions and include specific conditions or numerical values
                       - Example: Not "Will Company X's stock price rise?" but "Will Company X's stock price rise by more than 20% from its current value within 3 months?"
                    
                    6. **Oracle and Provider**
                    - Oracle is a provider of information that can be used to judge the market.
                    - Provider is a provider of information that can be used to judge the market.
                    - multiple oracle and provider is possible.
                       - Oracle example : [{"name": "Chainlink", "link": "https://chainlink.com", "iconPath": "/oracleprovider/Chainlink.png"}, {"name": "Band Protocol", "link": "https://bandprotocol.com", "iconPath": "/oracleprovider/BandProtocol.png"}, {"name": "OpenSea", "link": "https://opensea.io", "iconPath": "/oracleprovider/OpenSea.png"}]
                       - Provider example : [{"name": "Coinbase", "link": "https://coinbase.com", "iconPath": "/oracleprovider/Coinbase.png"}, {"name": "NewYorkTimes", "link": "https://www.nytimes.com", "iconPath": "/newsprovider/TheNewYorkTimes.png"}, {"name": "OpenSea", "link": "https://opensea.io", "iconPath": "/oracleprovider/OpenSea.png"}, {"name": "Coinbase", "link": "https://coinbase.com", "iconPath": "/newsprovider/Coinbase.png"}, {"name": "CNN", "link": "https://www.cnn.com", "iconPath": "/newsprovider/CNN.png"}, {"name": "FoxNews", "link": "https://www.foxnews.com", "iconPath": "/newsprovider/FoxNews.png"}, {"name": "Bloomberg", "link": "https://www.bloomberg.com", "iconPath": "/newsprovider/Bloomberg.png"}, {"name": "Reuters", "link": "https://www.reuters.com", "iconPath": "/newsprovider/Reuters.png"}, {"name": "CNBC", "link": "https://www.cnbc.com", "iconPath": "/newsprovider/CNBC.png"}]
                    
                    7. **price and attention and volume**
                       - The price should be a number of 50.
                       
                    8. **Output Format**
                    dont include any other text than the JSON object.
                    Output each market as a one JSON object, including the following elements:
                    
                    {
                      "title": string,
                      "initialLiquidity": number,
                      "description": string,
                      "category": string,
                      "deadline": number,
                      "yesPrice": number,
                      "noPrice": number,
                      "attention": number,
                      "volume": number,
                      "providers": [
                        {
                          "name": string,
                          "link": string,
                          "iconPath": string
                        }
                      ],
                      "oracles": [
                        {
                          "name": string,
                          "link": string,
                          "iconPath": string
                        }
                      ]
                    }
                    
                    `,
					userMessage: `
                    Generate markets based on the following news item:
                    title: ${title}
                    description: ${description}
                    provider: ${provider}
                    provider_link: ${provider_link}
                    published_at: ${published_at}
                    category: ${category}
                    `,
				}),
			});
			const data = await response.json();

			console.log("API response:", data); // デバッグ用

			if (data.message && data.message.content) {
				try {
					// JSONデータをクリーンアップして解析
					const cleanedContent = data.message.content.trim();
					const parsedMarkets = JSON.parse(
						`[${cleanedContent.replace(/}\s*{/g, "},{")}]`
					);
					if (Array.isArray(parsedMarkets)) {
						setMarkets(parsedMarkets);
					} else {
						console.error("Parsed data is not an array:", parsedMarkets);
						setMarkets([]);
					}
					console.log(parsedMarkets);
				} catch (parseError) {
					console.error("Failed to parse JSON:", parseError);
					setMarkets([]);
				}
			} else {
				console.error("No valid data returned:", data);
				setMarkets([]);
			}
		} catch (error) {
			console.error("マーケット生成中にエラーが発生しました:", error);
			setMarkets([]);
			setError(
				error instanceof Error ? error.message : "不明なエラーが発生しました。"
			);
		} finally {
			setIsLoading(false);
		}
	};

	const deployMarket = async () => {
		setIsLoading(true);
		setError(null);
		try {
			if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
				throw new Error("有効なEthereumウォレットが接続されていません。");
			}

			const walletClient = await primaryWallet.getWalletClient();
			if (!walletClient) {
				throw new Error("ウォレットクライアントの取得に失敗しました。");
			}

			// ネットワークの確認
			const chainId = await walletClient.getChainId();
			if (chainId !== 11155111) {
				// SepoliaのチェーンID
				throw new Error("SepoliaテストネットワークにSwitchしてください。");
			}

			// markets が空の場合はエラーを投げる
			if (!markets || markets.length === 0) {
				throw new Error(
					"マーケットが生成されていません。先にマーケットを生成してください。"
				);
			}

			// 最初のマーケットを使用
			const marketToDeploy = markets[0];

			// ス���ートコントラクトのアドレスとABIを設定
			const contractAddress = PREDICTION_MARKET_ADDRESS; // デプロイされたコントラクトのアドレス
			const contractABI = PREDICTION_MARKET_ABI;

			// コントラクトインスタンスの作成
			const contract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			// deadlineを計算（例：現在から30日後）
			const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

			// initialLiquidityを固定値として設定（例：100）
			const initialLiquidity = 100;
			console.log("マーケットのデプロイis");
			console.log(marketToDeploy);

			// ガス制限をさらに増やす
			const gasLimit = 2000000; // 1000000から2000000に増加

			// マーケットのデプロイ
			const tx = await contract.createMarket(
				marketToDeploy.title,
				deadline,
				initialLiquidity.toString(),
				{ gasLimit: gasLimit }
			);

			// トランザクションの詳細をログに出力
			console.log("トランザクション詳細:", tx);

			setDeployTxHash(tx.hash);

			// トランザクションの確認を待つ
			const receipt = await tx.wait();

			// レシートの詳細をログに出力
			console.log("トランザクションレシート:", receipt);

			if (receipt.status === 0) {
				throw new Error("トランザクションが失敗しました。");
			}

			console.log("マーケットが正常にデプロイされました");
			setDeployedMarketIndex(0); // 最初のマーケットがデプロイされたことを記録
		} catch (error) {
			console.error("マーケットのデプロイ中にエラーが発生しました:", error);
			// エラーの詳細情報を取得
			if (error.transaction) {
				console.error("トランザクション詳細:", error.transaction);
			}
			if (error.receipt) {
				console.error("レシート詳細:", error.receipt);
			}
			setError(
				error instanceof Error ? error.message : "不明なエラーが発生しました。"
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="bg-gray-900 shadow-2xl rounded-lg overflow-hidden border border-gray-700 p-8">
			<h2 className="text-3xl font-bold mb-6 text-white">マーケットを生成</h2>
			<div className="flex space-x-4 mb-6">
				<button
					onClick={generateMarkets}
					disabled={isLoading}
					className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
				>
					{isLoading ? "生成中..." : "マーケットを生成"}
				</button>
				<button
					onClick={deployMarket}
					disabled={isLoading || !markets.length}
					className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
				>
					{isLoading ? "デプロイ中..." : "マーケットをデプロイ"}
				</button>
			</div>
			{error && (
				<p className="mt-4 text-red-500 bg-red-100 border border-red-400 rounded p-3">
					{error}
				</p>
			)}
			{(feeTxHash || deployTxHash) && (
				<div className="mt-6 bg-gray-800 rounded-lg p-4">
					<h3 className="text-xl font-semibold mb-3 text-white">
						トランザクション情報:
					</h3>
					{feeTxHash && (
						<p className="text-green-400 mb-2">
							Fee支払い:{" "}
							<a
								href={`https://sepolia.etherscan.io/tx/${feeTxHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-green-300"
							>
								{feeTxHash}
							</a>
						</p>
					)}
					{deployTxHash && (
						<p className="text-blue-400">
							マーケットデプロイ:{" "}
							<a
								href={`https://sepolia.etherscan.io/tx/${deployTxHash}`}
								target="_blank"
								rel="noopener noreferrer"
								className="underline hover:text-blue-300"
							>
								{deployTxHash}
							</a>
						</p>
					)}
				</div>
			)}
			{markets && markets.length > 0 && (
				<div className="mt-6">
					<h3 className="text-xl font-semibold mb-2 text-white">
						生成されたマーケット:
					</h3>
					<ul className="list-disc list-inside">
						{markets.map((market, index) => (
							<MarketItem
								key={index}
								contract_id={index}
								title={market.title}
								initialLiquidity={market.initialLiquidity}
								description={market.description}
								category={market.category}
								deadline={market.deadline}
								yesPrice={market.yesPrice}
								noPrice={market.noPrice}
								attention={market.attention}
								volume={market.volume}
								providers={market.providers}
								oracles={market.oracles}
								deployedTxHash={
									index === deployedMarketIndex ? deployTxHash : undefined
								}
							/>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default MarketGenerator;
