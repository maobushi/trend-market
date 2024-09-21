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
	const [isGenerating, setIsGenerating] = useState(false);
	const [isDeploying, setIsDeploying] = useState(false);
	const [markets, setMarkets] = useState<MarketItem[]>([]);
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
		setIsGenerating(true);
		setError(null);
		try {
			if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
				throw new Error("A valid Ethereum wallet is not connected.");
			}

			const walletClient = await primaryWallet.getWalletClient();
			if (!walletClient) {
				throw new Error("Failed to retrieve wallet client.");
			}

			const publicClient = await primaryWallet.getPublicClient();
			if (!publicClient) {
				throw new Error("Failed to retrieve public client.");
			}

			// Verify network
			const chainId = await walletClient.getChainId();
			if (chainId !== 11155111) {
				// Sepolia chain ID
				throw new Error("Please switch to the Sepolia test network.");
			}

			const transaction = {
				to: "0x73C4a0309E1955074fF5728c0f196b8F295a952d",
				value: parseUnits("0.01", 6), // Assuming mUSDC has 6 decimal places
				chain: { id: chainId }, // Add chain information
			};

			const hash = await walletClient.sendTransaction(transaction);
			setFeeTxHash(hash);

			// Wait for transaction confirmation
			const receipt = await publicClient.waitForTransactionReceipt({
				hash,
				timeout: 60_000, // 60 seconds timeout
			});

			console.log("Transaction receipt:", receipt);

			// Call backend API to generate markets using LLM
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

			console.log("API response:", data); // For debugging

			if (data.message && data.message.content) {
				try {
					// Clean up JSON data and parse
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
			console.error("Error occurred while generating markets:", error);
			setMarkets([]);
			setError(
				error instanceof Error ? error.message : "An unknown error occurred."
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const deployMarket = async () => {
		setIsDeploying(true);
		setError(null);
		try {
			if (!primaryWallet || !isEthereumWallet(primaryWallet)) {
				throw new Error("A valid Ethereum wallet is not connected.");
			}

			const walletClient = await primaryWallet.getWalletClient();
			if (!walletClient) {
				throw new Error("Failed to retrieve wallet client.");
			}

			// Verify network
			const chainId = await walletClient.getChainId();
			if (chainId !== 11155111) {
				// Sepolia chain ID
				throw new Error("Please switch to the Sepolia test network.");
			}

			// Throw error if markets are empty
			if (!markets || markets.length === 0) {
				throw new Error(
					"Markets have not been generated. Please generate markets first."
				);
			}

			// Use the first market
			const marketToDeploy = markets[0];

			// Set smart contract address and ABI
			const contractAddress = PREDICTION_MARKET_ADDRESS; // Deployed contract address
			const contractABI = PREDICTION_MARKET_ABI;

			// Create contract instance
			const contract = new ethers.Contract(
				contractAddress,
				contractABI,
				signer
			);

			// Calculate deadline (e.g., 30 days from now)
			const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;

			// Set initialLiquidity to a fixed value (e.g., 100)
			const initialLiquidity = 100;
			console.log("Deploying market");
			console.log(marketToDeploy);

			// Increase gas limit
			const gasLimit = 2000000; // Increased from 1000000 to 2000000

			// Deploy the market
			const tx = await contract.createMarket(
				marketToDeploy.title,
				deadline,
				initialLiquidity.toString(),
				{ gasLimit: gasLimit }
			);

			// Log transaction details
			console.log("Transaction details:", tx);

			setDeployTxHash(tx.hash);

			// Wait for transaction confirmation
			const receipt = await tx.wait();

			// Log receipt details
			console.log("Transaction receipt:", receipt);

			if (receipt.status === 0) {
				throw new Error("Transaction failed.");
			}

			console.log("Market deployed successfully");
			setDeployedMarketIndex(0); // Record that the first market has been deployed
		} catch (error) {
			console.error("Error occurred while deploying market:", error);
			// Retrieve detailed error information
			if (error.transaction) {
				console.error("Transaction details:", error.transaction);
			}
			if (error.receipt) {
				console.error("Receipt details:", error.receipt);
			}
			setError(
				error instanceof Error ? error.message : "An unknown error occurred."
			);
		} finally {
			setIsDeploying(false);
		}
	};

	return (
		<div className="bg-gray-900 shadow-2xl rounded-lg overflow-hidden border border-gray-700 p-8">
			<h2 className="text-3xl font-bold mb-6 text-white">Generate Market</h2>
			<div className="flex space-x-4 mb-6">
				<button
					onClick={generateMarkets}
					disabled={isGenerating || isDeploying}
					className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
				>
					{isGenerating ? "Generating..." : "Generate Market"}
				</button>
				<button
					onClick={deployMarket}
					disabled={isDeploying || isGenerating || !markets.length}
					className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out flex-1"
				>
					{isDeploying ? "Deploying..." : "Deploy Market"}
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
						Transaction Information:
					</h3>
					{feeTxHash && (
						<p className="text-green-400 mb-2">
							Fee Payment:{" "}
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
							Market Deployment:{" "}
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
						Generated Markets:
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