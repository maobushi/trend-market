"use client";
import { ProviderIcon } from "@/components/Body/Body";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ClockIcon, UsersIcon, DollarSignIcon, TagIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeployMarket from "@/components/MarketGenerator/DeployMarket";

interface MarketItemProps {
	contract_id?: number;
	title: string;
	initialLiquidity: number;
	description: string;
	category: string;
	deadline: number;
	yesPrice: number;
	noPrice: number;
	attention?: number; // オプショナルに変更
	volume?: number; // オプショナルに変更
	providers: { name: string; link: string; iconPath: string }[];
	oracles: { name: string; link: string; iconPath: string }[];
	deployedTxHash?: string;
}

export const MarketItem: React.FC<MarketItemProps> = ({
	contract_id,
	title,
	initialLiquidity,
	description,
	category,
	deadline,
	yesPrice,
	noPrice,
	attention,
	volume,
	providers,
	oracles,
	deployedTxHash,
}) => {
	const yesPercentage = (yesPrice / (yesPrice + noPrice)) * 100;
	const noPercentage = 100 - yesPercentage;

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
									Execution Time: {new Date(deadline * 1000).toLocaleString()}
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
							>
								Yes{" "}
								<span className="ml-1 text-green-400">
									${yesPrice !== undefined ? yesPrice.toFixed(2) : "N/A"} (
									{yesPercentage.toFixed(1)}%)
								</span>
							</Button>
							<Button
								variant="outline"
								className="w-full justify-between bg-red-900 hover:bg-red-800 border-red-700 text-white font-bold"
							>
								No{" "}
								<span className="ml-1 text-red-400">
									${noPrice !== undefined ? noPrice.toFixed(2) : "N/A"} (
									{noPercentage.toFixed(1)}%)
								</span>
							</Button>
						</>
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
};
