import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import Confetti from "react-dom-confetti";

export type IClapsConfettiProps = {
  angle?: number;
  spread?: number;
  width?: string;
  height?: string;
  duration?: number;
  dragFriction?: number;
  stagger?: number;
  startVelocity?: number;
  elementCount?: number;
  decay?: number;
  colors?: string[];
  random?: () => number;
};

const config: IClapsConfettiProps = {
  angle: 90,
  spread: 130,
  startVelocity: 16,
  elementCount: 50,
  dragFriction: 0.1,
  duration: 3000,
  stagger: 20,
  width: "10px",
  height: "10px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

export const MAX_CLAP = 10;

export type IClapsProps = {
  primaryColor?: string;
  secondaryColor?: string;
};

export default function Claps({
  primaryColor = "#fff",
  secondaryColor = "#000",
}: IClapsProps) {
  const [ready, setReady] = useState(false);
  const [count, setCount] = useState(0);
  const [cacheCount, setCacheCount] = useState(0);

  const onClapSaving = useCallback(
    debounce(async (count) => {
      try {
        const response = await fetch(`/api/claps/123`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ count }),
        });

        setCacheCount(0);
        const data = await response.json();

        setCount(data.count);
      } catch (error) {
        console.error(error);
      }
    }, 1000),
    []
  );

  const onClap = () => {
    const value = cacheCount === MAX_CLAP ? cacheCount : cacheCount + 1;
    setCacheCount(value);
    return onClapSaving(value);
  };

  const getData = async () => {
    try {
      const response = await fetch(`/api/claps/123`, {
        method: "GET",
      });
      const data = await response.json();
      setCount(data.count);
    } catch (error) {
      console.log(error);
    } finally {
      setReady(true);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      className="claps"
      style={{
        // @ts-ignore
        "--color-primary": primaryColor,
        "--color-secondary": secondaryColor,
      }}
    >
      <button
        disabled={!ready}
        className="claps-button"
        onClick={onClap}
        aria-label="Clap"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" aria-label="Clap icon">
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.37.83L12 3.28l.63-2.45h-1.26zM13.92 3.95l1.52-2.1-1.18-.4-.34 2.5zM8.59 1.84l1.52 2.11-.34-2.5-1.18.4zM18.52 18.92a4.23 4.23 0 0 1-2.62 1.33l.41-.37c2.39-2.4 2.86-4.95 1.4-7.63l-.91-1.6-.8-1.67c-.25-.56-.19-.98.21-1.29a.7.7 0 0 1 .55-.13c.28.05.54.23.72.5l2.37 4.16c.97 1.62 1.14 4.23-1.33 6.7zm-11-.44l-4.15-4.15a.83.83 0 0 1 1.17-1.17l2.16 2.16a.37.37 0 0 0 .51-.52l-2.15-2.16L3.6 11.2a.83.83 0 0 1 1.17-1.17l3.43 3.44a.36.36 0 0 0 .52 0 .36.36 0 0 0 0-.52L5.29 9.51l-.97-.97a.83.83 0 0 1 0-1.16.84.84 0 0 1 1.17 0l.97.97 3.44 3.43a.36.36 0 0 0 .51 0 .37.37 0 0 0 0-.52L6.98 7.83a.82.82 0 0 1-.18-.9.82.82 0 0 1 .76-.51c.22 0 .43.09.58.24l5.8 5.79a.37.37 0 0 0 .58-.42L13.4 9.67c-.26-.56-.2-.98.2-1.29a.7.7 0 0 1 .55-.13c.28.05.55.23.73.5l2.2 3.86c1.3 2.38.87 4.59-1.29 6.75a4.65 4.65 0 0 1-4.19 1.37 7.73 7.73 0 0 1-4.07-2.25zm3.23-12.5l2.12 2.11c-.41.5-.47 1.17-.13 1.9l.22.46-3.52-3.53a.81.81 0 0 1-.1-.36c0-.23.09-.43.24-.59a.85.85 0 0 1 1.17 0zm7.36 1.7a1.86 1.86 0 0 0-1.23-.84 1.44 1.44 0 0 0-1.12.27c-.3.24-.5.55-.58.89-.25-.25-.57-.4-.91-.47-.28-.04-.56 0-.82.1l-2.18-2.18a1.56 1.56 0 0 0-2.2 0c-.2.2-.33.44-.4.7a1.56 1.56 0 0 0-2.63.75 1.6 1.6 0 0 0-2.23-.04 1.56 1.56 0 0 0 0 2.2c-.24.1-.5.24-.72.45a1.56 1.56 0 0 0 0 2.2l.52.52a1.56 1.56 0 0 0-.75 2.61L7 19a8.46 8.46 0 0 0 4.48 2.45 5.18 5.18 0 0 0 3.36-.5 4.89 4.89 0 0 0 4.2-1.51c2.75-2.77 2.54-5.74 1.43-7.59L18.1 7.68z"
          />
        </svg>
        <Confetti config={config} active={Boolean(!cacheCount)} />
        {ready && (
          <span className="claps-value">
            {count}{" "}
            {cacheCount > 0 && (
              <span className="claps-value-suffix">+ {cacheCount}</span>
            )}
          </span>
        )}
      </button>
    </div>
  );
}
