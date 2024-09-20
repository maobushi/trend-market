"use client";
import Image from "next/image";
import { useState } from "react";
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
	BarChartIcon,
	ClockIcon,
	UsersIcon,
	DollarSignIcon,
	TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample data in JSON format
const sampleData = {
	newsItems: [
		{
			id: 1,
			title: "Israel Bombards Hezbollah as Group's Leader Vows Retaliation",
			description:
				"The Hezbollah leader, Hassan Nasrallah, did not say how his group would respond to attacks on hand-held devices, which killed dozens when pagers and walkie-talkies exploded.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/world/middleeast/israel-lebanon-hezbollah-strikes.html",
		},
		{
			id: 2,
			title:
				"A New Era in Sabotage: Turning Ordinary Devices Into Grenades, on a Mass Scale",
			description:
				"The attacks in Lebanon required getting deep into the supply chain, which is difficult to do. But the sabotage contributes to a sense of vulnerability that ordinary devices can become a source of danger.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/israel-hezbollah-pager-attacks.html",
		},
		{
			id: 3,
			title:
				"North Carolina Governor Race Jolted by Report That G.O.P. Nominee Called Himself a 'Black Nazi'",
			description:
				"Mr. Robinson, the Republican nominee for governor of North Carolina, vowed to stay in the race and sought to deny the report, which also said he had defended slavery in online posts years ago.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/mark-robinson-north-carolina-gubernatorial-race.html",
		},
		{
			id: 4,
			title:
				"How the Robinson Report Could Affect the Presidential Race in North Carolina",
			description:
				"A Democratic presidential candidate has not won North Carolina since 2008. But the drama around Lt. Gov. Mark Robinson, the Republican nominee for governor, is sure to bolster their hopes.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/mark-robinson-cnn-report-presidential-race.html",
		},
		{
			id: 5,
			title:
				"How North Carolina Republicans Could Replace Their Governor Nominee",
			description:
				"The deadline for a candidate to withdraw is midnight tonight, but Lt. Gov. Mark Robinson has vowed to stay in the race.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/replace-governor-nominee-north-carolina.html",
		},
		{
			id: 6,
			title:
				"Trump Says That if He Loses, 'the Jewish People Would Have a Lot to Do' With It",
			description: `Speaking at a campaign event denouncing antisemitism in America, Donald Trump again attacked Jews who vote for Democrats, saying that the party had a "hold, or curse, on you.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/trump-jews-antisemitism-israel.html",
		},
		{
			id: 7,
			title:
				"Prehistoric Earth Was Very Hot. That Offers Clues About Future Earth.",
			description:
				"At times during the past half-billion years, carbon dioxide warmed our planet more than previously thought, according to a new reconstruction of Earth's deep past.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/climate/prehistoric-earth-temperatures.html",
		},
		{
			id: 8,
			title: "Stocks Hit Record High a Day After Fed's Big Interest Rate Cut",
			description:
				"The S&P 500 rose 1.7 percent on Thursday, rallying a day after the Federal Reserve cut interest rates by half a percentage point.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/business/stock-market-federal-reserve.html",
		},
		{
			id: 9,
			title: "Europe's New Defense Chief: 'A King Without a Kingdom'?",
			description:
				"The European Union has vowed to enhance its military capability. But money is scarce, responsibilities overlap and the new job is less about soldiers than arms manufacturers.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/world/europe/europes-new-defense-chief-a-king-without-a-kingdom.html",
		},
		{
			id: 10,
			title: "Kentucky Sheriff Arrested in Shooting Death of Judge",
			description:
				"The police say a sheriff shot District Judge Kevin Mullins inside the courthouse on Thursday afternoon before turning himself in.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/sheriff-judge-shooting-kentucky.html",
		},
		{
			id: 11,
			title: "Inside the Secretive Facility Housing Migrants at Guantánamo Bay",
			description:
				"Reports and interviews shed new light on the holding center, where migrants' calls with lawyers are monitored and some say they've been forced to wear blackout goggles.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/migrants-guantanamo-bay-cuba-detention.html",
		},
		{
			id: 12,
			title:
				"Former N.Y.C. Covid Czar Partied While Preaching Social Distancing",
			description:
				"In a hidden-camera video posted by a conservative podcaster, Dr. Jay K. Varma boasts about flouting the public health guidelines he insisted others follow.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/nyregion/dr-jay-varma-nyc-covid.html",
		},
		{
			id: 13,
			title:
				"They Said the Virgin Mary Appeared. The Vatican Is Finally Weighing In.",
			description:
				"After decades, and controversy, the Vatican has authorized public worship at a shrine in Bosnia, where a once tranquil village has become a major pilgrimage site.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/world/europe/medjugorje-virgin-mary-vatican.html",
		},
		{
			id: 14,
			title:
				"The Fed's Big Rate Cut Wasn't Political. It Was an Economic No-Brainer.",
			description: `The cut was "jumbo." The implications are bigger.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/opinion/interest-rates-federal-reserve.html",
		},
		{
			id: 15,
			title: "Why JD Vance Dropped Into My Inbox",
			description: "I used to think I knew him. History has proved me wrong.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/opinion/jd-vance-hillbilly-elegy.html",
		},
		{
			id: 16,
			title: "Why Can't Kamala Harris Just Say This?",
			description:
				"Here's a script with which she could explain her evolution.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/opinion/kamala-harris-positions.html",
		},
		{
			id: 17,
			title: "I Just Went to Darfur. Here Is What Shattered Me.",
			description: `"So many men were killed, like grains of sand," says one survivor.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/18/opinion/darfur-sudan-famine.html",
		},
		{
			id: 18,
			title: "Israel Bombards Lebanon After Hezbollah Vowed Retaliation",
			description: "Plus, a record day for stocks.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/briefing/lebanon-israel-hezbollah-stocks-harris-trump-guantanamo.html",
		},
		{
			id: 19,
			title: "Nike C.E.O. John Donahoe Abruptly Retires Amid Declining Sales",
			description:
				"Elliott Hill, an executive who left the company after Donahoe's appointment in 2020, will return as chief executive, Nike's board said.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/business/nike-elliott-hill-john-donahoe.html",
		},
		{
			id: 20,
			title:
				"Officials Open Criminal Inquiry Into Crash That Caused Pipeline Fire Near Houston",
			description:
				"A vehicle crashed into a gas pipeline valve, exploding into a tower of flame that has burned for days. Investigators are now looking into whether it was more than an accident.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/houston-pipeline-fire-human-remains.html",
		},
		{
			id: 21,
			title: "Alaska Man Charged With Threatening 6 Supreme Court Justices",
			description:
				"It remained unclear whether the man, Panos Anastasiou, came close to carrying out his threats, and public records indicate that he is not affiliated with any political party.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/supreme-court-justices-threats-fbi.html",
		},
		{
			id: 22,
			title:
				"Goon Squad Violence Leads to Federal Investigation of Mississippi Sheriff's Office",
			description:
				"The Justice Department will determine if allegations of widespread violence and improper searches amount to a pattern  of discrimination in the department.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/goon-squad-mississippi-sheriffs-office.html",
		},
		{
			id: 23,
			title:
				"The Author of 'Impossible Creatures' Tucks Big Ideas in Tales of Wonder",
			description: `Katherine Rundell said children can handle hefty themes, but finds it "bad manners to offer a child a story and give them just a moral.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/books/katherine-rundell-impossible-creatures.html",
		},
	],
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
				"連邦準備制度理事会（FRB）の大幅利下げを受け、S&P500が過去最高値を更新。この勢いが続き、2024年12月31日までに S&P500 が 5000 ポイントを超えるかどうかを予測。",
			category: "経済・金融",
			deadline: 1735689600,
			yesPrice: 0.55,
			noPrice: 0.45,
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

// プロバイダーアイコンのコンポーネント
const ProviderIcon = ({
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
	title,
	description,
	provider,
	providerLink,
}: {
	title: string;
	description: string;
	provider: string;
	providerLink: string;
}) => (
	<Card className="mb-4 bg-gray-800 border-gray-700">
		<CardHeader className="flex flex-col space-y-1.5">
			<CardTitle className="text-xl font-bold text-white">{title}</CardTitle>
			<CardDescription className="text-gray-400">{description}</CardDescription>
		</CardHeader>
		<CardContent className="flex justify-between items-center">
			<a
				href={providerLink}
				target="_blank"
				rel="noopener noreferrer"
				className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
			>
				Source
			</a>
			<ProviderIcon
				provider={provider}
				link={providerLink}
				iconPath={`/newsprovider/${provider}.png`}
			/>
		</CardContent>
	</Card>
);

// マーケット項目のコンポーネント
const MarketItem = ({
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
}) => (
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
						<span className="ml-1 text-green-400">${yesPrice.toFixed(2)}</span>
					</Button>
					<Button
						variant="outline"
						className="w-full justify-between bg-red-900 hover:bg-red-800 border-red-700 text-white font-bold"
					>
						No <span className="ml-1 text-red-400">${noPrice.toFixed(2)}</span>
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

export function NewsMarketSite() {
	const [activeTab, setActiveTab] = useState("news");

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="container mx-auto p-4">
				<Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
					<TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800 text-white font-bold py-0">
						<TabsTrigger
							value="news"
							className="flex items-center text-lg data-[state=active]:bg-gray-700"
						>
							<NewspaperIcon className="w-5 h-5 mr-2 text-white font-bold" />
							<span className="text-white font-bold">News</span>
						</TabsTrigger>
						<TabsTrigger
							value="markets"
							className="flex items-center text-lg data-[state=active]:bg-gray-700"
						>
							<BarChartIcon className="w-5 h-5 mr-2 text-white font-bold" />
							<span className="text-white font-bold">Markets</span>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="news">
						<Card className="bg-gray-800 border-gray-700">
							<CardHeader>
								<CardTitle className="text-2xl text-white font-bold">
									Latest News
								</CardTitle>
								<CardDescription className="text-gray-400">
									Stay informed with the most recent updates
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ScrollArea className="h-[600px] pr-4">
									{sampleData.newsItems.map((item) => (
										<NewsItem
											key={item.id}
											title={item.title}
											description={item.description}
											provider={item.provider}
											providerLink={item.providerLink}
										/>
									))}
								</ScrollArea>
							</CardContent>
						</Card>
					</TabsContent>
					<TabsContent value="markets">
						<Card className="bg-gray-800 border-gray-700">
							<CardHeader>
								<CardTitle className="text-2xl font-bold text-white">
									Prediction Markets
								</CardTitle>
								<CardDescription className="text-gray-400">
									Explore and bet on future outcomes
								</CardDescription>
							</CardHeader>
							<CardContent>
								<ScrollArea className="h-[600px] pr-4">
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
								</ScrollArea>
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
