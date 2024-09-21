"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	NewspaperIcon,
	UsersIcon,
	DollarSignIcon,
	TagIcon,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Tables } from "@/types/supabase";

export const sampleData = {
	marketItems: [
		{
			id: 1,
			title:
				"Will Hezbollah launch a large-scale retaliatory attack against Israel within 90 days?",
			description:
				"After Hezbollah leader Hassan Nasrallah vowed retaliation, Israel bombed Lebanon. Given this tense situation, predict whether Hezbollah will carry out a large-scale retaliatory attack (firing over 100 rockets or an attack resulting in more than 10 casualties).",
			category: "Politics & International Affairs",
			deadline: 1701388800,
			yesPrice: 0.65,
			noPrice: 0.35,
			attention: 1000,
			volume: 1000000,
			providers: [
				{
					name: "Reuters",
					link: "https://www.reuters.com",
					iconPath: "/newsprovider/Reuters.png",
				},
				{
					name: "AP",
					link: "https://apnews.com",
					iconPath: "/newsprovider/AP.png",
				},
			],
			oracles: [
				{
					name: "Chainlink",
					link: "https://chain.link",
					iconPath: "/oracleprovider/Chainlink.png",
				},
				{
					name: "API3",
					link: "https://api3.org",
					iconPath: "/oracleprovider/API3.png",
				},
			],
		},
		{
			id: 2,
			title: "Will the S&P500 exceed 5000 points by the end of 2024?",
			description:
				"Following a significant rate cut by the Federal Reserve, the S&P500 has reached a new all-time high. Predict whether this momentum will continue and the S&P500 will exceed 5000 points by December 31, 2024.",
			category: "Economy & Finance",
			deadline: 1735689600,
			yesPrice: 0.55,
			noPrice: 0.45,
			attention: 1000,
			volume: 1000000,
			providers: [
				{
					name: "Bloomberg",
					link: "https://www.bloomberg.com",
					iconPath: "/newsprovider/Bloomberg.png",
				},
				{
					name: "CNBC",
					link: "https://www.cnbc.com",
					iconPath: "/newsprovider/CNBC.png",
				},
			],
			oracles: [
				{
					name: "Chainlink",
					link: "https://chain.link",
					iconPath: "/oracleprovider/Chainlink.png",
				},
				{
					name: "UMA",
					link: "https://umaproject.org",
					iconPath: "/oracleprovider/UMA.png",
				},
			],
		},
		{
			id: 3,
			title:
				"Will North Carolina gubernatorial candidate Mark Robinson withdraw within 60 days?",
			description:
				"Mark Robinson's position as a Republican candidate is in jeopardy following reports that he previously called himself a 'black Nazi' and defended slavery. Predict whether he will withdraw from the gubernatorial race within 60 days.",
			category: "Politics",
			deadline: 1700784000,
			yesPrice: 0.7,
			noPrice: 0.3,
			attention: 1000,
			volume: 1000000,
			providers: [
				{
					name: "CNN",
					link: "https://www.cnn.com",
					iconPath: "/newsprovider/CNN.png",
				},
				{
					name: "Fox News",
					link: "https://www.foxnews.com",
					iconPath: "/newsprovider/FoxNews.png",
				},
			],
			oracles: [
				{
					name: "Chainlink",
					link: "https://chain.link",
					iconPath: "/oracleprovider/Chainlink.png",
				},
				{
					name: "Band Protocol",
					link: "https://bandprotocol.com",
					iconPath: "/oracleprovider/BandProtocol.png",
				},
			],
		},
		{
			id: 4,
			title:
				"Will President Biden's approval rating exceed 45% within 6 months?",
			description:
				"Various political factors, such as the turmoil in the North Carolina gubernatorial race and the tense situation in the Middle East, may affect President Biden's approval rating. Predict whether President Biden's approval rating will exceed 45% in a reliable national poll within the next 6 months.",
			category: "Politics",
			deadline: 1710720000,
			yesPrice: 0.4,
			noPrice: 0.6,
			attention: 1000,
			volume: 1000000,
			providers: [
				{
					name: "Pew Research Center",
					link: "https://www.pewresearch.org",
					iconPath: "/newsprovider/PewResearchCenter.png",
				},
				{
					name: "Gallup",
					link: "https://news.gallup.com",
					iconPath: "/newsprovider/Gallup.png",
				},
			],
			oracles: [
				{
					name: "API3",
					link: "https://api3.org",
					iconPath: "/oracleprovider/API3.png",
				},
				{
					name: "Tellor",
					link: "https://tellor.io",
					iconPath: "/oracleprovider/Tellor.png",
				},
			],
		},
		{
			id: 5,
			title:
				"Will NASA announce the highest global average temperature in the past million years within 1 year?",
			description:
				"Based on new research suggesting that prehistoric Earth was extremely hot, predict whether NASA will officially announce the highest global average temperature in the past million years within the next year.",
			category: "Science & Environment",
			deadline: 1726790400,
			yesPrice: 0.75,
			noPrice: 0.25,
			attention: 1000,
			volume: 1000000,
			providers: [
				{
					name: "NASA",
					link: "https://www.nasa.gov",
					iconPath: "/newsprovider/NASA.png",
				},
				{
					name: "NOAA",
					link: "https://www.noaa.gov",
					iconPath: "/newsprovider/NOAA.png",
				},
			],
			oracles: [
				{
					name: "Chainlink",
					link: "https://chain.link",
					iconPath: "/oracleprovider/Chainlink.png",
				},
				{
					name: "Band Protocol",
					link: "https://bandprotocol.com",
					iconPath: "/oracleprovider/BandProtocol.png",
				},
			],
		},
	],
};

