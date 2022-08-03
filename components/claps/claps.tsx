import React, { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";
import cx from "classnames";
import Icons from "./icons";
import Share from "./share";

const REACTION_DURATION = 600;

enum ReactionClass {
  default = "",
  no = "headShake animated",
  yes = "heartBeat animated",
}

type IClapsFixedProps = "left" | "center" | "right";

export type IClapsProps = {
  key?: string;
  fixed?: IClapsFixedProps;
  replyUrl?: string;
  replyCount?: number | string;
  apiPath?: string;
  iconClap?: React.ReactElement;
  iconReply?: React.ReactElement;
  shareButton?: boolean;
};

export default function Claps({
  key,
  fixed,
  replyUrl,
  replyCount,
  apiPath = `/api/claps`,
  iconClap,
  iconReply,
  shareButton = true,
}: IClapsProps) {
  const [ready, setReady] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [reaction, setReaction] = useState<ReactionClass>(
    ReactionClass.default
  );

  const [cacheCount, setCacheCount] = useState<number>(0);
  const [data, setData] = useState<{
    totalScore: number;
    userScore: number;
    totalUsers: number;
    maxClaps: number;
  }>({
    totalScore: 0,
    userScore: 0,
    totalUsers: 0,
    maxClaps: 0,
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
        if (data.userScore >= data.maxClaps) {
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
    const value = cacheCount === data.maxClaps ? cacheCount : cacheCount + 1;
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
      className="claps-root"
      style={{
        // @ts-ignore
        "--animate-duration": `${REACTION_DURATION}ms`,
      }}
    >
      <Icons />
      {showShare && <Share onClose={() => setShowShare(false)} />}

      <div
        className={cx("claps-body", {
          [`claps-fixed claps-fixed-${fixed}`]: fixed,
        })}
      >
        <div className={cx("claps-buttons", reaction)}>
          <button
            disabled={!ready}
            title={`${data.totalUsers} users clapped`}
            aria-label="Clap"
            onClick={onClap}
            className={cx("claps-button claps-button-clap", {
              "claps-button-cache": cacheCount,
              clapped: data.userScore,
            })}
          >
            {iconClap || (
              <svg
                width="26"
                height="26"
                aria-label="clap"
                style={{ marginTop: -1 }}
              >
                {!data.userScore ? (
                  <use href="#icon-claps-fill" />
                ) : (
                  <use href="#icon-claps" />
                )}
              </svg>
            )}

            {ready && (
              <span className="claps-button-text">
                {data.totalScore + cacheCount}
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
                {iconReply || (
                  <svg width="22" height="22" aria-label="reply">
                    <use href="#icon-reply" />
                  </svg>
                )}
                {replyCount && (
                  <span className="claps-button-text">{replyCount}</span>
                )}
              </a>
            </>
          )}

          {shareButton && (
            <>
              <span className="claps-divider" />

              <button
                type="button"
                className="claps-button"
                onClick={() => {
                  setShowShare(true);
                }}
              >
                <svg width="20" height="20" aria-label="share">
                  <use href="#icon-dots" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
