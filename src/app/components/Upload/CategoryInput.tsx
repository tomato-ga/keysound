import Box from '@mui/joy/Box'
import FormLabel from '@mui/joy/FormLabel'
import Radio from '@mui/joy/Radio'
import RadioGroup from '@mui/joy/RadioGroup'
import Sheet from '@mui/joy/Sheet'

interface CategoryInputProps {
	currentCategory: string
	onCategoryChange: (category: string) => void
}

export default function CategoryInput({ currentCategory, onCategoryChange }: CategoryInputProps) {
	const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		onCategoryChange(e.target.value)
	}


	return (
		<Box sx={{ width: 300 }}>
			<FormLabel
				id="storage-label"
				sx={{
					mb: 2,
					fontWeight: 'xl',
					textTransform: 'uppercase',
					fontSize: 'xs',
					letterSpacing: '0.15rem'
				}}
			>
				<h2 className="text-2xl font-semibold ">キーボードの種類</h2>
			</FormLabel>
			<RadioGroup
				aria-labelledby="keyboard-label"
				size="lg"
				sx={{ gap: 1.5 }}
				name="category"
				onChange={handleCategoryChange}
				value={currentCategory}
			>
				{[
					{ id: '1', name: 'カスタム' },
					{ id: '2', name: '自作' },
					{ id: '3', name: 'メーカー' }
				].map((category) => (
					<Sheet key={category.id} sx={{ p: 2, borderRadius: 'md', boxShadow: 'sm' }}>
						<Radio
							label={`${category.name}キーボード`}
							overlay
							disableIcon
							value={category.id}
							slotProps={{
								label: ({ checked }) => ({
									sx: {
										fontWeight: 'lg',
										fontSize: 'md',
										color: checked ? 'text.primary' : 'text.secondary'
									}
								}),
								action: ({ checked }) => ({
									sx: (theme) => ({
										...(checked && {
											'--variant-borderWidth': '2px',
											'&&': {
												borderColor: theme.vars.palette.primary[500] // 青いボーダーを適用
											}
										})
									})
								})
							}}
						/>
					</Sheet>
				))}
			</RadioGroup>
		</Box>
	)
}
