import React, { useState } from "react";
import cx from "clsx";
import Icons from "./icons";
import Share from "./share";
import useClapData from "./hooks/useClapData";
import useClapSavingAndInteraction from "./hooks/useClapSavingAndInteraction";

const REACTION_DURATION = 600;

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
  const { data, setData, ready } = useClapData(apiPath);

  const { onClapSaving, reaction, cacheCount, setCacheCount } =
    useClapSavingAndInteraction({ apiPath, setData, key });

  const [showShare, setShowShare] = useState<boolean>(false);

  const onClap = () => {
    const value = cacheCount === data.maxClaps ? cacheCount : cacheCount + 1;
    setCacheCount(value);

    return onClapSaving(value, data);
  };

  return (
    <div
      className={cx("claps-root", {
        [`claps-fixed claps-fixed-${fixed}`]: fixed,
      })}
      style={{
        // @ts-ignore
        "--animate-duration": `${REACTION_DURATION}ms`,
      }}
    >
      <Icons />
      {showShare && <Share onClose={() => setShowShare(false)} />}

      <div className={cx("claps-body", reaction)}>
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
              width="24"
              height="24"
              aria-label="clap"
              style={{ marginTop: -2 }}
            >
              {data.userScore ? (
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
  );
}
