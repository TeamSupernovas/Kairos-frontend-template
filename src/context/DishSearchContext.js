import { createContext, useContext, useState } from "react";

const DishSearchContext = createContext();

export const DishSearchProvider = ({ children }) => {
  const [dishes, setDishes] = useState([]);

  return (
    <DishSearchContext.Provider value={{ dishes, setDishes }}>
      {children}
    </DishSearchContext.Provider>
  );
};

export const useDishSearch = () => useContext(DishSearchContext);