// プロバダーアイコンのコンポーネント
export const ProviderIcon = ({
	provider,
	link,
	iconPath,
}: {
	provider: string;
	link: string;
	iconPath: string;
}) => (
	<a
		href={link}
		target="_blank"
		rel="noopener noreferrer"
		className="relative group"
	>
		<div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
			<Image
				src={iconPath}
				alt={`${provider} icon`}
				className="object-cover"
				width={40}
				height={40}
			/>
		</div>
		<span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
			{provider}
		</span>
	</a>
);

// ニュース項目のコンポーネント
const NewsItem = ({
	id,
	title,
	description,
	provider,
	providerLink,
	publishedAt,
	category,
}: {
	id: string;
	title: string;
	description: string;
	provider: string;
	providerLink: string;
	publishedAt: string;
	category: string;
}) => (
	<Card className="mb-4 bg-gray-800 border-gray-700">
		<CardHeader className="flex flex-row items-start space-y-0 pb-2">
			<div className="mr-4">
				<ProviderIcon
					provider={provider}
					link={providerLink}
					iconPath={`/newsprovider/${provider}.png`}
				/>
			</div>
			<div className="flex-1">
				<Link href={`/news/${id}`} className="text-white hover:text-blue-500">
					<CardTitle className="text-xl font-bold  mb-2">{title}</CardTitle>
				</Link>
				<CardDescription className="text-gray-400">
					{description}
				</CardDescription>
			</div>
		</CardHeader>
		<CardContent className="pt-0 px-4">
			<a
				href={providerLink}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
			>
				Source
			</a>
		</CardContent>
	</Card>
);

export default function NewsMarketSite() {
	const supabase = createClient();
	const [activeTab, setActiveTab] = useState("news");
	const [activeNewsCategory, setActiveNewsCategory] = useState("all");
	const [isBlinking, setIsBlinking] = useState(true);
	const [newsItems, setNewsItems] = useState<Tables<"news">[]>([]);

	useEffect(() => {
		const blinkInterval = setInterval(() => {
			setIsBlinking((prev) => !prev);
		}, 1000);

		fetchNews();

		return () => clearInterval(blinkInterval);
	}, []);

	const fetchNews = async () => {
		const { data, error } = await supabase
			.from("news")
			.select("*")
			.order("published_at", { ascending: false });

		if (error) {
			console.error("Error fetching news:", error);
		} else {
			setNewsItems(data);
		}
	};

	const newsCategories = [
		{ value: "all", label: "All", icon: NewspaperIcon },
		{ value: "Politics", label: "Politics", icon: UsersIcon },
		{ value: "Business", label: "Business", icon: DollarSignIcon },
		{ value: "Technology", label: "Technology", icon: TagIcon },
	];

	const filteredNews =
		activeNewsCategory === "all"
			? newsItems
			: newsItems.filter((item) => item.category === activeNewsCategory);

	return (
		<>
			<div className="min-h-screen bg-gray-900 text-white">
				<div className="container mx-auto p-4">
					<Tabs
						value={activeTab}
						onValueChange={setActiveTab}
						className="w-full"
					>
						<TabsContent value="news">
							<Card className="bg-gray-800 border-gray-700">
								<CardHeader>
									<div className="flex items-center mb-4">
										<span className="text-2xl font-bold text-white mr-2">
											NEWS LIVE
										</span>
										<div
											className={`w-3 h-3 rounded-full ${
												isBlinking ? "bg-red-600" : "bg-gray-600"
											} transition-colors duration-300`}
										></div>
									</div>
									<CardDescription className="text-gray-400">
										Latest news
									</CardDescription>
								</CardHeader>
								<CardContent>
									<Tabs
										value={activeNewsCategory}
										onValueChange={setActiveNewsCategory}
									>
										<TabsList className="grid w-full grid-cols-4 mb-4 bg-gray-700">
											{newsCategories.map((category) => (
												<TabsTrigger
													key={category.value}
													value={category.value}
													className="flex items-center text-sm text-white data-[state=active]:bg-gray-600"
												>
													<category.icon className="w-4 h-4 mr-2" />
													<span>{category.label}</span>
												</TabsTrigger>
											))}
										</TabsList>
										<ScrollArea className="h-[600px] pr-4">
											{filteredNews.map((item) => (
												<NewsItem
													key={item.id}
													id={item.id}
													title={item.title || ""}
													description={item.description || ""}
													provider={item.provider || ""}
													providerLink={item.provider_link || ""}
													publishedAt={item.published_at || ""}
													category={item.category || ""}
												/>
											))}
										</ScrollArea>
									</Tabs>
								</CardContent>
							</Card>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</>
	);
}
