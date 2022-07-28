import Claps from "components/claps/claps";
import { useEffect, useState } from "react";

export default function Home() {
  const [ready, setReady] = useState<boolean>(false);
  const [fixed, setFixed] = useState<"default" | "left" | "center" | "right">(
    "default"
  );
  const [replyUrl, setReplyUrl] = useState<string>(
    "https://github.com/upstash/claps"
  );

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-zinc-100 py-20 px-6">
      <main className="m-auto max-w-screen-sm">
        <header>
          <h1 className="text-4xl font-bold">
            <a href="https://github.com/upstash/claps" target="_blank">
              @upstash/claps
            </a>
          </h1>
          <h4 className="mt-4 text-xl">
            Add a claps button (like medium) to any page for your Next.js apps.
          </h4>
          <p className="mt-2 text-xl text-zinc-600">
            Nothing to maintain, it is completely serverless 💯
          </p>
        </header>

        <div className="mt-8">
          <Claps
            fixed={fixed === "default" ? undefined : fixed}
            replyUrl={replyUrl}
          />
        </div>

        <details className="mt-8 rounded bg-zinc-200 px-4 py-3" open>
          <summary className="cursor-pointer">Appearance</summary>

          <table className="mt-4 w-full">
            <tr>
              <td className="p-2">fixed:</td>
              <td className="p-2">
                <div className="flex items-center gap-2">
                  {["default", "left", "center", "right"].map((value) => (
                    <label
                      key={value}
                      className="flex cursor-pointer items-center"
                    >
                      <input
                        type="radio"
                        name="fixed"
                        checked={fixed === value}
                        onChange={() => setFixed(value as any)}
                      />
                      <span className="ml-1 capitalize">{value}</span>
                    </label>
                  ))}
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-2">replyUrl:</td>
              <td className="p-2">
                <input
                  className="w-full rounded p-2"
                  name="replyUrl"
                  value={replyUrl}
                  onChange={({ target }) => setReplyUrl(target.value)}
                />
              </td>
            </tr>
          </table>
        </details>

        <hr className="my-12" />

        <h2 className="text-3xl font-bold">Setup</h2>

        <p className="mt-4">
          You can refer to the{" "}
          <a
            className="underline"
            target="_blank"
            href="https://github.com/upstash/claps"
          >
            GitHub README
          </a>{" "}
          for the installation.
        </p>

        <hr className="my-12" />

        <div className="space-y-6 opacity-40">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error et
            iste numquam placeat, quasi quisquam sit? Blanditiis commodi
            delectus deleniti dolores eaque fuga id magni nemo pariatur
            quibusdam quidem, tenetur!
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error et
            iste numquam placeat, quasi quisquam sit? Blanditiis commodi
            delectus deleniti dolores eaque fuga id magni nemo pariatur
            quibusdam quidem, tenetur!
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error et
            iste numquam placeat, quasi quisquam sit? Blanditiis commodi
            delectus deleniti dolores eaque fuga id magni nemo pariatur
            quibusdam quidem, tenetur!
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error et
            iste numquam placeat, quasi quisquam sit? Blanditiis commodi
            delectus deleniti dolores eaque fuga id magni nemo pariatur
            quibusdam quidem, tenetur!
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error et
            iste numquam placeat, quasi quisquam sit? Blanditiis commodi
            delectus deleniti dolores eaque fuga id magni nemo pariatur
            quibusdam quidem, tenetur!
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error et
            iste numquam placeat, quasi quisquam sit? Blanditiis commodi
            delectus deleniti dolores eaque fuga id magni nemo pariatur
            quibusdam quidem, tenetur!
          </p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error et
            iste numquam placeat, quasi quisquam sit? Blanditiis commodi
            delectus deleniti dolores eaque fuga id magni nemo pariatur
            quibusdam quidem, tenetur!
          </p>
        </div>
      </main>
    </div>
  );
}
