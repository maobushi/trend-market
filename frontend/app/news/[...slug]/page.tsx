import React from "react";
import Header from "@/components/Header/Header";
import { createClient } from "@supabase/supabase-js";
import MarketGenerator from "@/components/MarketGenerator/MarketGenerator";

const supabase = createClient(
	process.env.NEXT_PUBLIC_SUPABASE_URL!,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const page = async ({ params }: { params: { slug: string[] } }) => {
	// const response = await fetch(`http://localhost:3000/api/llm`, {
	// 	method: "POST",
	// 	headers: {
	// 		"Content-Type": "application/json",
	// 	},
	// 	body: JSON.stringify({
	// 		systemMessage: "You are a helpful assistant.",
	// 		userMessage: "Hello, how are you?",
	// 	}),
	// });
	const { data: newsItem, error } = await supabase
		.from("news")
		.select("*")
		.eq("id", params.slug[0])
		.single();

	if (error) {
		console.error("Error fetching news item:", error);
		return <div>エラーが発生しました。</div>;
	}

	return (
		<div className="bg-gray-900 min-h-screen text-gray-300">
			<Header />
			<main className="container mx-auto px-4 py-12">
				<article className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700 mb-8">
					<div className="p-8">
						<h1 className="text-4xl font-bold mb-6 text-white">
							{newsItem.title || ""}
						</h1>
						<p className="text-xl text-gray-400 mb-8">
							{newsItem.description || ""}
						</p>
						<div className="flex flex-wrap text-sm text-gray-500 border-t border-gray-700 pt-6">
							<p className="mr-8 mb-3">
								Source:{" "}
								<a
									href={newsItem.provider_link || ""}
									className="text-indigo-400 hover:text-indigo-300 transition duration-300"
								>
									{newsItem.provider || ""}
								</a>
							</p>
							<p className="mr-8 mb-3">
								Published: {newsItem.published_at || ""}
							</p>
							<p className="mb-3">Category: {newsItem.category || ""}</p>
						</div>
					</div>
				</article>
				<MarketGenerator
					title={newsItem.title}
					description={newsItem.description}
					provider={newsItem.provider}
					provider_link={newsItem.provider_link}
					published_at={newsItem.published_at}
					category={newsItem.category}
				/>
			</main>
		</div>
	);
};

export default page;
// 		<div>
// 			<Header />
// 			<p>{JSON.stringify(data.message)}</p>
// 			<p>this page is {params.slug}</p>
// 		</div>
// 	);

// };

// export default page;
