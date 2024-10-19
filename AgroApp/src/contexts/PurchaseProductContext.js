import React, { createContext, useState } from "react";

export const PurchaseProductContext = createContext();

export const PurchaseProductProvider = ({ children }) => {
  const [selectedProducts, setSelectedProducts] = useState([]);

  return (
    <PurchaseProductContext.Provider value={{ selectedProducts, setSelectedProducts }}>
      {children}
    </PurchaseProductContext.Provider>
  );
};