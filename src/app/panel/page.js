import Image from 'next/image'

export default function Home() {
  return (
    <main className="h-screen flex justify-center items-center">
      <span className="text-textGray bg-neutral-200 rounded-3xl px-3 py-2">
        Select a chat to start messaging
      </span>
    </main>
  )
}
