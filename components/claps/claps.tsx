import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import cx from "classnames";
import Svg from "./svg";

const STORAGE_KEY = "@upstash/claps";
export const MAX_CLAP = 10000;

export type IClapsProps = {
  key?: string;
  primaryColor?: string;
  secondaryColor?: string;
  clapColor?: string;
  iconClap?: null | React.ReactElement;
  reply?: boolean;
  iconReply?: null | React.ReactElement;
};

export default function Claps({
  key,
  primaryColor = "#fff",
  secondaryColor = "#000",
  clapColor = "#ff718d",
  iconClap,
  reply = true,
  iconReply,
}: IClapsProps) {
  const [ready, setReady] = useState(false);
  const [cacheCount, setCacheCount] = useState(0);

  const [clap, setClap] = useState(false);
  const [count, setCount] = useState(0);

  const onClapSaving = useCallback(
    debounce(async (score) => {
      try {
        const response = await fetch(`/api/claps/123`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score, key }),
        });

        if (!response.ok) {
          return;
        }

        const data = await response.json();

        setCount(data.score);
        onLiked();
      } catch (error) {
        console.error(error);
      } finally {
        setCacheCount(0);
      }
    }, 1000),
    []
  );

  const onLiked = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(true));
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
      setCount(data.score);
      setClap(data.clapped);
    } catch (error) {
      console.log(error);
    } finally {
      setReady(true);
    }
  };

  const checkUser = () => {
    const like = localStorage.getItem(STORAGE_KEY);
    if (!like) return;
    setClap(true);
  };

  useEffect(() => {
    // checkUser();
    getData();
  }, []);

  return (
    <div
      className="claps-root"
      style={{
        // @ts-ignore
        "--color-primary": primaryColor,
        "--color-secondary": secondaryColor,
        "--clap-like": clapColor,
      }}
    >
      <button
        disabled={!ready}
        aria-label="Clap"
        onClick={onClap}
        className={cx(
          "claps-button claps-button-clap",
          cacheCount ? "claps-button-cache" : "",
          clap ? "clapped" : ""
        )}
      >
        {iconClap === null ? null : iconClap ? (
          iconClap
        ) : (
          <Svg aria-label="Clap Icon">
            <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          </Svg>
        )}

        {ready && (
          <span className="claps-button-text">
            {count}{" "}
            {cacheCount > 0 && (
              <span className="claps-button-suffix">+ {cacheCount}</span>
            )}
          </span>
        )}
      </button>

      <span className="claps-divider" />

      {reply && (
        <button className="claps-button claps-button-reply" aria-label="Reply">
          {iconReply === null ? null : iconReply ? (
            iconReply
          ) : (
            <Svg aria-label="Reply Icon">
              <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
            </Svg>
          )}
        </button>
      )}
    </div>
  );
}
