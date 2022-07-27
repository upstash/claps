import Claps from "components/claps/claps";
import type { IClapsFixedProps } from "components/claps/claps";
import { useState } from "react";

export default function Home() {
  const fixedDefaultValue = "default";

  const [fixed, setFixed] = useState<"default" | IClapsFixedProps>(
    fixedDefaultValue
  );
  const [replyUrl, setReplyUrl] = useState<undefined | string>(undefined);

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 bg-zinc-200 p-10">
      <Claps
        fixed={fixed === fixedDefaultValue ? undefined : fixed}
        replyUrl={replyUrl}
      />

      <div className="flex items-center gap-2">
        {["default", "left", "center", "right"].map((value) => (
          <label key={value} className="flex cursor-pointer items-center">
            <input
              type="radio"
              name="fixed"
              checked={fixed === value}
              onChange={() => setFixed(value as IClapsFixedProps)}
            />
            <span className="ml-1 capitalize">{value}</span>
          </label>
        ))}
      </div>

      <label className="">
        <input
          name="replyUrl"
          value={replyUrl}
          onChange={({ target }) => setReplyUrl(target.value)}
        />
      </label>
    </main>
  );
}
