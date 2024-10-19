import React, { createContext, useState } from "react";

export const SupplierContext = createContext();

export const SupplierProvider = ({ children }) => {
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  return (
    <SupplierContext.Provider value={{ selectedSupplier, setSelectedSupplier }}>
      {children}
    </SupplierContext.Provider>
  );
};