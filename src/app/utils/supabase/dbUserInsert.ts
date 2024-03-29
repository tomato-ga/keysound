import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabaseサービスの設定
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// データを挿入する非同期関数
export async function insertUserData(name: string, email: string): Promise<void> {
	try {
		const { data, error } = await supabase.from('User').insert([{ name: name, email: email }])

		if (error) {
			throw error
		}

		// console.log('挿入されたデータ:', data)
	} catch (error) {
		// console.error('データ挿入エラー:', error)
		// ここでユーザーに適切なフィードバック
	}
}
