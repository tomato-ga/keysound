// /app/api/db/userSave.ts

import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/app/utils/supabase/supabase-js";

// エラーが持つ可能性のあるプロパティの型を定義
interface SupabaseError {
	message: string;
}

// エラーオブジェクトがSupabaseError型であるかどうかをチェックする関数
function isSupabaseError(error: unknown): error is SupabaseError {
	return typeof error === "object" && error !== null && "message" in error;
}

export default async function saveUser(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		return res.status(405).end("Method Not Allowed");
	}

	try {
		// const supa = supabase()
		const { user } = req.body;

		const { data, error } = await supabase.from("User").insert([user]);

		if (error) {
			// エラーオブジェクトの型がSupabaseErrorであるかチェック
			if (isSupabaseError(error)) {
				return res.status(500).json({ error: error.message });
			} else {
				return res.status(500).json({ error: "An unknown error occurred" });
			}
		}

		return res.status(200).json(data);
	} catch (error) {
		// catchブロックで受け取ったエラーも同様にチェック
		if (isSupabaseError(error)) {
			return res.status(500).json({ error: error.message });
		} else {
			return res.status(500).json({ error: "An unknown error occurred" });
		}
	}
}
