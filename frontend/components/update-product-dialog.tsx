"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
    Plus,
    X,
    Save,
    Eye,
    Package,
    ImageIcon,
    BarChart3,
    MessageSquare,
    Sparkles,
    Tag,
    Edit,
    AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useApi } from "@/contexts/api-context";
import { useRouter } from "next/navigation";

interface ProductFormData {
    id?: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    type: "Perfume" | "Attar" | "";
    gender: "Men" | "Women" | "";
    subCategory:
    | "Celebrity"
    | "Summer"
    | "Gym"
    | "Office"
    | "Winter"
    | "Party, Dates, Special Occasion"
    | "Traditional"
    | "Spiritual & Devotional"
    | "";
    seller: string;
    rating: number;
    reviews: {
        userId: string;
        name: string;
        comment: string;
        stars: number;
    }[];
    offer: {
        isActive: boolean;
        type: "percentage" | "fixed" | "bogo" | "bundle";
        value: number;
        startDate: string;
        endDate: string;
        description: string;
        minQuantity: number;
        maxUses: number;
    };
}

interface UpdateProductDialogProps {
    product?: ProductFormData;
    trigger?: React.ReactNode;
    onUpdate?: (product: ProductFormData) => void;
    onClose?: () => void;
}

export default function UpdateProductDialog({
    product,
    trigger,
    onUpdate,
    onClose,
}: UpdateProductDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [newQuantity, setNewQuantity] = useState("");
    const [newSubCategory, setNewSubCategory] = useState("");
    const { editProduct } = useApi();
    const { toast } = useToast();
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        description: "",
        price: 0,
        stock: 0,
        type: "",
        gender: "",
        subCategory: [] as string[], // ✅ yaha string array
        seller: "admin",
        reviews: [],
        images: [],
        quantity: [] as string[],
        features: [] as string[],
        specifications: {
            longevity: "",
            highlight: "", // ✅ सिर्फ highlight रहे
        },
        offer: {
            isActive: false,
            type: "percentage",
            value: 0,
            startDate: "",
            endDate: "",
            description: "",
            minQuantity: 1,
            maxUses: 1,
        },
    });


    const [newImage, setNewImage] = useState("");
    const [newFeature, setNewFeature] = useState("");
    const [newReview, setNewReview] = useState({
        userId: "",
        name: "",
        comment: "",
        stars: 5,
    });

    // Pre-fill form data when product prop changes or dialog opens
    useEffect(() => {
        if (product && open) {
            setFormData((prev) => ({
                ...prev,
                id: (product as any)._id || product.id,
                name: product.name || "",
                brand: product.brand || "",
                description: product.description || "",
                price: product.price || 0,
                stock: product.stock || 0,
                seller: product.seller || "admin",
                features: product.features || [],
                quantity: product.quantity || [],
                images: product.images || [],
                specifications: product.specifications || { longevity: "", highlight: "" }, // ✅ only highlight
                offer: product.offer || {
                    isActive: false,
                    type: "percentage",
                    value: 0,
                    startDate: "",
                    endDate: "",
                    description: "",
                    minQuantity: 1,
                    maxUses: 1,
                },
                type: product.category?.type || "Perfume",
                gender: product.category?.gender || "Unisex",
                subCategory: product.category?.subCategories || [], // ✅ multiple select
                reviews: product.reviews || [],
            }));
            setError(null);
        }
    }, [product, open]);



    const sellers = ["Seller 1", "Seller 2", "Seller 3", "Seller 4"];
    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        for (const file of files) {
            const formDataUpload = new FormData();
            formDataUpload.append("file", file);
            formDataUpload.append("upload_preset", "myCloud");

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/datxfosoi/image/upload",
                {
                    method: "POST",
                    body: formDataUpload,
                }
            );

            const data = await res.json();
            if (data.secure_url) {
                setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, data.secure_url],
                }));
            }
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleOfferChange = (field: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            offer: {
                ...prev.offer,
                [field]: value,
            },
        }));
    };

    const addImage = () => {
        if (newImage.trim() && !formData.images.includes(newImage.trim())) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, newImage.trim()],
            }));
            setNewImage("");
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const addReview = () => {
        if (newReview.name.trim() && newReview.comment.trim()) {
            setFormData((prev) => ({
                ...prev,
                reviews: [
                    ...prev.reviews,
                    { ...newReview, userId: `user_${Date.now()}` },
                ],
            }));
            setNewReview({
                userId: "",
                name: "",
                comment: "",
                stars: 5,
            });
        }
    };

    const removeReview = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            reviews: prev.reviews.filter((_, i) => i !== index),
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.name.trim()) {
            setError("Product name is required");
            return false;
        }
        if (!formData.seller) {
            setError("Please select a seller");
            return false;
        }
        if (formData.price <= 0) {
            setError("Price must be greater than 0");
            return false;
        }
        if (formData.stock < 0) {
            setError("Stock cannot be negative");
            return false;
        }
        return true;
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            const payload = {
                name: formData.name,
                brand: formData.brand,
                description: formData.description,
                price: formData.price,
                stock: formData.stock,
                seller: formData.seller || "admin",
                features: formData.features, // raw array
                quantity: formData.quantity,
                category: {
                    type: formData.type,
                    gender: formData.gender,
                    subCategories: formData.subCategory, // multiple select
                },
                specifications: formData.specifications || {},
                reviews: formData.reviews || [],
                images: formData.images,
                offer:
                    formData.offer && formData.offer.isActive && formData.offer.value > 0
                        ? formData.offer
                        : {}, // backend safeParse handles empty object
            };

            const updatedProduct = await editProduct(formData.id!, payload);

            toast({
                title: "Product updated",
                description: `${updatedProduct.name} was updated successfully.`,
                variant: "success",
            });

            if (onUpdate) onUpdate(updatedProduct);
            setOpen(false);
            if (onClose) onClose();
        } catch (error: any) {
            console.error("Failed to update product:", error);
            toast({
                title: "Update failed",
                description: error?.response?.data?.message || "Something went wrong",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        console.log("Preview Data:", formData);
        // You could open a preview modal here
        alert(
            "Preview functionality would open product preview (Check console for data)"
        );
    };

    const handleClose = () => {
        setOpen(false);
        setError(null);
        if (onClose) {
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" className="gap-2 bg-transparent">
                        <Edit className="w-4 h-4" />
                        Update Product
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden p-0 gap-0">
                <div className="flex flex-col h-full max-h-[95vh]">
                    {/* Fixed Header */}
                    <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-green-50">
                        <DialogTitle className="flex items-center gap-3 text-xl md:text-2xl font-bold text-slate-800">
                            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg">
                                <Edit className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            Update Product
                            {formData.name && (
                                <span className="text-sm md:text-base font-normal text-slate-600 truncate">
                                    - {formData.name}
                                </span>
                            )}
                        </DialogTitle>
                    </DialogHeader>

                    {/* Error Alert */}
                    {error && (
                        <div className="flex-shrink-0 px-4 sm:px-6 pt-4">
                            <Alert variant="destructive" className="border-red-200 bg-red-50">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {/* Scrollable Content */}
                    <ScrollArea className="flex-1 overflow-hidden">
                        <div className="p-4 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Tabs defaultValue="basic" className="w-full">
                                    {/* Sticky Tabs Navigation */}
                                    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm pb-4 border-b border-slate-100 mb-6">
                                        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-lg p-1 shadow-sm gap-1">
                                            <TabsTrigger
                                                value="basic"
                                                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-md transition-all duration-200 text-xs sm:text-sm py-2 px-2"
                                            >
                                                <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>Basic</span>
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="media"
                                                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-md transition-all duration-200 text-xs sm:text-sm py-2 px-2"
                                            >
                                                <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>Media</span>
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="inventory"
                                                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-md transition-all duration-200 text-xs sm:text-sm py-2 px-2"
                                            >
                                                <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>Stock</span>
                                            </TabsTrigger>
                                            {/* <TabsTrigger
                                                value="reviews"
                                                className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white rounded-md transition-all duration-200 text-xs sm:text-sm py-2 px-2"
                                            >
                                                <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                                                <span>Reviews</span>
                                            </TabsTrigger> */}
                                        </TabsList>
                                    </div>

                                    {/* Tab Contents */}
                                    <TabsContent value="basic" className="space-y-6 mt-0">
                                        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                                            <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 border-b border-slate-200 p-4">
                                                <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <Package className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    Basic Information
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-6">
                                                {/* Form fields with responsive layout */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="name"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Product Name *
                                                        </Label>
                                                        <Input
                                                            id="name"
                                                            value={formData.name}
                                                            onChange={(e) =>
                                                                handleInputChange("name", e.target.value)
                                                            }
                                                            placeholder="e.g., Royal Oud Attar"
                                                            required
                                                            className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="brand"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Brand
                                                        </Label>
                                                        <Input
                                                            id="brand"
                                                            value={formData.brand}
                                                            onChange={(e) =>
                                                                handleInputChange("brand", e.target.value)
                                                            }
                                                            placeholder="e.g., Luxe Fragrances"
                                                            className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {/* Enhanced Price Section with Slider */}
                                                    <div className="space-y-3">
                                                        <Label
                                                            htmlFor="price"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Price (₹) *
                                                        </Label>
                                                        <div className="space-y-3">
                                                            <div className="relative">
                                                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 font-medium">
                                                                    ₹
                                                                </span>
                                                                <Input
                                                                    id="price"
                                                                    type="number"
                                                                    min="0"
                                                                    max="50000"
                                                                    step="0.01"
                                                                    value={formData.price}
                                                                    onChange={(e) =>
                                                                        handleInputChange(
                                                                            "price",
                                                                            Number.parseFloat(e.target.value) || 0
                                                                        )
                                                                    }
                                                                    placeholder="1999.00"
                                                                    required
                                                                    className="h-10 pl-8 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200"
                                                                />
                                                            </div>
                                                            <div className="px-1">
                                                                <Slider
                                                                    value={[formData.price]}
                                                                    onValueChange={(value) =>
                                                                        handleInputChange("price", value[0])
                                                                    }
                                                                    max={50000}
                                                                    min={0}
                                                                    step={100}
                                                                    className="w-full"
                                                                />
                                                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                                                    <span>₹0</span>
                                                                    <span className="font-medium text-green-600">
                                                                        ₹{formData.price}
                                                                    </span>
                                                                    <span>₹50,000</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-4">
                                                        {/* Type */}
                                                        <div className="space-y-2">
                                                            <Label
                                                                htmlFor="type"
                                                                className="text-sm font-semibold text-slate-700"
                                                            >
                                                                Type
                                                            </Label>
                                                            <Select
                                                                value={formData.type}
                                                                onValueChange={(value) =>
                                                                    handleInputChange("type", value)
                                                                }
                                                            >
                                                                <SelectTrigger className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200">
                                                                    <SelectValue placeholder="Select type" />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-slate-200 shadow-xl max-h-60">
                                                                    {["Perfume", "Attar"].map((type) => (
                                                                        <SelectItem
                                                                            key={type}
                                                                            value={type}
                                                                            className="rounded-lg text-sm"
                                                                        >
                                                                            {type}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    </div>
                                                    {/* Gender */}
                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="gender"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Gender
                                                        </Label>
                                                        <Select
                                                            value={formData.gender}
                                                            onValueChange={(value) =>
                                                                handleInputChange("gender", value)
                                                            }
                                                        >
                                                            <SelectTrigger className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200">
                                                                <SelectValue placeholder="Select gender" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-slate-200 shadow-xl max-h-60">
                                                                {["Men", "Women", "Unisex"].map((gender) => (
                                                                    <SelectItem
                                                                        key={gender}
                                                                        value={gender}
                                                                        className="rounded-lg text-sm"
                                                                    >
                                                                        {gender}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    {/* Sub Category */}
                                                    <div className="space-y-1.5 sm:space-y-2">
                                                        <Label
                                                            htmlFor="subCategory"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Sub Category
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <select
                                                                value={newSubCategory}
                                                                onChange={(e) => setNewSubCategory(e.target.value)}
                                                                className="h-10 sm:h-11 border-slate-300 rounded px-2"
                                                            >
                                                                <option value="">Select Sub Category</option>
                                                                {[
                                                                    "Celebrity",
                                                                    "Summer",
                                                                    "Gym",
                                                                    "Office",
                                                                    "Winter",
                                                                    "Party, Dates, Special Occasion",
                                                                    "Traditional",
                                                                    "Spiritual & Devotional",
                                                                ].map((sub) => (
                                                                    <option key={sub} value={sub}>
                                                                        {sub}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (
                                                                        newSubCategory &&
                                                                        !(formData.subCategory || []).includes(newSubCategory)
                                                                    ) {
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            subCategory: [...(prev.subCategory || []), newSubCategory],
                                                                        }));
                                                                        setNewSubCategory("");
                                                                    }
                                                                }}
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>



                                                        {/* Selected subCategories show below */}
                                                        {formData.subCategory.map((sub) => (
                                                            <div
                                                                key={sub}
                                                                className="flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm"
                                                            >
                                                                {sub}
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            subCategory: prev.subCategory.filter((s) => s !== sub),
                                                                        }))
                                                                    }
                                                                    className="text-green-600 hover:text-green-900 font-bold"
                                                                >
                                                                    ×
                                                                </button>
                                                            </div>
                                                        ))}

                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-semibold text-slate-700">
                                                            Available Quantities (ML)
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={newQuantity}
                                                                onChange={(e) => setNewQuantity(e.target.value)}
                                                                placeholder="e.g., 40ml"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    if (
                                                                        newQuantity.trim() &&
                                                                        !formData.quantity.includes(
                                                                            newQuantity.trim()
                                                                        )
                                                                    ) {
                                                                        setFormData((prev) => ({
                                                                            ...prev,
                                                                            quantity: [
                                                                                ...prev.quantity,
                                                                                newQuantity.trim(),
                                                                            ],
                                                                        }));
                                                                        setNewQuantity("");
                                                                    }
                                                                }}
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>

                                                        <div className="flex flex-wrap gap-2 mt-2">
                                                            {formData.quantity.map((qty, index) => (
                                                                <Badge
                                                                    key={index}
                                                                    className="flex items-center gap-1"
                                                                >
                                                                    {qty}
                                                                    <Button
                                                                        type="button"
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="w-4 h-4 p-0"
                                                                        onClick={() =>
                                                                            setFormData((prev) => ({
                                                                                ...prev,
                                                                                quantity: prev.quantity.filter(
                                                                                    (_, i) => i !== index
                                                                                ),
                                                                            }))
                                                                        }
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </Button>
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>


                                                    <div className="space-y-4">
                                                        <div>
                                                            <Label className="text-sm font-semibold text-slate-700">
                                                                Longevity
                                                            </Label>
                                                            <Input
                                                                value={formData.specifications.longevity}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        specifications: {
                                                                            ...prev.specifications,
                                                                            longevity: e.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                                placeholder="e.g., 8-10 hours"
                                                            />
                                                        </div>

                                                        <div>
                                                            <Label className="text-sm font-semibold text-slate-700">
                                                                Best Use
                                                            </Label>
                                                            <Input
                                                                value={formData.specifications.highlight}
                                                                onChange={(e) =>
                                                                    setFormData((prev) => ({
                                                                        ...prev,
                                                                        specifications: {
                                                                            ...prev.specifications,
                                                                            highlight: e.target.value,
                                                                        },
                                                                    }))
                                                                }
                                                                placeholder="e.g., Perfect for parties, office, and casual outings"
                                                            />
                                                        </div>

                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-semibold text-slate-700">
                                                            Key Features
                                                        </Label>
                                                        <div className="flex gap-2">
                                                            <Input
                                                                value={newFeature}
                                                                onChange={(e) => setNewFeature(e.target.value)}
                                                                placeholder="e.g., Long-lasting"
                                                                className="h-10"
                                                            />
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    const value = newFeature.trim();
                                                                    if (
                                                                        value &&
                                                                        !formData.features.includes(value)
                                                                    ) {
                                                                        handleInputChange("features", [
                                                                            ...formData.features,
                                                                            value,
                                                                        ]);
                                                                        setNewFeature("");
                                                                    }
                                                                }}
                                                            >
                                                                Add
                                                            </Button>
                                                        </div>

                                                        {formData.features.length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {formData.features.map((feature, index) => (
                                                                    <Badge
                                                                        key={index}
                                                                        className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 border border-blue-300"
                                                                    >
                                                                        {feature}
                                                                        <Button
                                                                            type="button"
                                                                            size="icon"
                                                                            variant="ghost"
                                                                            className="w-4 h-4 p-0"
                                                                            onClick={() => {
                                                                                const updated =
                                                                                    formData.features.filter(
                                                                                        (_, i) => i !== index
                                                                                    );
                                                                                handleInputChange("features", updated);
                                                                            }}
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                        </Button>
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label
                                                            htmlFor="seller"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Seller *
                                                        </Label>
                                                        <Select
                                                            value={formData.seller}
                                                            onValueChange={(value) =>
                                                                handleInputChange("seller", value)
                                                            }
                                                        >
                                                            <SelectTrigger className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200">
                                                                <SelectValue placeholder="Select seller" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                                                <SelectItem value="admin">admin</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label
                                                        htmlFor="description"
                                                        className="text-sm font-semibold text-slate-700"
                                                    >
                                                        Product Description
                                                    </Label>
                                                    <Textarea
                                                        id="description"
                                                        value={formData.description}
                                                        onChange={(e) =>
                                                            handleInputChange("description", e.target.value)
                                                        }
                                                        placeholder="A sophisticated blend of amber and vanilla with hints of bergamot, perfect for special occasions..."
                                                        rows={3}
                                                        className="border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg transition-all duration-200 resize-none"
                                                    />
                                                </div>

                                                {/* Enhanced Offer Section */}
                                                <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl overflow-hidden">
                                                    <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 border-b border-amber-200 p-4">
                                                        <div className="flex items-center justify-between">
                                                            <CardTitle className="flex items-center gap-3 text-amber-800">
                                                                <div className="p-2 bg-amber-200 rounded-lg">
                                                                    <Sparkles className="w-4 h-4 text-amber-700" />
                                                                </div>
                                                                Special Offer Settings
                                                            </CardTitle>
                                                            <Switch
                                                                id="offerActive"
                                                                checked={formData.offer?.isActive ?? false}
                                                                onCheckedChange={(checked) =>
                                                                    handleOfferChange("isActive", checked)
                                                                }
                                                                className="data-[state=checked]:bg-amber-500"
                                                            />
                                                        </div>
                                                    </CardHeader>
                                                    {formData.offer?.isActive && (
                                                        <CardContent className="p-4 space-y-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-2">
                                                                    <Label
                                                                        htmlFor="offerType"
                                                                        className="text-sm font-semibold text-amber-800"
                                                                    >
                                                                        Offer Type
                                                                    </Label>
                                                                    <Select
                                                                        value={formData.offer.type}
                                                                        onValueChange={(value) =>
                                                                            handleOfferChange("type", value)
                                                                        }
                                                                    >
                                                                        <SelectTrigger className="h-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg">
                                                                            <SelectValue placeholder="Select offer type" />
                                                                        </SelectTrigger>
                                                                        <SelectContent className="rounded-xl border-amber-200 shadow-xl">
                                                                            <SelectItem
                                                                                value="percentage"
                                                                                className="rounded-lg"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <Tag className="w-4 h-4" />
                                                                                    Percentage Discount
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem
                                                                                value="fixed"
                                                                                className="rounded-lg"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <Tag className="w-4 h-4" />
                                                                                    Fixed Amount Off
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem
                                                                                value="bogo"
                                                                                className="rounded-lg"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <Tag className="w-4 h-4" />
                                                                                    Buy One Get One
                                                                                </div>
                                                                            </SelectItem>
                                                                            <SelectItem
                                                                                value="bundle"
                                                                                className="rounded-lg"
                                                                            >
                                                                                <div className="flex items-center gap-2">
                                                                                    <Tag className="w-4 h-4" />
                                                                                    Bundle Deal
                                                                                </div>
                                                                            </SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>

                                                                {/* Enhanced Offer Value with Slider */}
                                                                <div className="space-y-3">
                                                                    <Label
                                                                        htmlFor="offerValue"
                                                                        className="text-sm font-semibold text-amber-800"
                                                                    >
                                                                        {formData.offer.type === "percentage"
                                                                            ? "Discount (%)"
                                                                            : formData.offer.type === "fixed"
                                                                                ? "Amount Off (₹)"
                                                                                : "Offer Value"}
                                                                    </Label>
                                                                    <div className="space-y-3">
                                                                        <Input
                                                                            id="offerValue"
                                                                            type="number"
                                                                            min="0"
                                                                            max={
                                                                                formData.offer.type === "percentage"
                                                                                    ? "100"
                                                                                    : "10000"
                                                                            }
                                                                            step={
                                                                                formData.offer.type === "percentage"
                                                                                    ? "1"
                                                                                    : "0.01"
                                                                            }
                                                                            value={formData.offer.value}
                                                                            onChange={(e) =>
                                                                                handleOfferChange(
                                                                                    "value",
                                                                                    Number.parseFloat(e.target.value) || 0
                                                                                )
                                                                            }
                                                                            placeholder={
                                                                                formData.offer.type === "percentage"
                                                                                    ? "25"
                                                                                    : "500.00"
                                                                            }
                                                                            className="h-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg"
                                                                        />
                                                                        <div className="px-1">
                                                                            <Slider
                                                                                value={[formData.offer.value]}
                                                                                onValueChange={(value) =>
                                                                                    handleOfferChange("value", value[0])
                                                                                }
                                                                                max={
                                                                                    formData.offer.type === "percentage"
                                                                                        ? 100
                                                                                        : 10000
                                                                                }
                                                                                min={0}
                                                                                step={
                                                                                    formData.offer.type === "percentage"
                                                                                        ? 1
                                                                                        : 50
                                                                                }
                                                                                className="w-full"
                                                                            />
                                                                            <div className="flex justify-between text-xs text-amber-600 mt-1">
                                                                                <span>
                                                                                    0
                                                                                    {formData.offer.type === "percentage"
                                                                                        ? "%"
                                                                                        : ""}
                                                                                </span>
                                                                                <span className="font-medium text-amber-700">
                                                                                    {formData.offer.value}
                                                                                    {formData.offer.type === "percentage"
                                                                                        ? "%"
                                                                                        : ""}
                                                                                </span>
                                                                                <span>
                                                                                    {formData.offer.type === "percentage"
                                                                                        ? "100%"
                                                                                        : "₹10,000"}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-2">
                                                                <Label
                                                                    htmlFor="offerDescription"
                                                                    className="text-sm font-semibold text-amber-800"
                                                                >
                                                                    Offer Description
                                                                </Label>
                                                                <Input
                                                                    id="offerDescription"
                                                                    value={formData.offer.description}
                                                                    onChange={(e) =>
                                                                        handleOfferChange(
                                                                            "description",
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    placeholder="e.g., Summer Sale - Limited Time Only!"
                                                                    className="h-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg"
                                                                />
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label
                                                                        htmlFor="startDate"
                                                                        className="text-sm font-semibold text-amber-800"
                                                                    >
                                                                        Start Date
                                                                    </Label>
                                                                    <Input
                                                                        id="startDate"
                                                                        type="datetime-local"
                                                                        value={formData.offer.startDate}
                                                                        onChange={(e) =>
                                                                            handleOfferChange(
                                                                                "startDate",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="h-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label
                                                                        htmlFor="endDate"
                                                                        className="text-sm font-semibold text-amber-800"
                                                                    >
                                                                        End Date
                                                                    </Label>
                                                                    <Input
                                                                        id="endDate"
                                                                        type="datetime-local"
                                                                        value={formData.offer.endDate}
                                                                        onChange={(e) =>
                                                                            handleOfferChange(
                                                                                "endDate",
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        className="h-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg"
                                                                    />
                                                                </div>
                                                            </div>

                                                            {/* Enhanced Min Quantity and Max Uses with Sliders */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                <div className="space-y-3">
                                                                    <Label
                                                                        htmlFor="minQuantity"
                                                                        className="text-sm font-semibold text-amber-800"
                                                                    >
                                                                        Minimum Quantity
                                                                    </Label>
                                                                    <div className="space-y-3">
                                                                        <Input
                                                                            id="minQuantity"
                                                                            type="number"
                                                                            min="1"
                                                                            max="100"
                                                                            value={formData.offer.minQuantity}
                                                                            onChange={(e) =>
                                                                                handleOfferChange(
                                                                                    "minQuantity",
                                                                                    Number.parseInt(e.target.value) || 1
                                                                                )
                                                                            }
                                                                            placeholder="1"
                                                                            className="h-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg"
                                                                        />
                                                                        <div className="px-1">
                                                                            <Slider
                                                                                value={[formData.offer.minQuantity]}
                                                                                onValueChange={(value) =>
                                                                                    handleOfferChange(
                                                                                        "minQuantity",
                                                                                        value[0]
                                                                                    )
                                                                                }
                                                                                max={100}
                                                                                min={1}
                                                                                step={1}
                                                                                className="w-full"
                                                                            />
                                                                            <div className="flex justify-between text-xs text-amber-600 mt-1">
                                                                                <span>1</span>
                                                                                <span className="font-medium text-amber-700">
                                                                                    {formData.offer.minQuantity}
                                                                                </span>
                                                                                <span>100</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-3">
                                                                    <Label
                                                                        htmlFor="maxUses"
                                                                        className="text-sm font-semibold text-amber-800"
                                                                    >
                                                                        Max Uses (0 = unlimited)
                                                                    </Label>
                                                                    <div className="space-y-3">
                                                                        <Input
                                                                            id="maxUses"
                                                                            type="number"
                                                                            min="0"
                                                                            max="1000"
                                                                            value={formData.offer.maxUses}
                                                                            onChange={(e) =>
                                                                                handleOfferChange(
                                                                                    "maxUses",
                                                                                    Number.parseInt(e.target.value) || 0
                                                                                )
                                                                            }
                                                                            placeholder="0"
                                                                            className="h-10 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg"
                                                                        />
                                                                        <div className="px-1">
                                                                            <Slider
                                                                                value={[formData.offer.maxUses]}
                                                                                onValueChange={(value) =>
                                                                                    handleOfferChange("maxUses", value[0])
                                                                                }
                                                                                max={1000}
                                                                                min={0}
                                                                                step={10}
                                                                                className="w-full"
                                                                            />
                                                                            <div className="flex justify-between text-xs text-amber-600 mt-1">
                                                                                <span>0</span>
                                                                                <span className="font-medium text-amber-700">
                                                                                    {formData.offer.maxUses === 0
                                                                                        ? "Unlimited"
                                                                                        : formData.offer.maxUses}
                                                                                </span>
                                                                                <span>1000</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Offer Preview */}
                                                            <div className="mt-4 p-3 bg-white rounded-xl border border-amber-200 shadow-sm">
                                                                <h4 className="font-semibold text-sm text-amber-800 mb-2 flex items-center gap-2">
                                                                    <Eye className="w-4 h-4" />
                                                                    Offer Preview:
                                                                </h4>
                                                                <div className="text-sm space-y-2">
                                                                    {formData.offer.type === "percentage" &&
                                                                        formData.offer.value > 0 && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                                                    {formData.offer.value}% OFF
                                                                                </Badge>
                                                                                <span className="text-green-700 font-medium">
                                                                                    Save ₹
                                                                                    {(
                                                                                        (formData.price *
                                                                                            formData.offer.value) /
                                                                                        100
                                                                                    ).toFixed(2)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    {formData.offer.type === "fixed" &&
                                                                        formData.offer.value > 0 && (
                                                                            <div className="flex items-center gap-2">
                                                                                <Badge className="bg-green-100 text-green-800 border-green-200">
                                                                                    ₹{formData.offer.value} OFF
                                                                                </Badge>
                                                                                <span className="text-green-700 font-medium">
                                                                                    Final Price: ₹
                                                                                    {(
                                                                                        formData.price -
                                                                                        formData.offer.value
                                                                                    ).toFixed(2)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    {formData.offer.description && (
                                                                        <p className="text-amber-700 font-medium">
                                                                            {formData.offer.description}
                                                                        </p>
                                                                    )}
                                                                    {formData.offer.startDate &&
                                                                        formData.offer.endDate && (
                                                                            <p className="text-amber-600 text-xs bg-amber-50 px-2 py-1 rounded">
                                                                                Valid:{" "}
                                                                                {new Date(
                                                                                    formData.offer.startDate
                                                                                ).toLocaleDateString()}{" "}
                                                                                -{" "}
                                                                                {new Date(
                                                                                    formData.offer.endDate
                                                                                ).toLocaleDateString()}
                                                                            </p>
                                                                        )}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    )}
                                                </Card>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="media" className="space-y-6 mt-0">
                                        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                                            <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 border-b border-slate-200 p-4">
                                                <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <ImageIcon className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    Product Images
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-4">
                                                <div className="space-y-4">
                                                    <Label className="text-sm font-semibold text-slate-700">
                                                        Product Images
                                                    </Label>
                                                    <div className="flex gap-3">
                                                        <Input
                                                            type="file"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="flex-1 h-10 sm:h-11 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg text-sm sm:text-base"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                                                        {formData.images.map((file, index) => (
                                                            <div key={index} className="relative group">
                                                                <div className="relative overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-50 aspect-square">
                                                                    <img
                                                                        src={
                                                                            typeof file === "string"
                                                                                ? file
                                                                                : file instanceof File
                                                                                    ? URL.createObjectURL(file)
                                                                                    : ""
                                                                        }
                                                                        alt={`Product ${index + 1}`}
                                                                        className="h-120 w-120 object-cover rounded"
                                                                    />

                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="sm"
                                                                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-full w-6 h-6 p-0"
                                                                        onClick={() => removeImage(index)}
                                                                    >
                                                                        <X className="w-3 h-3" />
                                                                    </Button>

                                                                    <Badge className="absolute bottom-1 left-1 text-xs bg-white/90 text-slate-700">
                                                                        {index + 1}
                                                                    </Badge>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="inventory" className="space-y-6 mt-0">
                                        <Card className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
                                            <CardHeader className="bg-gradient-to-r from-slate-50 to-green-50 border-b border-slate-200 p-4">
                                                <CardTitle className="flex items-center gap-3 text-lg text-slate-800">
                                                    <div className="p-2 bg-green-100 rounded-lg">
                                                        <BarChart3 className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    Inventory & Rating
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-4 space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {/* Enhanced Stock with Slider */}
                                                    <div className="space-y-3">
                                                        <Label
                                                            htmlFor="stock"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Stock Quantity
                                                        </Label>
                                                        <div className="space-y-3">
                                                            <Input
                                                                id="stock"
                                                                type="number"
                                                                min="0"
                                                                max="1000"
                                                                value={formData.stock}
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "stock",
                                                                        Number.parseInt(e.target.value) || 1
                                                                    )
                                                                }
                                                                placeholder="1"
                                                                className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                                                            />
                                                            <div className="px-1">
                                                                <Slider
                                                                    value={[formData.stock]}
                                                                    onValueChange={(value) =>
                                                                        handleInputChange("stock", value[0])
                                                                    }
                                                                    max={1000}
                                                                    min={0}
                                                                    step={1}
                                                                    className="w-full"
                                                                />
                                                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                                                    <span>0</span>
                                                                    <span className="font-medium text-green-600">
                                                                        {formData.stock} units
                                                                    </span>
                                                                    <span>1000</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Enhanced Rating with Slider */}
                                                    {/* <div className="space-y-3">
                                                        <Label
                                                            htmlFor="rating"
                                                            className="text-sm font-semibold text-slate-700"
                                                        >
                                                            Product Rating (0-5)
                                                        </Label>
                                                        <div className="space-y-3">
                                                            <Input
                                                                id="rating"
                                                                type="number"
                                                                min="0"
                                                                max="5"
                                                                step="0.1"
                                                                value={formData.rating}
                                                                onChange={(e) =>
                                                                    handleInputChange(
                                                                        "rating",
                                                                        Number.parseFloat(e.target.value) || 0
                                                                    )
                                                                }
                                                                placeholder="0"
                                                                className="h-10 border-slate-300 focus:border-green-500 focus:ring-green-500/20 rounded-lg"
                                                            />
                                                            <div className="px-1">
                                                                <Slider
                                                                    value={[formData.rating]}
                                                                    onValueChange={(value) =>
                                                                        handleInputChange("rating", value[0])
                                                                    }
                                                                    max={5}
                                                                    min={0}
                                                                    step={0.1}
                                                                    className="w-full"
                                                                />
                                                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                                                    <span>0 ⭐</span>
                                                                    <span className="font-medium text-yellow-600">
                                                                        {formData.rating}{" "}
                                                                        {"⭐".repeat(Math.floor(formData.rating))}
                                                                    </span>
                                                                    <span>5 ⭐</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </form>
                        </div>
                    </ScrollArea>

                    {/* Fixed Footer */}
                    <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-4">
                        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePreview}
                                disabled={loading}
                                className="w-full sm:w-auto border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 bg-transparent"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                Preview Changes
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}
                                disabled={loading}
                                className="w-full sm:w-auto bg-transparent"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-600 hover:from-green-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Update Product
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent >
        </Dialog >
    );
}
