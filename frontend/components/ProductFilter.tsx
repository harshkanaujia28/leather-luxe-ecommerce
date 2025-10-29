"use client";

import React, { useEffect, useState } from "react";
import api from "@/utils/axios";

type Filters = {
  category: string;
  subCategory: string;
  gender: string;
  minPrice: string;
  maxPrice: string;
  offer: boolean;
};

interface Category {
  _id: string;
  productType: string;
  subCategories: string[];
}

interface Props {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export const ProductFilter: React.FC<Props> = ({ filters, onFilterChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get("/category").then((res) => setCategories(res.data));
  }, []);

  const handleNestedChange = (field: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
      ...(field === "category" ? { subCategory: "" } : {}),
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6 sm:mb-10">

      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) => handleNestedChange("category", e.target.value)}
        className="border p-2 rounded-md w-full"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.productType}
          </option>
        ))}
      </select>

      {/* Subcategory */}
      <select
        value={filters.subCategory}
        onChange={(e) => handleNestedChange("subCategory", e.target.value)}
        className="border p-2 rounded-md w-full"
        disabled={!filters.category}
      >
        <option value="">Select Subcategory</option>
        {filters.category &&
          categories
            .find((c) => c._id === filters.category)
            ?.subCategories.map((sub, i) => (
              <option key={i} value={sub}>
                {sub}
              </option>
            ))}
      </select>

      {/* Gender */}
      <select
        value={filters.gender}
        onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
        className="border p-2 rounded-md w-full"
      >
        <option value="">All Genders</option>
        <option value="male">Men</option>
        <option value="female">Women</option>
        <option value="unisex">Unisex</option>
      </select>

      <input
        type="number"
        placeholder="Min ₹"
        value={filters.minPrice}
        onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
        className="border p-2 rounded-md w-full"
      />

      <input
        type="number"
        placeholder="Max ₹"
        value={filters.maxPrice}
        onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
        className="border p-2 rounded-md w-full"
      />

      <div className="flex items-center gap-2 col-span-full mt-2">
        <input
          type="checkbox"
          checked={filters.offer}
          onChange={(e) => onFilterChange({ ...filters, offer: e.target.checked })}
        />
        <span>Offer Only</span>
      </div>
    </div>
  );
};
