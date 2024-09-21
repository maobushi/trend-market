// app/api/chat/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
	try {
		const { model, content } = await request.json();

		if (!model || !content) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		const response = await axios.post(
			"https://api.red-pill.ai",
			{
				model,
				messages: [{ role: "user", content }],
				temperature: 0.7,
				max_tokens: 150,
			},
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${process.env.RED_PILL_API_KEY}`,
				},
			}
		);

		return NextResponse.json(response.data);
	} catch (error) {
		console.error("Error:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
