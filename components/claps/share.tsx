import React from "react";

export default function Share({
  onClose = () => {},
}: {
  onClose?: () => void;
}) {
  const onAction = (action: string) => {
    const url = window.location.href;

    if (action === "clipboard") {
      navigator.clipboard.writeText(url);
    }
    //
    else if (action === "tweet") {
      // `https://twitter.com/intent/tweet?url=URL&text=TEXT`
      window.open(
        `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(
          document.title
        )}`
      );
    }
    //
    else if (action === "email") {
      // mailto:?subject=SUBJECT&body=BODY
      window.open(
        `mailto:?subject=${encodeURIComponent(
          document.title
        )}&body=${encodeURIComponent(url)}`
      );
    }
  };

  return (
    <div className="claps-share-modal">
      <div className="claps-share-content">
        <header className="claps-share-header">
          <h3>Share this page</h3>

          <button type="button" className="claps-share-close" onClick={onClose}>
            <svg width="20" height="20" aria-label="cancel">
              <use href="#icon-x" />
            </svg>
          </button>
        </header>

        <div className="claps-share-buttons">
          <button
            type="button"
            className="claps-share-button"
            onClick={() => onAction("clipboard")}
          >
            <span className="claps-share-button-icon">
              <svg width="26" height="26" aria-label="clipboard">
                <use href="#icon-clipboard" />
              </svg>
            </span>
            <span>Copy link</span>
          </button>

          <button
            type="button"
            className="claps-share-button"
            onClick={() => onAction("tweet")}
          >
            <span className="claps-share-button-icon">
              <svg width="26" height="26" aria-label="twitter">
                <use href="#icon-twitter" />
              </svg>
            </span>
            <span>Tweet</span>
          </button>

          <button
            type="button"
            className="claps-share-button"
            onClick={() => onAction("email")}
          >
            <span className="claps-share-button-icon">
              <svg width="26" height="26" aria-label="email">
                <use href="#icon-email" />
              </svg>
            </span>
            <span>Send email</span>
          </button>
        </div>
      </div>
    </div>
  );
}
