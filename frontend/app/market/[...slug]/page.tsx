"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { ClockIcon, TagIcon, UsersIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { ProviderIcon } from "@/components/Body/Body";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";

import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "@/app/actions/verify";

export default function Page({ params }: { params: { slug: string } }) {
	const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
	const action = process.env.NEXT_PUBLIC_WLD_ACTION;

	if (!app_id) {
		throw new Error("app_id is not set in environment variables!");
	}
	if (!action) {
		throw new Error("action is not set in environment variables!");
	}

	const { setOpen } = useIDKit();

	const [isVerified, setIsVerified] = useState(false);

	const onSuccess = (result: ISuccessResult) => {
		setIsVerified(true);
		window.alert(
			"World IDでの認証に成功しました！あなたのnullifierハッシュは: " +
				result.nullifier_hash
		);
	};

	const handleProof = async (result: ISuccessResult) => {
		console.log(
			"IDKitから受け取ったプルーフをバックエンドに送信します:\n",
			JSON.stringify(result)
		);
		const data = await verify(result);
		if (data.success) {
			console.log("バックエンドからの成功レスポンス:\n", JSON.stringify(data));
			setIsVerified(true);
		} else {
			throw new Error(`認証に失敗しました: ${data.detail}`);
		}
	};

	const [marketData, setMarketData] = useState({
		title: "Will Intel confirm a sale to Qualcomm by the end of the year?",
		description:
			"Will Intel confirm a sale to Qualcomm by 23:59 on December 31, 2023?",
		deadline: 1704086399,
		category: "Technology",
		attention: "50",
		volume: "50",
		yesPrice: 0.5,
		noPrice: 0.5,
		yesPercentage: 50.0,
		noPercentage: 50.0,
		providers: [
			{
				name: "TheNewYorkTimes",
				link: "https://www.nytimes.com/",
				iconPath: "/newsprovider/TheNewYorkTimes.png",
			},
			{
				name: "Reuters",
				link: "https://www.reuters.com/",
				iconPath: "/newsprovider/Reuters.png",
			},
		],
		oracles: [
			{
				name: "Chainlink",
				link: "https://chainlink.com/",
				iconPath: "/oracleprovider/Chainlink.png",
			},
		],
	});

	const [llmOpinions, setLlmOpinions] = useState<
		Array<{
			llm: string;
			opinions: string[];
			conclusion: "Approve" | "Reject" | "Undecided" | null;
		}>
	>([
		{ llm: "GPT-4", opinions: [], conclusion: null },
		{ llm: "Claude", opinions: [], conclusion: null },
		{ llm: "Gemini", opinions: [], conclusion: null },
	]);
	const [discussionProgress, setDiscussionProgress] = useState(0);
	const [isDiscussionExpanded, setIsDiscussionExpanded] = useState(true);

	const generateLLMOpinion = (llm: string, round: number) => {
		const dummyOpinions = {
			"GPT-4": [
				"According to the latest report from NewsProviderX, there are rumors of acquisition negotiations between Qualcomm and Intel. However, there has been no official announcement so far. With just over three months left until the end of the year, completing such a large transaction in a short period would be challenging.",
				"An article reported by Reuters last week states that both Intel and Qualcomm are exploring the possibility of a strategic partnership. However, there is no mention of a full acquisition. It is difficult to see the acquisition being completed within the year.",
				"According to the latest analysis by TheNewYorkTimes, the semiconductor industry is undergoing reorganization, but there are no specific movements between Intel and Qualcomm. It is premature to predict the acquisition being completed by the end of the year at this point.",
			],
			Claude: [
				"Qualcomm's stock price is stable, and there have been no significant fluctuations in Intel's stock price either. This suggests that the market does not anticipate a large-scale transaction between the two companies. The possibility of completing the acquisition within the year is low.",
				"According to the latest information from industry insiders, Intel and Qualcomm appear to be discussing technical cooperation, but there are no specific negotiations regarding an acquisition. Completing the transaction within the year is highly unlikely.",
				"According to the latest oracle data from Chainlink, there are no Intel and Qualcomm transactions included in the ongoing M&A deals in the semiconductor industry. It is difficult to predict the acquisition being completed by the end of the year at this time.",
			],
			Gemini: [
				"The latest reports from technology media mention the possibility of collaboration between Intel and Qualcomm, but there is no specific information regarding an acquisition. At this point, the likelihood of completing the transaction within the year is very low.",
				"According to the latest market analysis from OracleProviderB, the average preparation period for large M&A deals in the semiconductor industry is 12 to 18 months. Given the absence of an official announcement, completing the transaction in the remaining three months is not realistic.",
				"Looking at recent trends from regulatory authorities, the scrutiny of mergers between large tech companies has become more stringent. Even if negotiations were underway, obtaining approval by the end of the year would be extremely difficult. At this point, the possibility of completing the transaction within the year is very low.",
			],
		};

		return dummyOpinions[llm as keyof typeof dummyOpinions][round];
	};

	const advanceDiscussion = useCallback(() => {
		setDiscussionProgress((prevProgress) => {
			console.log("Current Progress:", prevProgress);
			if (prevProgress < 9) {
				const newOpinions = llmOpinions.map((llm) => {
					const round = Math.floor(prevProgress / 3);
					if (prevProgress % 3 === 0) {
						const newOpinion = generateLLMOpinion(llm.llm, round);
						console.log(`${llm.llm} - Round ${round + 1}: ${newOpinion}`);
						return {
							...llm,
							opinions: [...llm.opinions, newOpinion],
						};
					}
					return llm;
				});
				setLlmOpinions(newOpinions);
				return prevProgress + 1;
			} else if (prevProgress === 9) {
				const finalOpinions = llmOpinions.map((llm) => {
					const approveCount = llm.opinions.filter((op) =>
						op.includes("Approve")
					).length;
					const rejectCount = llm.opinions.filter((op) =>
						op.includes("Reject")
					).length;
					let conclusion: "Approve" | "Reject" | "Undecided" = "Undecided";

					if (approveCount > rejectCount) {
						conclusion = "Approve";
					} else if (rejectCount > approveCount) {
						conclusion = "Reject";
					}

					return {
						...llm,
						conclusion: conclusion,
					};
				});
				setLlmOpinions(finalOpinions);
				console.log("Final Conclusions:", finalOpinions);
				return 10;
			}
			return prevProgress;
		});
	}, [llmOpinions, generateLLMOpinion]);

	useEffect(() => {
		const timer = setInterval(() => {
			advanceDiscussion();
		}, 5000); // Advance every 5 seconds

		return () => clearInterval(timer);
	}, [advanceDiscussion]);

	const handleVote = (vote: "yes" | "no") => {
		setMarketData((prevData) => {
			const change = 0.01; // 1% change
			let newYesPrice = prevData.yesPrice;
			let newNoPrice = prevData.noPrice;

			if (vote === "yes") {
				newYesPrice = Math.min(newYesPrice + change, 1);
				newNoPrice = Math.max(newNoPrice - change, 0);
			} else {
				newYesPrice = Math.max(newYesPrice - change, 0);
				newNoPrice = Math.min(newNoPrice + change, 1);
			}

			const total = newYesPrice + newNoPrice;
			const newYesPercentage = (newYesPrice / total) * 100;
			const newNoPercentage = (newNoPrice / total) * 100;

			return {
				...prevData,
				yesPrice: newYesPrice,
				noPrice: newNoPrice,
				yesPercentage: newYesPercentage,
				noPercentage: newNoPercentage,
			};
		});
	};

	const calculateMajorityVote = () => {
		const votes = llmOpinions
			.map((llm) => llm.conclusion)
			.filter((vote) => vote !== null);
		if (votes.length === 0) return "Undecided";

		const voteCount = votes.reduce((acc, vote) => {
			acc[vote] = (acc[vote] || 0) + 1;
			return acc as Record<string, number>;
		}, {} as Record<string, number>);

		const maxVotes = Math.max(...Object.values(voteCount));
		const winners = Object.entries(voteCount)
			.filter(([_, count]) => count === maxVotes)
			.map(([vote]) => vote);
		return winners.length > 1 ? "Undecided" : winners[0];
	};

	const {
		title,
		description,
		deadline,
		category,
		attention,
		volume,
		yesPrice,
		noPrice,
		yesPercentage,
		noPercentage,
		providers,
		oracles,
	} = marketData;

	const [comments, setComments] = useState<string[]>([]);
	const [newComment, setNewComment] = useState("");

	const handleAddComment = () => {
		if (isVerified && newComment.trim()) {
			setComments([...comments, newComment]);
			setNewComment("");
		} else if (!isVerified) {
			alert("コメントを投稿するにはWorld IDで認証してください。");
		}
	};

	return (
		<>
			<Header />
			<div className=" w-full p-4 bg-slate-900 overflow-x-hidden">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<Card className="mb-6 bg-slate-800 border-gray-700 relative shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-full">
						<Link href={`/market/${params.slug}`}>
							<div className="absolute bottom-2 right-2 p-2">
								<Button
									variant="outline"
									size="icon"
									className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 border-blue-500"
									title="Execute"
								>
									<ClockIcon className="h-4 w-4 text-white" />
								</Button>
							</div>
						</Link>
						<div className="flex flex-col sm:flex-row">
							<div className="flex-grow sm:w-2/3">
								<CardHeader className="flex flex-col space-y-1.5">
									<CardTitle className="text-xl font-bold text-white">
										{title}
									</CardTitle>
									<CardDescription className="text-gray-400">
										{description}
									</CardDescription>
								</CardHeader>
								<CardContent className="py-4">
									<div className="flex flex-col space-y-2">
										<div className="flex items-center space-x-2 group relative">
											<ClockIcon className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-400">
												Execution Time:{" "}
												{new Date(deadline * 1000).toLocaleString()}
											</span>
											<span className="absolute bottom-full left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
												UNIX Time: {deadline}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<TagIcon className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-400">
												Category: {category}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<UsersIcon className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-400">
												Attention: {attention ? attention : "0"} people
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<DollarSignIcon className="w-4 h-4 text-gray-400" />
											<span className="text-sm text-gray-400">
												Volume: ${volume ? volume : "0"}
											</span>
										</div>
									</div>
								</CardContent>
							</div>

							<div className="flex flex-col justify-between p-4 sm:w-1/3">
								<div className="flex flex-col space-y-2 mb-4">
									<>
										<Button
											variant="outline"
											className="w-full justify-between bg-green-900 hover:bg-green-800 border-green-700 text-white font-bold"
											onClick={() => handleVote("yes")}
										>
											Yes{" "}
											<span className="ml-1 text-green-400">
												${marketData.yesPrice.toFixed(2)} (
												{marketData.yesPercentage.toFixed(1)}%)
											</span>
										</Button>
										<Button
											variant="outline"
											className="w-full justify-between bg-red-900 hover:bg-red-800 border-red-700 text-white font-bold"
											onClick={() => handleVote("no")}
										>
											No{" "}
											<span className="ml-1 text-red-400">
												${marketData.noPrice.toFixed(2)} (
												{marketData.noPercentage.toFixed(1)}%)
											</span>
										</Button>
									</>
								</div>
								<div className="flex flex-col space-y-2">
									<div className="flex flex-wrap gap-1">
										<span className="text-sm text-gray-400 mr-2">
											News Provider:
										</span>
										{providers.map((provider, index) => (
											<ProviderIcon
												key={`provider-${index}`}
												provider={provider.name}
												link={`/newsprovider/${provider.name}`}
												iconPath={provider.iconPath}
											/>
										))}
									</div>
									<div className="flex flex-wrap gap-1">
										<span className="text-sm text-gray-400 mr-2">Oracle:</span>
										{oracles.map((oracle, index) => (
											<ProviderIcon
												key={`oracle-${index}`}
												provider={oracle.name}
												link={`/oracleprovider/${oracle.name}`}
												iconPath={oracle.iconPath}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</Card>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
				>
					<Card className="bg-gradient-to-r from-gray-800 to-gray-900 border-transparent mt-6 shadow-2xl rounded-xl">
						<CardHeader className="flex justify-between items-center border-b border-gray-700 pb-2">
							<CardTitle className="text-2xl font-extrabold text-white">
								LLM Discussion
							</CardTitle>
							<Button
								variant="ghost"
								onClick={() => setIsDiscussionExpanded(!isDiscussionExpanded)}
								className="text-white hover:text-blue-400 transition-colors duration-200"
							>
								{isDiscussionExpanded ? "Collapse ▲" : "Expand ▼"}
							</Button>
						</CardHeader>
						{isDiscussionExpanded && (
							<CardContent>
								<div className="mb-4">
									<Progress
										value={(discussionProgress / 10) * 100}
										className="w-full h-2 bg-gray-700 rounded-full"
									/>
								</div>
								<div className="space-y-6">
									{[0, 1, 2].map((round) => (
										<div key={round} className="mb-8">
											<h3 className="text-xl font-bold text-yellow-400 mb-3">
												Round {round + 1}
											</h3>
											<div className="flex flex-col space-y-4">
												{llmOpinions.map(
													(llm, index) =>
														llm.opinions[round] && (
															<motion.div
																key={index}
																className="flex items-start space-x-4 bg-gray-700 p-4 rounded-lg shadow-inner"
																initial={{ opacity: 0, x: -50 }}
																animate={{ opacity: 1, x: 0 }}
																transition={{
																	duration: 0.3,
																	delay: index * 0.1,
																}}
															>
																<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
																	<span className="text-white text-lg font-semibold">
																		{llm.llm[0]}
																	</span>
																</div>
																<div className="flex-1 text-white">
																	<p className="text-md">
																		{llm.opinions[round]}
																	</p>
																</div>
															</motion.div>
														)
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						)}
					</Card>
				</motion.div>

				{discussionProgress === 10 && (
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="mt-8"
					>
						<h2 className="text-2xl font-bold text-white mb-4">
							Final Results
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							{llmOpinions.map((llm, index) => (
								<motion.div
									key={index}
									className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300"
									whileHover={{ scale: 1.05 }}
								>
									<h3 className="text-xl font-semibold text-white mb-2">
										{llm.llm}
									</h3>
									<p
										className={`text-lg font-bold ${
											llm.conclusion === "Approve"
												? "text-green-400"
												: llm.conclusion === "Reject"
												? "text-red-400"
												: "text-yellow-400"
										}`}
									>
										{llm.conclusion}
									</p>
								</motion.div>
							))}
						</div>
						<motion.div
							className="mt-6 bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300"
							whileHover={{ scale: 1.02 }}
						>
							<h3 className="text-xl font-semibold text-white mb-2">
								Majority Vote Result
							</h3>
							<p className="text-2xl font-bold text-blue-400">
								{calculateMajorityVote()}
							</p>
						</motion.div>
					</motion.div>
				)}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.6 }}
					className="mt-8"
				>
					<Card className="bg-gray-800 border-gray-700">
						<CardHeader>
							<CardTitle className="text-2xl font-bold text-white">
								コメント
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{comments.map((comment, index) => (
									<div key={index} className="bg-gray-700 p-3 rounded-lg">
										<p className="text-white">{comment}</p>
									</div>
								))}
							</div>
							<div className="mt-4 flex space-x-2">
								<Input
									type="text"
									placeholder="コメントを入力..."
									value={newComment}
									onChange={(e) => setNewComment(e.target.value)}
									className="flex-grow bg-gray-700 text-white"
								/>
								{isVerified ? (
									<Button
										onClick={handleAddComment}
										disabled={!newComment.trim()}
									>
										投稿
									</Button>
								) : (
									<IDKitWidget
										action={action}
										app_id={app_id}
										onSuccess={onSuccess}
										handleVerify={handleProof}
										verification_level={VerificationLevel.Device}
									>
										{({ open }) => (
											<Button onClick={open}>World IDで認証</Button>
										)}
									</IDKitWidget>
								)}
							</div>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</>
	);
}
