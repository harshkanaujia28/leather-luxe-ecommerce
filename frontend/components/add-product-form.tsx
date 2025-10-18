"use client";

import { useState, useEffect } from "react";
import api from "@/utils/axios";

type ColorType = { color: string; images: File[] };
type VariantType = { name: string; stock: number };
type OfferType = {
  isActive: boolean;
  type: string;
  value: number;
  startDate: string;
  endDate: string;
  description: string;
  minQuantity: number;
  maxUses: number;
};

export default function AddProductForm({ onSubmit }: { onSubmit?: (product: any) => void }) {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    brandImage: "",
    price: 0,
    originalPrice: 0,
    description: "",
    category: { category: "", subCategory: "", gender: "" },
    variants: [{ name: "", stock: 0 }] as VariantType[],
    specifications: { material: "", colors: [{ color: "", images: [] as File[] }] as ColorType[] },
    features: [] as string[],
    offer: { isActive: false, type: "", value: 0, startDate: "", endDate: "", description: "", minQuantity: 0, maxUses: 0 } as OfferType,
    featured: false,
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<"basic" | "stock" | "specifications" | "offers">("basic");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category");
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (field: string, value: any) =>
    setProduct(prev => ({ ...prev, [field]: value }));

  const handleNestedChange = (parent: string, field: string, value: any) =>
    setProduct(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));

  const handleArrayChange = (parentPath: string, index: number, field: string, value: any) => {
    const keys = parentPath.split(".");
    const arr = [...keys.reduce((acc, key) => acc[key], product)];
    arr[index][field] = value;
    setProduct(prev => {
      const copy: any = { ...prev };
      let obj: any = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = arr;
      return copy;
    });
  };

  const addArrayItem = (parentPath: string, template: any) => {
    const keys = parentPath.split(".");
    setProduct(prev => {
      const copy: any = { ...prev };
      let obj: any = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = [...obj[keys[keys.length - 1]], template];
      return copy;
    });
  };

  const removeArrayItem = (parentPath: string, index: number) => {
    const keys = parentPath.split(".");
    setProduct(prev => {
      const copy: any = { ...prev };
      let obj: any = copy;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      const arr = [...obj[keys[keys.length - 1]]];
      arr.splice(index, 1);
      obj[keys[keys.length - 1]] = arr;
      return copy;
    });
  };

  const handleColorFileChange = (index: number, files: FileList) => {
    const colors = [...product.specifications.colors];
    colors[index].images = Array.from(files);
    setProduct(prev => ({ ...prev, specifications: { ...prev.specifications, colors } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      if (!product.name || !product.price) throw new Error("Name and Price are required");
      if (!product.specifications.material) throw new Error("Material required");
      if (!product.specifications.colors.every(c => c.color)) throw new Error("Each color must have a name");

      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("brand", product.brand);
      formData.append("brandImage", product.brandImage);
      formData.append("price", String(product.price));
      formData.append("originalPrice", String(product.originalPrice));
      formData.append("description", product.description);
      formData.append("featured", String(product.featured));
      formData.append("category", JSON.stringify(product.category));
      formData.append("variants", JSON.stringify(product.variants));
      formData.append("features", JSON.stringify(product.features));

      // Append specs without files first
      formData.append(
        "specifications",
        JSON.stringify({
          ...product.specifications,
          colors: product.specifications.colors.map(c => ({ color: c.color })),
        })
      );

      formData.append(
        "offer",
        JSON.stringify(product.offer.isActive ? product.offer : { isActive: false })
      );

      // ✅ Append all image files correctly
      product.specifications.colors.forEach((color, index) => {
        color.images.forEach((file) => {
          formData.append(`colorImages_${index}`, file);
        });
      });


      // ✅ Let Axios handle multipart headers automatically
      const res = await api.post("/products", formData, {
        headers: {}, // no manual content-type
      });

      alert("✅ Product added!");
      onSubmit?.(res.data.product);
    } catch (err: any) {
      console.error("❌ Upload failed:", err);
      alert("❌ " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const renderLabel = (text: string, hint?: string) => (
    <label className="block text-sm font-medium text-[#4b3a2f] mb-1">{text} {hint && <span className="text-xs text-gray-500">({hint})</span>}</label>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto bg-[#f5efe6] shadow-lg rounded-2xl p-8 space-y-8 border border-[#c5a880]">
      <h2 className="text-2xl font-bold text-[#4b3a2f] border-b border-[#c5a880] pb-3">Add New Product</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {["basic", "stock", "specifications", "offers"].map(tab => (
          <button
            key={tab}
            type="button"
            className={`px-4 py-2 rounded-md ${activeTab === tab ? "bg-[#4b3a2f] text-white" : "bg-[#e6d8c5] text-[#4b3a2f]"}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Basic Tab */}
      {activeTab === "basic" && (
        <div className="grid md:grid-cols-3 gap-5">
          <div>
            {renderLabel("Product Name")}
            <input type="text" value={product.name} onChange={e => handleChange("name", e.target.value)} className="input-brown" required />
          </div>
          <div>
            {renderLabel("Brand")}
            <input type="text" value={product.brand} onChange={e => handleChange("brand", e.target.value)} className="input-brown" required />
          </div>
          <div>
            {renderLabel("Brand Image URL")}
            <input type="text" value={product.brandImage} onChange={e => handleChange("brandImage", e.target.value)} className="input-brown" />
          </div>
          <div className="col-span-3">
            {renderLabel("Description")}
            <textarea value={product.description} onChange={e => handleChange("description", e.target.value)} className="textarea-brown" />
          </div>
          <div>
            {renderLabel("Category")}
            <select value={product.category.category} onChange={e => handleNestedChange("category", "category", e.target.value)} className="input-brown">
              <option value="">Select Category</option>
              {!loadingCategories && categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.productType}</option>
              ))}
            </select>
          </div>
          <div>
            {renderLabel("Subcategory")}
            <select value={product.category.subCategory} onChange={e => handleNestedChange("category", "subCategory", e.target.value)} className="input-brown">
              <option value="">Select Subcategory</option>
              {!loadingCategories && product.category.category && categories
                .find(cat => cat._id === product.category.category)
                ?.subCategories.map((sub: string, idx: number) => <option key={idx} value={sub}>{sub}</option>)}
            </select>
          </div>
          <div>
            {renderLabel("Gender")}
            <select value={product.category.gender}
              onChange={e => handleNestedChange("category", "gender", e.target.value)}
              className="input-brown">
              <option value="">Select Gender</option>
              <option value="male">Men</option>
              <option value="female">Women</option>   {/* <-- must be "female" not "women" */}
              <option value="unisex">Unisex</option>
            </select>

          </div>
        </div>
      )}

      {/* Stock Tab */}
      {activeTab === "stock" && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            {renderLabel("Price")}
            <input type="number" value={product.price} onChange={e => handleChange("price", Number(e.target.value))} className="input-brown" />
          </div>
          <div>
            {renderLabel("Original Price")}
            <input type="number" value={product.originalPrice} onChange={e => handleChange("originalPrice", Number(e.target.value))} className="input-brown" />
          </div>
          <div className="col-span-2">
            {renderLabel("Variants")}
            {product.variants.map((v, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input type="text" placeholder="Name" value={v.name} onChange={e => handleArrayChange("variants", i, "name", e.target.value)} className="input-brown" />
                <input type="number" placeholder="Stock" value={v.stock} onChange={e => handleArrayChange("variants", i, "stock", Number(e.target.value))} className="input-brown" />
                <button type="button" onClick={() => removeArrayItem("variants", i)} className="btn-red">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem("variants", { name: "", stock: 0 })} className="btn-green">+ Add Variant</button>
          </div>
        </div>
      )}

      {/* Specifications Tab */}
      {activeTab === "specifications" && (
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            {renderLabel("Material")}
            <input type="text" value={product.specifications.material} onChange={e => handleNestedChange("specifications", "material", e.target.value)} className="input-brown" />
          </div>
          {product.specifications.colors.map((c, i) => (
            <div key={i} className="mb-3">
              {renderLabel(`Color ${i + 1}`)}
              <input type="text" placeholder="Color name (e.g., Red)" value={c.color} onChange={e => handleArrayChange("specifications.colors", i, "color", e.target.value)} className="input-brown mb-2" />
              <input type="file" multiple onChange={e => handleColorFileChange(i, e.target.files!)} className="input-brown file:cursor-pointer mb-1" />
              <button type="button" onClick={() => removeArrayItem("specifications.colors", i)} className="btn-red mt-1">Remove Color</button>
            </div>
          ))}
          <button type="button" onClick={() => addArrayItem("specifications.colors", { color: "", images: [] })} className="btn-green">+ Add Color</button>
        </div>
      )}

      {/* Offers Tab */}
      {activeTab === "offers" && (
        <div className="grid md:grid-cols-2 gap-3">
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={product.offer.isActive} onChange={e => handleNestedChange("offer", "isActive", e.target.checked)} />
            {renderLabel("Offer Active")}
          </div>
          {["type", "value", "startDate", "endDate", "description", "minQuantity", "maxUses"].map(field => (
            <div key={field}>
              {renderLabel(field.charAt(0).toUpperCase() + field.slice(1))}
              <input
                type={field.includes("Date") ? "date" : field.includes("value") || field.includes("Quantity") || field.includes("Uses") ? "number" : "text"}
                value={product.offer[field as keyof typeof product.offer] as any}
                onChange={e => handleNestedChange("offer", field, e.target.value)}
                className="input-brown"
              />
            </div>
          ))}
          <div className="col-span-2 flex items-center gap-2">
            <input type="checkbox" checked={product.featured} onChange={e => handleChange("featured", e.target.checked)} />
            {renderLabel("Featured Product")}
          </div>
        </div>
      )}

      <button type="submit" disabled={uploading} className="w-full mt-4 py-3 rounded-lg bg-[#4b3a2f] hover:bg-[#3a2d23] text-white font-semibold transition-all">
        {uploading ? "Uploading..." : "Add Product"}
      </button>
    </form>
  );
}
