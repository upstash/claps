import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import Confetti from "react-dom-confetti";

const storageKey = "@upstash/claps";

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
  spread: 50,
  startVelocity: 16,
  elementCount: 30,
  dragFriction: 0.1,
  duration: 1400,
  stagger: 5,
  width: "8px",
  height: "8px",
  colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
};

export const MAX_CLAP = 10;

export type IClapsProps = {
  primaryColor?: string;
  secondaryColor?: string;
  clapColor?: string;
  icon?: null | React.ReactElement;
};

export default function Claps({
  primaryColor = "#fff",
  secondaryColor = "#000",
  clapColor = "#ff718d",
  icon,
}: IClapsProps) {
  const [ready, setReady] = useState(false);
  const [clap, setClap] = useState(false);

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
        onLiked();
      } catch (error) {
        console.error(error);
      }
    }, 1000),
    []
  );

  const onLiked = () => {
    localStorage.setItem(storageKey, JSON.stringify(true));
    setClap(true);
  };

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

  const checkUser = () => {
    const like = localStorage.getItem(storageKey);
    if (!like) return;
    setClap(true);
  };

  useEffect(() => {
    checkUser();
    getData();
  }, []);

  return (
    <div
      className="claps"
      style={{
        // @ts-ignore
        "--color-primary": primaryColor,
        "--color-secondary": secondaryColor,
        "--clap-like": clapColor,
      }}
    >
      <button
        disabled={!ready || clap}
        className={
          "claps-button" +
          (cacheCount ? " claps-button-cache" : "") +
          (clap ? " claps-button-active" : "")
        }
        onClick={onClap}
        aria-label="Clap"
      >
        {icon === null ? null : icon ? (
          icon
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-label="Clap icon"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        )}

        <span className="claps-canvas">
          <Confetti config={config} active={Boolean(!cacheCount)} />
        </span>

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
