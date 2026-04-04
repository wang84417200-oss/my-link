export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-8 font-sans dark:bg-black">
      <main className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
          왕하은
        </h1>
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          안녕하세요. 심플하고 명확한 가치를 전달하는 개발자 왕하은입니다.
        </p>
        <div className="flex gap-4">
          <a
            href="mailto:contact@example.com"
            className="rounded-full bg-zinc-900 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Contact
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-zinc-200 px-6 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-900"
          >
            GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
