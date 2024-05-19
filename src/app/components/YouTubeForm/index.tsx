import React from 'react'
import { useForm, Controller } from 'react-hook-form'

interface YouTubeEmbedFormProps {
	onUrlChange: (url: string) => void
}

interface FormValues {
	url: string
}

const YouTubeEmbedForm: React.FC<YouTubeEmbedFormProps> = ({ onUrlChange }) => {
	const {
		control,
		formState: { errors }
	} = useForm<FormValues>({
		defaultValues: { url: '' }
	})

	return (
		<div className="mt-8 mb-8">
			<h2 className="text-2xl font-semibold mb-2">YouTubeを引用する</h2>
			<Controller
				name="url"
				control={control}
				render={({ field }) => (
					<>
						<div className="mb-4">
							<label htmlFor="url" className="block text-sm font-medium text-gray-700">
								YouTube URL:
							</label>
							<input
								type="text"
								id="url"
								{...field}
								onChange={(e) => {
									field.onChange(e)
									onUrlChange(e.target.value)
								}}
								className="mt-1 block w-full bg-gray-50 border border-gray-400 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500"
							/>
							{errors.url && <p className="mt-2 text-sm text-red-600">YouTube URL is required</p>}
						</div>
					</>
				)}
				rules={{ required: true }}
			/>
		</div>
	)
}

export default YouTubeEmbedForm
