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
			title: "90日以内にヒズボラがイスラエルに大規模報復攻撃を行うか？",
			description:
				"ヒズボラ指導者ハッサン・ナスラッラーが報復を誓った後、イスラエルがレバノンを爆撃。この緊張状態を受け、ヒズボラによる大規模な報復攻撃（100発以上のロケット弾発射または10人以上の死者を出す攻撃）が行われるかを予測。",
			category: "政治・国際情勢",
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
			title: "2024年末までにS&P500が5000ポイントを超えるか？",
			description:
				"連邦準備制度理事会（FRB）の大幅利下げを受け、S&P500が過去最高値を更新。この勢いが続き、2024年12月31日まで S&P500 が 5000 ポイントを超えるかどうかを予測。",
			category: "経済・金融",
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
			title: "60日以内にNorth Carolina州知事候補のMark Robinsonが辞退するか？",
			description:
				"Mark Robinson氏が過去に「黒人ナチ」を自称し、奴隷制を擁護したとする報道を受け、共和党候補者としての地位が揺らいでいる。60日以内に彼が州知事選から辞退するかを予測。",
			category: "政治",
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
			title: "6ヶ月以内にバイデン大統領の支持率が45%を超えるか？",
			description:
				"North Carolina州知事選の混乱や中東情勢の緊迫化など、様々な政治的要因がバイデン大統領の支持率に影響を与える可能性がある。今後6ヶ月以内に、信頼できる全国世論調査でバイデン大統領の支持率が45%を超えるかを予測。",
			category: "政治",
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
			title: "1以内にNASAが過去100万年で最高気温を記録したと発表するか？",
			description:
				"先史時代の地球が非常に高温だったという新しい研究結果を踏まえ今後1年以内にNASAが過去100万年で最高の全球平均気温を記録したと公式に発表するかどうかを予測。",
			category: "科学・環境",
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

// プロバ��ダーアイコンのコンポーネント
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
		{ value: "all", label: "すべて", icon: NewspaperIcon },
		{ value: "Politics", label: "政治", icon: UsersIcon },
		{ value: "Business", label: "ビジネス", icon: DollarSignIcon },
		{ value: "Technology", label: "テクノロジー", icon: TagIcon },
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
													className="flex items-center text-sm data-[state=active]:bg-gray-600"
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
