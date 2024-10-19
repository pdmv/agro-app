import React, { createContext, useState } from "react";

export const PurchaseOrderContext = createContext();

export const PurchaseOrderProvider = ({ children }) => {
  const [selectedPurchases, setSelectedPurchases] = useState([]);

  return (
    <PurchaseOrderContext.Provider value={{ selectedPurchases, setSelectedPurchases }}>
      {children}
    </PurchaseOrderContext.Provider>
  );
};