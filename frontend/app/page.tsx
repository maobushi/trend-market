"use client";
import React from "react";
import Header from "@/components/Header/Header";
import Body from "@/components/Body/Body";
import { Button } from "@/components/ui/button";

const page = () => {
	const handleClick = async () => {
		console.log("Button clicked");
		const response = await fetch("/api/llm", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "gpt-4o-mini",
				content: "Hello, how are you?",
			}),
		});

		const data = await response.json();
		console.log(data);
	};

	return (
		<div>
			<Header />
			<Body />
			<Button onClick={handleClick}>Click me</Button>
		</div>
	);
};

export default page;
