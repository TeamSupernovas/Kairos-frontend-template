import { createContext, useContext } from "react";

export const RecommendedContext = createContext({
  recommendedIds: new Set(),
  setRecommendedIds: () => {},
});

export const useRecommended = () => useContext(RecommendedContext);