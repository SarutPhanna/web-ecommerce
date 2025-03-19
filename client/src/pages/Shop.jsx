import React from "react";

const Shop = () => {
  return (
    <div className="flex">
      <div className="w-1/4 p-4 bg-gray-200 h-screen"> Searchbar</div>
      <div className="w-1/2 p-4 h-screen overflow-y-auto">
        <p className="text-2xl font-bold mb-4">All Products</p>
        <div>Product</div>
      </div>
      <div className="w-1/4 p-4 bg-gray-200 h-screen overflow-y-auto">Cart</div>
    </div>
  );
};

export default Shop;
