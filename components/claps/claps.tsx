import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import cx from "classnames";
import Svg from "./svg";

export const MAX_CLAP = 30;
export const REACTION_DURATION = 600;

enum ReactionClass {
  default = "",
  no = "headShake animated",
  yes = "heartBeat animated",
}

export type IClapsProps = {
  key?: string;
  fixed: "left" | "center" | "right";
  replyUrl?: string;
  apiPath: string;
  iconClap?: null | React.ReactElement;
  iconReply?: null | React.ReactElement;
};

export default function Claps({
  key,
  fixed,
  replyUrl,
  apiPath = `/api/claps`,
  iconClap,
  iconReply,
}: IClapsProps) {
  const [ready, setReady] = useState(false);

  const [reaction, setReaction] = useState<ReactionClass>(
    ReactionClass.default
  );
  const [cacheCount, setCacheCount] = useState(0);
  const [data, setData] = useState({
    totalScore: 0,
    userScore: 0,
    totalUsers: 0,
  });

  const setReactionAnim = (reaction: ReactionClass) => {
    setReaction(reaction);
    return setTimeout(() => {
      setReaction(ReactionClass.default);
    }, REACTION_DURATION);
  };

  const onClapSaving = useCallback(
    debounce(async (score, data) => {
      try {
        if (data.userScore >= MAX_CLAP) {
          return setReactionAnim(ReactionClass.no);
        }

        const response = await fetch(apiPath, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ score, key }),
        });

        if (!response.ok) {
          return setReactionAnim(ReactionClass.no);
        }

        const newData = await response.json();
        setData(newData);

        setReactionAnim(ReactionClass.yes);
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

    return onClapSaving(value, data);
  };

  const getData = async () => {
    try {
      const response = await fetch(apiPath, {
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
      className={cx("claps-root", fixed && `claps-fixed-${fixed}`)}
      style={{
        // @ts-ignore
        "--animate-duration": `${REACTION_DURATION}ms`,
      }}
    >
      <div className={cx("claps-body", reaction)}>
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
          {iconClap ? (
            iconClap
          ) : (
            <Svg
              size={22}
              aria-label="Clap Icon"
              style={{ marginTop: "-.1em" }}
            >
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

        {replyUrl && (
          <>
            <span className="claps-divider" />

            <a
              href={replyUrl}
              rel="noopener noreferrer"
              target="_blank"
              className="claps-button claps-button-reply"
            >
              {iconReply ? (
                iconReply
              ) : (
                <Svg aria-label="Reply Icon">
                  <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
                </Svg>
              )}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
