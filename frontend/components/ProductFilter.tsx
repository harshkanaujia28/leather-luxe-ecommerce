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
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category");
        setCategories(res.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleNestedChange = (field: keyof Filters, value: string) => {
    onFilterChange({
      ...filters,
      [field]: value,
      ...(field === "category" ? { subCategory: "" } : {}),
    });
  };

  const renderLabel = (label: string) => (
    <label className="block text-sm font-semibold mb-1 text-gray-700">{label}</label>
  );

  const inputClasses =
    "w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none transition";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6 sm:mb-10">
      {/* Category */}
      <div>
        {renderLabel("Category")}
        <select
          value={filters.category}
          onChange={(e) => handleNestedChange("category", e.target.value)}
          className={inputClasses}
        >
          <option value="">Select Category</option>
          {!loadingCategories &&
            categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.productType}
              </option>
            ))}
        </select>
      </div>

      {/* Subcategory */}
      <div>
        {renderLabel("Subcategory")}
        <select
          value={filters.subCategory}
          onChange={(e) => handleNestedChange("subCategory", e.target.value)}
          className={inputClasses + " disabled:opacity-50"}
          disabled={!filters.category}
        >
          <option value="">Select Subcategory</option>
          {!loadingCategories &&
            filters.category &&
            categories
              .find((cat) => cat._id === filters.category)
              ?.subCategories.map((sub, idx) => (
                <option key={idx} value={sub}>
                  {sub}
                </option>
              ))}
        </select>
      </div>

      {/* Gender */}
      <div>
        {renderLabel("Gender")}
        <select
          value={filters.gender}
          onChange={(e) => onFilterChange({ ...filters, gender: e.target.value })}
          className={inputClasses}
        >
          <option value="">All Genders</option>
          <option value="male">Men</option>
          <option value="female">Women</option>
          <option value="unisex">Unisex</option>
        </select>
      </div>

      {/* Min Price */}
      <div>
        {renderLabel("Min Price")}
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => onFilterChange({ ...filters, minPrice: e.target.value })}
          placeholder="₹0"
          className={inputClasses}
        />
      </div>

      {/* Max Price */}
      <div>
        {renderLabel("Max Price")}
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: e.target.value })}
          placeholder="₹10000"
          className={inputClasses}
        />
      </div>

      {/* Offer */}
      <div className="flex items-center gap-2 mt-2 sm:mt-0 col-span-full">
        <input
          type="checkbox"
          checked={filters.offer}
          onChange={(e) => onFilterChange({ ...filters, offer: e.target.checked })}
          className="h-4 w-4 text-yellow-500 border-gray-300 rounded focus:ring-2 focus:ring-yellow-400"
        />
        <span className="text-sm font-medium text-gray-700">Offer Only</span>
      </div>
    </div>
  );
};
