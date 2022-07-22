import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import cx from "classnames";
import Svg from "./svg";

export const MAX_CLAP = 30;

export type IClapsProps = {
  url?: string;
  primaryColor?: string;
  secondaryColor?: string;
  clapColor?: string;
  iconClap?: null | React.ReactElement;
  reply?: boolean;
  iconReply?: null | React.ReactElement;
};

export default function Claps({
  url,
  primaryColor = "#fff",
  secondaryColor = "#000",
  clapColor = "#ff718d",
  iconClap,
  reply = true,
  iconReply,
}: IClapsProps) {
  const API_URL = `/api/claps`;
  const [ready, setReady] = useState(false);

  const [cacheCount, setCacheCount] = useState(0);
  const [data, setData] = useState({
    totalScore: 0,
    userScore: 0,
    totalUsers: 0,
  });

  const onClapSaving = useCallback(
    debounce(async (score) => {
      try {
        const response = await fetch(API_URL, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score, url }),
        });

        if (!response.ok) return;

        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setCacheCount(0);
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
      const response = await fetch(API_URL, {
        method: "GET",
      });

      if (!response.ok) return;

      const data = await response.json();
      setData(data);
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
        title={`${data.totalUsers} users clapped`}
        aria-label="Clap"
        onClick={onClap}
        className={cx(
          "claps-button claps-button-clap",
          cacheCount ? "claps-button-cache" : "",
          data.userScore ? "clapped" : ""
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
            {data.totalScore}{" "}
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
