"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, RefreshCw } from "lucide-react";

type Banner = {
  _id?: string;
  imageUrl: string;
  title: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  type: "hero" | "promotional";
};

export default function AdminBannersPage() {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const [banners, setBanners] = useState<Banner[]>([]);
  const [heroBanners, setHeroBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [heroPreview, setHeroPreview] = useState<string>("");

  const [bannerForm, setBannerForm] = useState<Banner>({
    imageUrl: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    isActive: true,
    type: "promotional",
  });

  const [heroForm, setHeroForm] = useState<Banner>({
    imageUrl: "",
    title: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    isActive: true,
    type: "hero",
  });

  // ✅ Fetch all banners
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setBanners(data.filter((b) => b.type === "promotional"));
          setHeroBanners(data.filter((b) => b.type === "hero"));
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    })();
  }, []);

  // ✅ Upload helper
  const handleFileUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.url) throw new Error("Upload failed");
      return data.url;
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  // ✅ Create new banner
  const createBanner = async (form: Banner) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        if (form.type === "promotional") setBanners((prev) => [...prev, data]);
        else setHeroBanners((prev) => [...prev, data]);

        // Reset
        if (form.type === "promotional") {
          setBannerForm({
            imageUrl: "",
            title: "",
            subtitle: "",
            buttonText: "",
            buttonLink: "",
            isActive: true,
            type: "promotional",
          });
          setBannerPreview("");
        } else {
          setHeroForm({
            imageUrl: "",
            title: "",
            subtitle: "",
            buttonText: "",
            buttonLink: "",
            isActive: true,
            type: "hero",
          });
          setHeroPreview("");
        }
      } else console.error("Error:", data);
    } catch (err) {
      console.error("Create banner failed:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchBanners = async () => {
    try {
      const res = await fetch(`${API_URL}/banners`);
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Invalid banner response:", data);
        return;
      }

      // ✅ Separate promo + hero banners
      const promos = data.filter((b) => b.type === "promotional");
      const heroes = data
        .filter((b) => b.type === "hero")
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

      setBanners(promos);
      setHeroBanners(heroes);
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);
  const deleteBanner = async (id: string, type: "promotional" | "hero") => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/banners/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (type === "promotional")
          setBanners((prev) => prev.filter((b) => b._id !== id));
        else setHeroBanners((prev) => prev.filter((b) => b._id !== id));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
  const toggleActive = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggle: true }),
      });

      if (!res.ok) console.error("Toggle failed", await res.json());
      await fetchBanners();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };
  const reorderHero = async (id: string, direction: "up" | "down") => {
    try {
      const res = await fetch(`${API_URL}/banners/reorder/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });

      if (!res.ok) console.error("Reorder failed", await res.json());
      await fetchBanners();
    } catch (err) {
      console.error("Reorder error:", err);
    }
  };

  // ✅ Delete banner

  const updateBanner = async (id: string, updatedData: Partial<Banner>) => {
    try {
      const res = await fetch(`${API_URL}/banners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        console.error("Update failed:", await res.json());
      }

      await fetchBanners();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-3xl font-bold mb-4">Banner Management</h1>

      <Tabs defaultValue="promotional" className="w-full">
        <TabsList className="flex space-x-4 border-b pb-2 mb-4">
          <TabsTrigger value="promotional">Promotional Banners</TabsTrigger>
          <TabsTrigger value="hero">Hero Section Images</TabsTrigger>
        </TabsList>

        {/* 🔹 Promotional Banners */}
        <TabsContent value="promotional">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Promotional Banners</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage homepage promotional banners
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <BannerForm
                form={bannerForm}
                setForm={setBannerForm}
                preview={bannerPreview}
                setPreview={setBannerPreview}
                handleUpload={handleFileUpload}
                createBanner={createBanner}
                loading={loading}
              />
              <BannerList
                banners={banners}
                deleteBanner={deleteBanner}
                toggleActive={toggleActive}
                reorderHero={reorderHero}   // not used here but safe
                updateBanner={updateBanner}
                type="promotional"
              />

            </CardContent>
          </Card>
        </TabsContent>

        {/* 🔹 Hero Banners */}
        <TabsContent value="hero">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Hero Section Images</CardTitle>
              <p className="text-sm text-muted-foreground">
                Manage homepage hero carousel images (recommended: 1920×500px)
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <BannerForm
                form={heroForm}
                setForm={setHeroForm}
                preview={heroPreview}
                setPreview={setHeroPreview}
                handleUpload={handleFileUpload}
                createBanner={createBanner}
                loading={loading}
              />
              <BannerList
                banners={heroBanners}
                deleteBanner={deleteBanner}
                toggleActive={toggleActive}
                reorderHero={reorderHero}
                updateBanner={updateBanner}
                type="hero"
              />

            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// 🧩 Reusable Banner Form Component
function BannerForm({
  form,
  setForm,
  preview,
  setPreview,
  handleUpload,
  createBanner,
  loading,
}: any) {
  return (
    <div className="space-y-3">
      <Label>Image URL *</Label>
      <div className="flex items-center space-x-2">
        <Input
          value={form.imageUrl}
          onChange={(e) =>
            setForm((prev: any) => ({ ...prev, imageUrl: e.target.value }))
          }
          placeholder="Enter image URL or upload"
        />
        <label>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setPreview(URL.createObjectURL(file));

              const url = await handleUpload(file);
              if (url) {
                setForm((prev: any) => ({ ...prev, imageUrl: url }));
                setPreview("");
              }
            }}
          />
          <Button asChild variant="outline" size="sm">
            <span className="cursor-pointer flex items-center space-x-1">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </span>
          </Button>
        </label>
      </div>

      {preview ? (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-auto mt-2 rounded border max-h-48 object-cover"
        />
      ) : form.imageUrl ? (
        <Image
          src={form.imageUrl}
          alt="Uploaded"
          width={800}
          height={200}
          className="rounded border object-cover mt-2 max-h-48"
        />
      ) : null}

      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm((p: any) => ({ ...p, title: e.target.value }))}
      />
      <Input
        placeholder="Subtitle"
        value={form.subtitle}
        onChange={(e) => setForm((p: any) => ({ ...p, subtitle: e.target.value }))}
      />
      <Input
        placeholder="Button Text"
        value={form.buttonText}
        onChange={(e) => setForm((p: any) => ({ ...p, buttonText: e.target.value }))}
      />
      <Input
        placeholder="Button Link"
        value={form.buttonLink}
        onChange={(e) => setForm((p: any) => ({ ...p, buttonLink: e.target.value }))}
      />

      <div className="flex items-center justify-between">
        <Label>Active</Label>
        <Switch
          checked={form.isActive}
          onCheckedChange={(checked) =>
            setForm((prev: any) => ({ ...prev, isActive: checked }))
          }
        />
      </div>

      <Button disabled={loading} onClick={() => createBanner(form)} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        {loading ? "Creating..." : "Create"}
      </Button>
    </div>
  );
}

