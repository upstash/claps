import { useState, useCallback, SetStateAction, Dispatch } from "react";
import debounce from "lodash.debounce";

const REACTION_DURATION = 600;

enum ReactionClass {
  default = "",
  no = "headShake animated",
  yes = "heartBeat animated",
}

interface IClapSavingAndInteraction {
  apiPath: string;
  setData: Dispatch<
    SetStateAction<{
      totalScore: number;
      userScore: number;
      totalUsers: number;
      maxClaps: number;
    }>
  >;
  key?: string;
}

const useClapSavingAndInteraction = ({
  apiPath,
  setData,
  key,
}: IClapSavingAndInteraction) => {
  const [reaction, setReaction] = useState(ReactionClass.default);
  const [cacheCount, setCacheCount] = useState(0);

  const setReactionAnim = (reaction: ReactionClass) => {
    setReaction(reaction);
    setTimeout(() => setReaction(ReactionClass.default), REACTION_DURATION);
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
        console.error("Error in clapping interaction:", error);
        setReactionAnim(ReactionClass.no);
      } finally {
        setCacheCount(0);
      }
    }, 1000),
    [apiPath, setData, setReactionAnim, setCacheCount]
  );

  return { onClapSaving, reaction, cacheCount, setCacheCount };
};

export default useClapSavingAndInteraction;
