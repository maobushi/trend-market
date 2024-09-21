"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ProviderIcon } from "@/components/Body/Body";
import { ClockIcon, UsersIcon, DollarSignIcon, TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// マーケット項目のコンポーネント
import { sampleData } from "@/components/Body/Body";
import Header from "@/components/Header/Header";

export function MarketItem({
	title,
	description,
	category,
	deadline,
	yesPrice,
	noPrice,
	providers,
	oracles,
}: {
	title: string;
	description: string;
	category: string;
	deadline: number;
	yesPrice: number;
	noPrice: number;
	providers: { name: string; link: string; iconPath: string }[];
	oracles: { name: string; link: string; iconPath: string }[];
}) {
	return (
		<Card className="mb-6 bg-gray-800 border-gray-700">
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
									決済時刻: {new Date(deadline * 1000).toLocaleString()}
								</span>
								<span className="absolute bottom-full left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
									UNIX時間: {deadline}
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<TagIcon className="w-4 h-4 text-gray-400" />
								<span className="text-sm text-gray-400">
									カテゴリ: {category}
								</span>
							</div>
							<div className="flex items-center space-x-2">
								<UsersIcon className="w-4 h-4 text-gray-400" />
								<span className="text-sm text-gray-400">参加人数: 1,234</span>
							</div>
							<div className="flex items-center space-x-2">
								<DollarSignIcon className="w-4 h-4 text-gray-400" />
								<span className="text-sm text-gray-400">Volume: $10,000</span>
							</div>
						</div>
					</CardContent>
				</div>
				<div className="flex flex-col justify-between p-4 sm:w-1/3">
					<div className="flex flex-col space-y-2 mb-4">
						<Button
							variant="outline"
							className="w-full justify-between bg-green-900 hover:bg-green-800 border-green-700 text-white font-bold"
						>
							Yes{" "}
							<span className="ml-1 text-green-400">
								${yesPrice.toFixed(2)}
							</span>
						</Button>
						<Button
							variant="outline"
							className="w-full justify-between bg-red-900 hover:bg-red-800 border-red-700 text-white font-bold"
						>
							No{" "}
							<span className="ml-1 text-red-400">${noPrice.toFixed(2)}</span>
						</Button>
					</div>
					<div className="flex flex-col space-y-2">
						<div className="flex flex-wrap gap-1">
							<span className="text-sm text-gray-400 mr-2">News Provider:</span>
							{providers.map((provider, index) => (
								<ProviderIcon
									key={`provider-${index}`}
									provider={provider.name}
									link={provider.link}
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
									link={oracle.link}
									iconPath={oracle.iconPath}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

export default function Market() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
			<Header />
			<div className="container mx-auto p-8">
				<h1 className="text-4xl font-bold mb-8">Market</h1>
				<div className="flex flex-col md:flex-row gap-8">
					<div className="flex-1 bg-gray-800 rounded-lg p-6 shadow-lg">
						<h2 className="text-2xl mb-4">参加中のマーケット</h2>
						<div className="space-y-4">
							{sampleData.marketItems.map((item) => (
								<MarketItem
									key={item.id}
									title={item.title}
									description={item.description}
									category={item.category}
									deadline={item.deadline}
									yesPrice={item.yesPrice}
									noPrice={item.noPrice}
									providers={item.providers}
									oracles={item.oracles}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
