import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabaseサービスの設定
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// データを挿入する非同期関数
export async function insertUserData(name: string, email: string): Promise<void> {
	const { data, error } = await supabase
		.from('User') // 対象のテーブル名を指定
		.insert([
			{ name: name, email: email } // 挿入するデータ
		])

	if (error) {
		console.error('データ挿入エラー:', error)
		return
	}

	console.log('挿入されたデータ:', data)
}
