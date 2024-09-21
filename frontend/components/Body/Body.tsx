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
	BarChartIcon,
	ClockIcon,
	UsersIcon,
	DollarSignIcon,
	TagIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header/Header";
// Sample data in JSON format
export const sampleData = {
	newsItems: [
		{
			id: 1,
			title: "Israel Bombards Hezbollah as Group's Leader Vows Retaliation",
			description:
				"The Hezbollah leader, Hassan Nasrallah, did not say how his group would respond to attacks on hand-held devices, which killed dozens when pagers and walkie-talkies exploded.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/world/middleeast/israel-lebanon-hezbollah-strikes.html",
			category: "politics",
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
			category: "politics",
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
			category: "politics",
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
			category: "politics",
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
			category: "politics",
		},
		{
			id: 6,
			title:
				"Trump Says That if He Loses, 'the Jewish People Would Have a Lot to Do' With It",
			description: `Speaking at a campaign event denouncing antisemitism in America, Donald Trump again attacked Jews who vote for Democrats, saying that the party had a "hold, or curse, on you.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/trump-jews-antisemitism-israel.html",
			category: "politics",
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
			category: "science",
		},
		{
			id: 8,
			title: "Stocks Hit Record High a Day After Fed's Big Interest Rate Cut",
			description:
				"The S&P 500 rose 1.7 percent on Thursday, rallying a day after the Federal Reserve cut interest rates by half a percentage point.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/business/stock-market-federal-reserve.html",
			category: "business",
		},
		{
			id: 9,
			title: "Europe's New Defense Chief: 'A King Without a Kingdom'?",
			description:
				"The European Union has vowed to enhance its military capability. But money is scarce, responsibilities overlap and the new job is less about soldiers than arms manufacturers.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/world/europe/europes-new-defense-chief-a-king-without-a-kingdom.html",
			category: "politics",
		},
		{
			id: 10,
			title: "Kentucky Sheriff Arrested in Shooting Death of Judge",
			description:
				"The police say a sheriff shot District Judge Kevin Mullins inside the courthouse on Thursday afternoon before turning himself in.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/sheriff-judge-shooting-kentucky.html",
			category: "politics",
		},
		{
			id: 11,
			title: "Inside the Secretive Facility Housing Migrants at Guantánamo Bay",
			description:
				"Reports and interviews shed new light on the holding center, where migrants' calls with lawyers are monitored and some say they've been forced to wear blackout goggles.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/migrants-guantanamo-bay-cuba-detention.html",
			category: "politics",
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
			category: "politics",
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
			category: "politics",
		},
		{
			id: 14,
			title:
				"The Fed's Big Rate Cut Wasn't Political. It Was an Economic No-Brainer.",
			description: `The cut was "jumbo." The implications are bigger.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/opinion/interest-rates-federal-reserve.html",
			category: "business",
		},
		{
			id: 15,
			title: "Why JD Vance Dropped Into My Inbox",
			description: "I used to think I knew him. History has proved me wrong.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/opinion/jd-vance-hillbilly-elegy.html",
			category: "politics",
		},
		{
			id: 16,
			title: "Why Can't Kamala Harris Just Say This?",
			description:
				"Here's a script with which she could explain her evolution.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/opinion/kamala-harris-positions.html",
			category: "politics",
		},
		{
			id: 17,
			title: "I Just Went to Darfur. Here Is What Shattered Me.",
			description: `"So many men were killed, like grains of sand," says one survivor.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/18/opinion/darfur-sudan-famine.html",
			category: "politics",
		},
		{
			id: 18,
			title: "Israel Bombards Lebanon After Hezbollah Vowed Retaliation",
			description: "Plus, a record day for stocks.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/briefing/lebanon-israel-hezbollah-stocks-harris-trump-guantanamo.html",
			category: "politics",
		},
		{
			id: 19,
			title: "Nike C.E.O. John Donahoe Abruptly Retires Amid Declining Sales",
			description:
				"Elliott Hill, an executive who left the company after Donahoe's appointment in 2020, will return as chief executive, Nike's board said.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/business/nike-elliott-hill-john-donahoe.html",
			category: "business",
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
			category: "politics",
		},
		{
			id: 21,
			title: "Alaska Man Charged With Threatening 6 Supreme Court Justices",
			description:
				"It remained unclear whether the man, Panos Anastasiou, came close to carrying out his threats, and public records indicate that he is not affiliated with any political party.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/us/politics/supreme-court-justices-threats-fbi.html",
			category: "politics",
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
			category: "politics",
		},
		{
			id: 23,
			title:
				"The Author of 'Impossible Creatures' Tucks Big Ideas in Tales of Wonder",
			description: `Katherine Rundell said children can handle hefty themes, but finds it "bad manners to offer a child a story and give them just a moral.`,
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/19/books/katherine-rundell-impossible-creatures.html",
			category: "politics",
		},
		{
			id: 24,
			title:
				"Rallying in Two Key States, Harris Presses Her Case on Abortion Rights",
			description:
				"Visiting Wisconsin after giving a speech in Georgia, the vice president signaled she would focus on the life-or-death risks of abortion bans in the final weeks of the race.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/us/politics/harris-rally-wisconsin.html",
			category: "politics",
		},
		{
			id: 25,
			title:
				"How One Man's Vote in Nebraska Could Change the Presidential Election",
			description:
				"A single Republican state senator appears to be holding back a push by Donald J. Trump to net a potentially pivotal electoral vote even before ballots are cast.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/us/politics/nebraska-trump-electoral-vote.html",
			category: "politics",
		},
		{
			id: 26,
			title: "Early Voting Begins in Minnesota, South Dakota and Virginia",
			description:
				"All three states began sending out mail ballots on Friday and now give people the option of voting in person.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/us/politics/early-voting-south-dakota-virginia-minnesota.html",
			category: "politics",
		},
		{
			id: 27,
			title: "Timeline: What Donald Trump Has Said About Mark Robinson",
			description:
				"The former president was an early backer of Mr. Robinson's bid to become governor of North Carolina, a race that was jolted when CNN reported that Mr. Robinson had made disturbing posts online.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/us/politics/trump-mark-robinson-relationship.html",
			category: "politics",
		},
		{
			id: 28,
			title:
				"Kamala Harris Tells Oprah if Somebody Breaks Into Her Home, 'They're Getting Shot'",
			description:
				"The remarkable utterance underscored Democrats' increasing comfort with the country's gun culture, and how Harris is trying to use it to puncture notions about female candidates.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/us/politics/kamala-harris-gun-oprah.html",
			category: "politics",
		},
		{
			id: 29,
			title: "Qualcomm Asked Chip Rival Intel if It Would Consider a Sale",
			description:
				"While Intel has struggled in recent years, other chipmakers are thriving because of a boom in demand.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/technology/qualcomm-intel-talks-sale.html",
			category: "business",
		},
		{
			id: 30,
			title: "Now That Rates Are Falling, Let's Turn to Other Matters",
			description:
				"The Federal Reserve has at last cut interest rates but our columnist points out a host of concerns that could weigh on financial markets.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/business/interest-rates-stock-market-federal-reserve.html",
			category: "business",
		},
		{
			id: 31,
			title: "F.T.C. Accuses Drug Middlemen of Inflating Insulin Prices",
			description:
				"The case takes aim at the major pharmacy benefit managers, agency officials said, claiming that they favored more expensive insulin products and forced patients to pay more.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/health/ftc-drug-price-inflation-insulin.html",
			category: "business",
		},
		{
			id: 32,
			title:
				"Motel 6 Is Sold to Oyo, an Indian Hotel Company Expanding in the U.S.",
			description:
				"A roadside chain for more than 50 years, Motel 6 was owned by Blackstone, the private equity giant. Oyo will pay $525 million in an all-cash deal.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/business/motel-6-oyo-blackstone.html",
			category: "business",
		},
		{
			id: 33,
			title:
				"Three Mile Island Plans to Reopen as Demand for Nuclear Power Grows",
			description:
				"The infamous plant, closed since 2019, is getting a new lease on life after Microsoft agreed to buy its electricity to supply a growing fleet of data centers.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/20/climate/three-mile-island-reopening.html",
			category: "business",
		},
		{
			id: 34,
			title: "Foldables Are Becoming Good Enough to Be Your Next Smartphone",
			description:
				"New devices from Motorola and Google prove that phones with bendable screens keep getting better — and some are even becoming cheaper.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/18/technology/personaltech/foldable-smartphones.html",
			category: "technology",
		},
		{
			id: 35,
			title:
				"California Passes Election 'Deepfake' Laws, Forcing Social Media Companies to Take Action",
			description:
				"The state joins dozens of others in regulating the A.I. fakery in ways that could impact this year's presidential race.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/17/technology/california-deepfakes-law-social-media-newsom.html",
			category: "technology",
		},
		{
			id: 36,
			title:
				"Caroline Ellison, Star Witness in FTX Case, Should Receive Lenient Sentence, Prosecutors Signal",
			description:
				"Ms. Ellison, Sam Bankman-Fried's former girlfriend and a top executive in his empire, is set to be sentenced on Sept. 24 for her role in the collapse of the crypto exchange.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/17/technology/caroline-ellison-ftx-sentence.html",
			category: "technology",
		},
		{
			id: 37,
			title:
				"Instagram, Facing Pressure Over Child Safety Online, Unveils Sweeping Changes",
			description:
				"The app, which is popular with teenagers, introduced new settings and features aimed at addressing inappropriate online contact and content, and improving sleep for users under 18.",
			provider: "TheNewYorkTimes",
			providerLink:
				"https://www.nytimes.com/2024/09/17/technology/instagram-teens-safety-privacy-changes.html",
			category: "technology",
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
				"連邦準備制度理事会（FRB）の大幅利下げを受け、S&P500が過去最高値を更新。この勢いが続き、2024年12月31日まで��� S&P500 が 5000 ポイントを超えるかどうかを予測。",
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
		<CardHeader className="flex flex-row items-start space-y-0 pb-2">
			<div className="mr-4">
				<ProviderIcon
					provider={provider}
					link={providerLink}
					iconPath={`/newsprovider/${provider}.png`}
				/>
			</div>
			<div className="flex-1">
				<CardTitle className="text-xl font-bold text-white mb-2">
					{title}
				</CardTitle>
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
	const [activeTab, setActiveTab] = useState("news");
	const [activeNewsCategory, setActiveNewsCategory] = useState("all");
	const [isBlinking, setIsBlinking] = useState(true);

	useEffect(() => {
		const blinkInterval = setInterval(() => {
			setIsBlinking((prev) => !prev);
		}, 1000);

		return () => clearInterval(blinkInterval);
	}, []);

	const newsCategories = [
		{ value: "all", label: "すべて", icon: NewspaperIcon },
		{ value: "politics", label: "政治", icon: UsersIcon },
		{ value: "business", label: "ビジネス", icon: DollarSignIcon },
		{ value: "technology", label: "テクノロジー", icon: TagIcon },
	];

	const filteredNews =
		activeNewsCategory === "all"
			? sampleData.newsItems
			: sampleData.newsItems.filter(
					(item) => item.category === activeNewsCategory
			  );

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
										<span className="text-2xl font-bold mr-2">NEWS LIVE</span>
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
													title={item.title}
													description={item.description}
													provider={item.provider}
													providerLink={item.providerLink}
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
