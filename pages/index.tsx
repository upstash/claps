import Claps from "components/claps/claps";

export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-200 p-10">
      <Claps replyUrl="https://github.com/upstash/claps" />
    </main>
  );
}
