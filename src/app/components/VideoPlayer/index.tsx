import ReactPlayer from 'react-player'

interface VideoPlayerProps {
	videoUrl: string
}

export default function VideoPlayer({ videoUrl }: VideoPlayerProps) {
	return <ReactPlayer url={videoUrl} controls width="100%" height="auto" className="w-full h-48 md:h-64 object-cover" />
}
