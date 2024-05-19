import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'

interface YouTubeEmbedFormProps {
	onSubmit: (url: string, startTime: number) => void
}

interface FormValues {
	url: string
}

const YouTubeEmbedForm: React.FC<YouTubeEmbedFormProps> = ({ onSubmit }) => {
	const {
		register,
		control,
		formState: { errors }
	} = useForm<FormValues>()

	const extractStartTime = (url: string): number => {
		try {
			const urlObj = new URL(url)
			const t = urlObj.searchParams.get('t')
			if (t) {
				const timeString = t.replace('s', '') // '454s' の 's' を削除
				return parseInt(timeString)
			}
		} catch (error) {
			console.error('Invalid URL', error)
		}
		return 0 // t パラメータが存在しない場合、開始時間を0秒とする
	}

	const urlValue = useWatch({
		control,
		name: 'url'
	})

	useEffect(() => {
		if (urlValue) {
			const startTime = extractStartTime(urlValue)
			onSubmit(urlValue, startTime)
		}
	}, [urlValue])

	return (
		<div className="mt-8 mb-8">
			<h2 className="text-2xl font-semibold mb-2">YouTubeを引用する</h2>
			<div className="mb-4">
				<label htmlFor="url" className="block text-sm font-medium text-gray-700">
					YouTube URL:
				</label>
				<input
					type="text"
					id="url"
					{...register('url', { required: true })}
					className="mt-1 block w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
				/>
				{errors.url && <p className="mt-2 text-sm text-red-600">YouTube URL is required</p>}
			</div>
		</div>
	)
}

export default YouTubeEmbedForm
