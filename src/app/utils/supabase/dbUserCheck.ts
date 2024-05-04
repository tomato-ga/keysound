import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Supabaseサービスの設定
const supabaseUrl: string = process.env.SUPABASE_URL || ''
const supabaseAnonKey: string = process.env.SUPABASE_ANON_KEY || ''
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey)

// 指定されたメールアドレスに一致するレコードがあるかどうかを確認する関数
export async function checkUserExists(email: string): Promise<boolean> {
	const { data, error } = await supabase.from('User').select('email').eq('email', email)
	if (error) {
		// console.error('データ取得エラー:', error)
		return false
	}
	return data.length > 0 // データが存在する場合はtrue、存在しない場合はfalse
}
