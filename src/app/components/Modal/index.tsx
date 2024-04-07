// components/Modal.tsx
import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'

interface ModalProps {
	onClose: () => void
	children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose()
			}
		}

		document.addEventListener('keydown', handleEscape)

		return () => {
			document.removeEventListener('keydown', handleEscape)
		}
	}, [onClose])

	const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
		if (event.target === event.currentTarget) {
			onClose()
		}
	}

	return ReactDOM.createPortal(
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50"
			onClick={handleOverlayClick}
		>
			<div className="bg-white rounded-lg p-6 max-w-xl">{children}</div>
		</div>,
		document.body
	)
}

export default Modal