// 🧩 Reusable Banner List Component
function BannerList({
  banners,
  deleteBanner,
  toggleActive,
  reorderHero,
  updateBanner,
  type,
}: any) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const startEdit = (banner: any) => {
    setEditingId(banner._id);
    setEditData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      buttonText: banner.buttonText || "",
      buttonLink: banner.buttonLink || "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (id: string) => {
    await updateBanner(id, editData);
    setEditingId(null);
  };

  return (
    <div className="space-y-3">
      {banners.map((b: Banner, index: number) => (
        <div
          key={b._id}
          className="flex items-center justify-between border rounded-lg p-2"
        >
          <div className="flex items-center space-x-3 w-full">
            <Image
              src={b.imageUrl}
              alt={b.title}
              width={120}
              height={60}
              className="rounded border object-cover"
            />

            <div className="flex-1">
              {editingId === b._id ? (
                <div className="space-y-2">
                  <Input
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((p: any) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="Title"
                  />
                  <Input
                    value={editData.subtitle}
                    onChange={(e) =>
                      setEditData((p: any) => ({
                        ...p,
                        subtitle: e.target.value,
                      }))
                    }
                    placeholder="Subtitle"
                  />
                  <div className="flex space-x-2">
                    <Input
                      value={editData.buttonText}
                      onChange={(e) =>
                        setEditData((p: any) => ({
                          ...p,
                          buttonText: e.target.value,
                        }))
                      }
                      placeholder="Button Text"
                    />
                    <Input
                      value={editData.buttonLink}
                      onChange={(e) =>
                        setEditData((p: any) => ({
                          ...p,
                          buttonLink: e.target.value,
                        }))
                      }
                      placeholder="Button Link"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <p className="font-semibold">{b.title}</p>
                  {b.subtitle && (
                    <p className="text-sm text-gray-500">{b.subtitle}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {b.isActive ? "Active" : "Inactive"}
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {/* {type === "hero" && (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => reorderHero(b._id!, "up")}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => reorderHero(b._id!, "down")}
                    disabled={index === banners.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </>
              )} */}

              <Button
                size="icon"
                variant="outline"
                onClick={() => toggleActive(b._id!)}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>

              {editingId === b._id ? (
                <>
                  <Button
                    size="icon"
                    variant="success"
                    onClick={() => saveEdit(b._id!)}
                  >
                    ✅
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={cancelEdit}
                  >
                    ❌
                  </Button>
                </>
              ) : (
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => startEdit(b)}
                >
                  ✏️
                </Button>
              )}

              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteBanner(b._id!, type)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
