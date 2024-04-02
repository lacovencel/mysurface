import type { Metadata } from "next";
import { Glory } from "next/font/google";
import "./globals.css";

const glory = Glory({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "MySurface",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${glory.className} bg-dark_gray`}>
				{children}
			</body>
		</html>
	);
}
