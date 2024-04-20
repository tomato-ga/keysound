// LoginPage.tsx
"use client";
import React, { useEffect, useState } from "react";
import Login from "@/app/components/Login";
import Logout from "@/app/components/Logout";
import { useSession } from "next-auth/react";
import { insertUserData } from "@/app/func/dbUserInsert";

const LoginPage = () => {
	const { data: session, status } = useSession();
	const [userExists, setUserExists] = useState(false);

	useEffect(() => {
		const insertUser = async () => {
			if (status === "authenticated" && session) {
				const name = session.user?.name || "";
				const email = session.user?.email || "";
				const image = session.user?.image || "";
				if (email) {
					try {
						const result = await insertUserData(name, email, image);
						setUserExists(result.userExists);
					} catch (error) {
						console.error("データ挿入時のエラー:", error);
						// エラーメッセージを表示するなどの適切な処理を行う
					}
				}
			}
		};
		if (status === "authenticated") {
			insertUser();
		}
	}, [status]);

	return (
		<div className="bg-gray-900 min-h-screen text-gray-300">
			<div className="container mx-auto px-4 py-8">
				{status === "authenticated" && session ? (
					<div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
						<div className="flex items-center justify-center mb-6">
							<img
								src={session.user?.image ?? ""}
								alt=""
								className="w-20 h-20 rounded-full mr-4"
							/>
							<div>
								<p className="text-xl font-semibold">
									ようこそ、{session.user?.name}さん
								</p>
								<p className="text-gray-400">
									セッションの期限：{session.expires}
								</p>
							</div>
						</div>
						{userExists && (
							<p className="text-green-400 mb-4">ユーザーは既に存在します</p>
						)}
						<div className="text-center">
							<Logout />
						</div>
					</div>
				) : (
					<div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
						<h2 className="text-2xl font-semibold mb-6 text-center">
							ログイン
						</h2>
						<Login />
					</div>
				)}
			</div>
		</div>
	);
};

export default LoginPage;
