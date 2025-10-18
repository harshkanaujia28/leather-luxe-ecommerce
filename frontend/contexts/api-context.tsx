"use client";

import React, { createContext, useContext, useReducer, useEffect, useState, useRef } from "react";
import axios from "@/utils/axios"; // your configured axios instance
import { io, Socket } from "socket.io-client";


// ==================
// Types
// ==================
// Define state type
interface ApiState {
    user: User | null;
}
interface ApiContextType {
    user: User | null;                     // currently logged-in user
    loading: boolean;                      // true while checking persistent login
    login(email: string, password: string): Promise<User>; // returns logged-in user
    logout(): void;                        // clears token and user, redirects to /login
    getProfile(): Promise<User | null>;    // fetches user profile if token exists
}
// apiTypes.ts

// export interface SalesData {
//   month: string;
//   revenue: number;
//   orders: number;
//   customers: number;
// }

// export interface Vendor {
//   vendor: string;
//   totalPurchases: number;
//   orders: number;
//   avgDeliveryTime: number;
//   qualityRating: number;
//   onTimeDelivery: number;
//   paymentTerms: string;
//   status: string;
// }

// export interface Product {
//   name: string;
//   sales: number;
//   units: number;
//   category: string;
// }

// export interface Brand {
//   brand: string;
//   sales: number;
//   orders: number;
//   growth: number;
// }

// export interface CustomerSegment {
//   segment: string;
//   count: number;
//   revenue: number;
//   avgOrder: number;
// }

// export interface Payment {
//   status: string;
//   count: number;
//   amount: number;
//   percentage: number;
// }

// export interface ReportResponse {
//   salesData: SalesData[];
//   vendors: Vendor[];
//   products: Product[];
//   brands: Brand[];
// //   customers: CustomerSegment[];
//   payments: Payment[];
// }
export interface SalesData {
    month: string
    revenue: number
    orders: number
    customers: number
}

export interface VendorPerformance {
    vendor: string
    totalPurchases: number
    orders: number
    avgDeliveryTime: number
    qualityRating: number
    onTimeDelivery: number
    paymentTerms: string
    status: string
}

export interface ProductPerformance {
    name: string
    sales: number
    units: number
    category: string
}

export interface BrandPerformance {
    brand: string
    sales: number
    orders: number
    growth: number
}

export interface TopUser {
    user: {
        _id: string
        name: string
        email: string
        // Add any additional user fields needed in frontend
    }
    totalOrders: number
    revenue: number
}

export interface Overview {
    totalOrders: number
    totalRevenue: number
    totalUsers: number
    totalProducts: number
}

export interface PaymentStatusBreakdown {
    status: string
    count: number
    amount: number
}

export interface ReportResponse {
    salesData: {
        period: string
        salesData: SalesData[]
        vendors: VendorPerformance[]
        products: ProductPerformance[]
        brands: BrandPerformance[]
        topUsers: TopUser[]
        users: UserReport[];
        createdAt: string
        updatedAt: string
        _id: string
    }[]
    vendors: VendorPerformance[]
    products: ProductPerformance[]
    brands: BrandPerformance[]
    overview: Overview
    payments: PaymentStatusBreakdown[]
}


export interface DeliveryZone {
    id: number;
    pincode: string;
    area: string;
    city: string;
    state: string;
    deliveryFee: number;
    deliveryTime: string;
    isActive: boolean;
    zoneType: "Metro" | "Tier 1" | "Tier 2" | "Tier 3" | "Rural";
    assignedVendors: number[];
    coverage: number;
}

export interface BasicVendor {
    id: number;
    name: string;
    active: boolean;
}


export interface LegalDocument {
    id: string;
    title: string;
    content: string;
    lastModified: string;
    modifiedBy: string;
    version: string;
    isPublished: boolean;
    wordCount: number;
    history?: LegalDocumentHistory[]; // optional
}

export interface LegalDocumentHistory {
    version: string;
    content: string;
    modifiedBy: string;
    modifiedAt: string;
    wordCount: number;
}

type UserReport = {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
};
export interface Category {
    id: number;
    name: string;
    description: string;
    products: number;
    image: string;
    status: "Active" | "Inactive";
}

export interface Brand {
    id: number;
    name: string;
    description: string;
    fragrances: number;
    image: string;
    status: "Active" | "Inactive" | "Pending";
    country: string;
    founded: string;
    totalSales: number;
    rating: number;
    marketShare: number;
    category: "Luxury" | "Designer" | "Niche" | "Celebrity" | "Mass Market";
}

export interface Coupon {
    _id: string
    code: string
    type: string
    value: string
    minOrder?: string
    usage?: string
    usedCount?: number
    totalLimit: number
    status: string
    expiry?: string
    createdDate?: string
    startDate?: string
    description?: string
}


export interface Refund {
    id: string;
    customer: string;
    email: string;
    orderId: string;
    amount: number;
    status: "pending" | "processed" | "failed";
    method: "credit_card" | "paypal" | "bank_transfer" | string;
    date: string;
    reason: string;
    fragrance: string;
}

export interface ReturnRequest {
    id: string;
    customer: string;
    email: string;
    orderId: string;
    status: "pending_approval" | "approved" | "completed" | "rejected";
    reason: string;
    date: string;
    items: ReturnItem[];
    totalRefund: number;
    returnMethod: "mail" | "replacement_sent" | string;
}

export interface ReturnItem {
    name: string;
    reason: string;
    condition: "unopened" | "partially_used" | "damaged";
    refundAmount: number;
}

export interface SupportTicket {
    id: string;
    customer: string;
    email: string;
    subject: string;
    priority: "low" | "medium" | "high";
    status: "open" | "in_progress" | "resolved" | "closed";
    category: "product_issue" | "shipping_issue" | "billing" | "general";
    date: string;
    lastUpdate: string;
    orderId: string;
    fragrance: string;
    description: string;
}


export interface CartItem {
    id: string
    name: string
    price: number
    image: string
    quantity: number
    brand: string
}
// export interface Order {
//     id: string
//     customer: string
//     email: string
//     total: number
//     status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
//     date: string // ISO date format (e.g. "2024-01-15")
//     items: number // total number of items in the order
// types/OrderType.ts

export interface Order {
    _id: string;
    customer: string;
    email: string;
    total: number;
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
    date: string;
    items: number;
    paymentStatus?: string;
    fragrances?: string[];
    products: Array<{
        product: Product;  // or just `string` if you only store the product ID
        quantity: number;
    }>;
}
// types/api-types.ts or inline in api-context.tsx

// types/api-types.ts (or near your api context)


export type VendorAnalytics = {
    vendor: string
    totalPurchases: number
    orders: number
    avgDeliveryTime: number
    qualityRating: number
    onTimeDelivery: number
    paymentTerms: string
    status: string
}

export type ProductAnalytics = {
    name: string
    sales: number
    units: number
    category: string
}

export type BrandAnalytics = {
    brand: string
    sales: number
    orders: number
    growth: number
}

// export type CustomerSegment = {
//     segment: string
//     count: number
//     revenue: number
//     avgOrder: number
// }

export type PaymentAnalytics = {
    status: string
    count: number
    amount: number
    percentage: number
}

export type PurchaseOrderTrend = {
    month: string
    orders: number
    value: number
    avgValue: number
}

export type VendorCategoryDistribution = {
    category: string
    value: number
    vendors: number
    totalSpend: number
}

export type TopVendorByCategory = {
    vendor: string
    category: string
    products: number
    revenue: number
}

// export type ReportData = {
//     period: "day" | "month" | "year"
//     salesData: SalesData[]
//     vendors: Vendor[]
//     products: Product[]
//     brands: Brand[]
//     customerSegments: CustomerSegment[]
//     payments: PaymentAnalytics[]
//     purchaseOrders: PurchaseOrderTrend[]
//     vendorCategoryDistribution: VendorCategoryDistribution[]
//     topVendorsByCategory: TopVendorByCategory[]
// }


export interface Vendor {
    _id: string
    name: string
    email: string
    phone: string
    address: string
    companyName: string
    profileImage: string
    products: string[]
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export interface ContactMessage {
    id: string
    name: string
    email: string
    phone?: string
    subject: string
    message: string
    createdAt: string // ISO date string
    isRead: boolean
}

export interface Subscriber {
    id: string
    email: string
    subscribedAt: string // ISO date string
    isVerified?: boolean // Optional: if you implement email verification
}
interface AdminStats {
    totalRevenue: number;
    totalOrders: number;
    topSellingProducts: string[];
    newUsers: number;
}
// types/user.ts

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    role: "admin" | "User" | "vendor";
    createdAt: string;
    updatedAt: string;
}
export interface Review {
    userId: string
    name: string
    comment: string
    stars: number
}

export type OfferType = "percentage" | "fixed" | "bogo" | "bundle"

export interface Offer {
    isActive: boolean;
    type: OfferType;
    value: number;
    startDate: string;
    endDate: string;
    description: string;
    minQuantity: number;
    maxUses: number;
    product?: string; // ID of linked product
}

export interface Product {
    _id?: string;
    name: string;
    brand: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    category: {
        type: "Perfume" | "Attar";
        gender: "Men" | "Women";
        subCategory:
        | "Celebrity"
        | "Summer"
        | "Gym"
        | "Office"
        | "Winter"
        | "Party, Dates, Special Occasion"
        | "Traditional"
        | "Spiritual & Devotional";
    };
    seller?: string;
    rating: number;
    reviews: any[];
    offer?: Offer;
}


interface Banner {
    _id: string
    type: "promotional" | "hero"
    title: string
    imageUrl: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    description?: string
    linkUrl?: string
    priority?: number
    startDate?: string
    endDate?: string
    subtitle?: string
    buttonText?: string
    buttonLink?: string
    order?: number
}

// types/AdminSettingsTypes.ts

export type GeneralSettings = {
    storeName: string
    storeDescription: string
    storeEmail: string
    storePhone: string
    storeAddress: string
    timezone: string
    currency: string
    language: string
    maintenanceMode: boolean
    allowRegistration: boolean
    requireEmailVerification: boolean
}

export type PaymentSettings = {
    stripeEnabled: boolean
    stripePublishableKey: string
    stripeSecretKey: string
    paypalEnabled: boolean
    paypalClientId: string
    paypalClientSecret: string
    applePay: boolean
    googlePay: boolean
    testMode: boolean
    minimumOrderAmount: number
    taxRate: number
    taxIncluded: boolean
}

export type ShippingSettings = {
    freeShippingThreshold: number
    standardShippingRate: number
    expressShippingRate: number
    internationalShipping: boolean
    internationalRate: number
    processingTime: string
    standardDelivery: string
    expressDelivery: string
    weightBasedShipping: boolean
    shippingZones: string[]
}

export type EmailSettings = {
    smtpHost: string
    smtpPort: number
    smtpUsername: string
    smtpPassword: string
    fromName: string
    fromEmail: string
    orderConfirmation: boolean
    shippingNotification: boolean
    deliveryConfirmation: boolean
    newsletterEnabled: boolean
    marketingEmails: boolean
}

export type SecuritySettings = {
    twoFactorAuth: boolean
    sessionTimeout: number
    passwordMinLength: number
    requireSpecialChars: boolean
    maxLoginAttempts: number
    lockoutDuration: number
    ipWhitelist: string
    sslForced: boolean
    dataRetention: number
    gdprCompliance: boolean
}

export type AppearanceSettings = {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    darkMode: boolean
    logoUrl: string
    faviconUrl: string
    customCSS: string
    headerLayout: string
    footerLayout: string
    productGridColumns: number
}

export type NotificationSettings = {
    newOrderAlert: boolean
    lowStockAlert: boolean
    newUserRegistration: boolean
    systemUpdates: boolean
    securityAlerts: boolean
    backupNotifications: boolean
    emailNotifications: boolean
    smsNotifications: boolean
    pushNotifications: boolean
    slackWebhook: string
}
export interface BannerInput extends Omit<Banner, '_id' | 'createdAt' | 'updatedAt'> { }


interface ApiContextType {
    user: User | null;                     // currently logged-in user
    loading: boolean;                      // true while checking persistent login
    login(email: string, password: string): Promise<User>; // returns logged-in user
    logout(): void;                        // clears token and user, redirects to /login
    getProfile(): Promise<User | null>;
    updateProfile: (data: Partial<User> & { password?: string }) => Promise<User>
    register(name: string, email: string, password: string): Promise<User>; // <-- add this
    //admin page 
    getAllUsers: () => Promise<User[]>
    getUserById: (id: string) => Promise<User>
    updateUser: (id: string, data: Partial<User>) => Promise<User>
    deleteUser: (id: string) => Promise<{ message: string }>
    //settings
    getGeneralSettings(): Promise<GeneralSettings>;
    getPaymentSettings(): Promise<PaymentSettings>;
    getShippingSettings(): Promise<ShippingSettings>;
    getEmailSettings(): Promise<EmailSettings>;
    getSecuritySettings(): Promise<SecuritySettings>;
    getAppearanceSettings(): Promise<AppearanceSettings>;
    getNotificationSettings(): Promise<NotificationSettings>;

    updateGeneralSettings(data: Partial<GeneralSettings>): Promise<void>;
    updatePaymentSettings(data: Partial<PaymentSettings>): Promise<void>;
    updateShippingSettings(data: Partial<ShippingSettings>): Promise<void>;
    updateEmailSettings(data: Partial<EmailSettings>): Promise<void>;
    updateSecuritySettings(data: Partial<SecuritySettings>): Promise<void>;
    updateAppearanceSettings(data: Partial<AppearanceSettings>): Promise<void>;
    updateNotificationSettings(data: Partial<NotificationSettings>): Promise<void>;

    // PRODUCTS
    getProducts(): Promise<Product[]>;
    getProductById(id: string): Promise<Product>;
    addProduct(data: Partial<Product>): Promise<Product>;
    editProduct(id: string, data: Partial<Product>): Promise<Product>;
    deleteProduct(id: string): Promise<void>;

    // CATEGORIES & BRANDS
    getCategories(): Promise<Category[]>;
    getBrands(): Promise<Brand[]>;

    // CART
    getCart(): Promise<CartItem[]>;
    addToCart(item: CartItem): Promise<void>;
    removeFromCart(item: CartItem): Promise<void>;

    // ORDERS placeOrder: (orderData: Partial<Order>) => Promise<Order>
    getOrders: () => Promise<Order[]>
    trackOrder: (id: string) => Promise<Order>
    requestReturn: (id: string) => Promise<{ message: string }>
    getMyOrders: () => Promise<Order[]>;
    cancelOrder: (orderId: string) => Promise<Order>;
    placeOrder(data: Partial<Order>): Promise<Order>
    getOrderById: (id: string) => Promise<Order>;


    // Admin
    updateOrderStatusByAdmin: (id: string, status: string) => Promise<Order>
    getRevenue: () => Promise<number>

    // WISHLIST
    getWishlist(): Promise<Product[]>;
    addToWishlist(productId: string): Promise<void>;
    removeFromWishlist(productId: string): Promise<void>;
    // RETURNS
    getReturnRequests(): Promise<ReturnRequest[]>;
    getReturnRequestById(id: string): Promise<ReturnRequest>;
    approveReturnRequest(id: string): Promise<ReturnRequest>;
    rejectReturnRequest(id: string, reason: string): Promise<ReturnRequest>;

    // SUPPORT
    submitSupportTicket(data: Partial<SupportTicket>): Promise<SupportTicket>;
    getSupportTickets(): Promise<SupportTicket[]>;
    getSupportTicketById(id: string): Promise<SupportTicket>;
    updateSupportTicketStatus(id: string, status: SupportTicket["status"]): Promise<SupportTicket>;


    // ADMIN DASHBOARD
    getAdminStats(): Promise<any>;
    getRecentOrders(): Promise<Order[]>;
    getTopProducts(): Promise<Product[]>;


    // VENDORS
    getVendors(): Promise<Vendor[]>
    getVendorById(id: string): Promise<Vendor>
    addVendor(data: Partial<Vendor>): Promise<Vendor>
    updateVendor(id: string, data: Partial<Vendor>): Promise<Vendor>
    deleteVendor(id: string): Promise<void>

    // CONTACT MESSAGES
    submitContactMessage(data: Partial<ContactMessage>): Promise<ContactMessage>;
    getContactMessages(): Promise<ContactMessage[]>;

    // NEWSLETTER
    subscribeNewsletter(email: string): Promise<Subscriber>;
    getNewsletterSubscribers(): Promise<Subscriber[]>;
    //brands
    getBrandsV2(): Promise<Brand[]>
    getBrandById(id: number): Promise<Brand>
    createBrand(data: Partial<Brand>): Promise<Brand>
    updateBrand(id: number, data: Partial<Brand>): Promise<Brand>
    deleteBrand(id: number): Promise<void>

    // STATIC PAGES
    getShippingPolicy(): Promise<LegalDocument>;
    getReturnPolicy(): Promise<LegalDocument>;
    getFAQ(): Promise<LegalDocument>;
    getSupportInfo(): Promise<LegalDocument>;
    // Legal Documents
    getLegalDocuments(): Promise<LegalDocument[]>;
    getLegalDocumentById(id: string): Promise<LegalDocument>;
    updateLegalDocument(id: string, data: Partial<LegalDocument>): Promise<LegalDocument>;
    publishLegalDocument(id: string): Promise<LegalDocument>;
    createLegalDocument(data: {
        title: string;
        content: string;
        modifiedBy: string;
    }): Promise<LegalDocument>;

    getLegalDocumentHistory(id: string): Promise<LegalDocumentHistory[]>;

    // Categories
    addCategory: (data: string) => Promise<Category>;
    getCategoryById(id: string): Promise<Category>;
    updateCategory(id: string, data: Partial<Category>): Promise<Category>;
    deleteCategory(id: string): Promise<void>;
    //Zone
    createZone(data: Partial<DeliveryZone>): Promise<DeliveryZone>;
    getZones(): Promise<DeliveryZone[]>;
    getZoneById(id: string): Promise<DeliveryZone>;
    updateZone(id: string, data: Partial<DeliveryZone>): Promise<DeliveryZone>;
    deleteZone(id: string): Promise<void>;
    toggleZoneStatus(id: string): Promise<DeliveryZone>;
    updateZoneVendors(id: string, vendors: string[]): Promise<DeliveryZone>;

    // BANNERS
    createBanner: (data: BannerInput) => Promise<Banner>
    getHeroBanners: () => Promise<Banner[]>
    getPromotionalBanners: () => Promise<Banner[]>
    getBannerById: (id: string) => Promise<Banner>
    updateBanner: (id: string, data: Partial<BannerInput>) => Promise<Banner>
    deleteBanner: (id: string) => Promise<{ success: boolean; id: string }>
    toggleBannerStatus: (id: string) => Promise<Banner>
    reorderHeroImage: (id: string, direction: "up" | "down") => Promise<any>
    uploadBannerImage: (file: File) => Promise<string>
    uploadFile: (file: File) => Promise<{ url: string }>;
    fixHeroBannerOrder: () => Promise<{ success: boolean; message: string }>
    // Offers
    createOffer: (offerData: Offer) => Promise<Offer>;
    getOffers: () => Promise<Offer[]>;
    deleteOffer: (id: string) => Promise<{ message: string }>;
    // Coupons
    getCoupons: () => Promise<Coupon[]>
    getCouponById: (id: string) => Promise<Coupon>
    addCoupon: (data: Partial<Coupon>) => Promise<Coupon>
    updateCoupon: (id: string, data: Partial<Coupon>) => Promise<Coupon>
    deleteCoupon: (id: string) => Promise<void>
    validateCoupon: (code: string) => Promise<{ valid: boolean; value?: number; type?: string; message?: string }>;
    //Reports
    // fetchReportData: () => Promise<ReportResponse>;
    getReportData: () => Promise<ReportResponse>

    //payment 
    createPaymentSession: (amount: number, productName: string) => Promise<{ url: string }>;


    // // Socket
    // socket: Socket | null;
}

const ApiContext = createContext<ApiContextType | null>(null);
// Reducer function
function apiReducer(state: ApiState, action: any): ApiState {
    switch (action.type) {
        case "SET_USER":
            return { ...state, user: action.payload };
        case "CLEAR_USER":
            return { ...state, user: null };
        default:
            return state;
    }
}

export const ApiProvider = ({ children }: { children: React.ReactNode }) => {
    const [state, dispatch] = useReducer(apiReducer, { user: null });
    const [loading, setLoading] = useState(true);

    const socketRef = useRef<Socket | null>(null);

    // =====================
    // Auth
    // =====================
    // Login function
    const login = async (email: string, password: string): Promise<User> => {
        const res = await axios.post("/auth/login", { email, password });

        // 1️⃣ Store JWT token
        localStorage.setItem("token", res.data.token);

        // 2️⃣ Store user role in localStorage
        //    This is needed for frontend redirect/middleware
        localStorage.setItem("role", res.data.role);

        // 3️⃣ Update global state with user info
        dispatch({ type: "SET_USER", payload: res.data.user });

        // 4️⃣ Return user object
        return res.data.user as User;
    };


    const register = async (name: string, email: string, password: string): Promise<User> => {
        const res = await axios.post("/auth/register", { name, email, password });
        return res.data.user as User;
    };


    // Logout function
    const logout = () => {
        // Step 1: Stop all protected behavior
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // optional if stored
        // Optional: clear local cart or other context states
        localStorage.removeItem("cart");
        dispatch({ type: "CLEAR_USER" });
        // Step 2: Redirect once everything is cleared
        window.location.replace("/login"); // replace to prevent going "back"
    };

    //payment 
    const createPaymentSession = async (amount: number, productName: string) => {
        const res = await axios.post("/payment/create-payment", { amount, productName });
        return res.data; // { url }
    };



    // Get profile (for persistent login)
    const getProfile = async (): Promise<User | null> => {
        try {
            const res = await axios.get("/auth/profile");
            dispatch({ type: "SET_USER", payload: res.data.user });
            return res.data.user as User;
        } catch (error) {
            localStorage.removeItem("token");
            dispatch({ type: "CLEAR_USER" });
            return null;
        }
    };
    const updateProfile = async (data: Partial<User>): Promise<User> => {
        const res = await axios.put("/auth/profile", data);
        return res.data.user;
    };

    //reports
    const getReportData = async (range = "this-month") => {
        const res = await axios.get(`/reports?range=${range}`);
        return res.data;
    };

    //    const fetchReportData = async (): Promise<ReportResponse> => {
    //     const token = localStorage.getItem('token');
    //     const response = await axios.get<ReportResponse>('/reports', {
    //       headers: {
    //         Authorization: `Bearer ${token}`,
    //       },
    //     });
    //     return response.data;
    //   };

    //user
    const getAllUsers = async () => {
        const res = await axios.get("/users") // protected + isAdmin
        return res.data.users
    }

    const getUserById = async (id: string) => {
        const res = await axios.get(`/users/${id}`) // protected + isAdmin
        return res.data.user
    }

    const updateUser = async (id: string, data: Partial<User>) => {
        const res = await axios.put(`/users/${id}`, data) // protected + isAdmin
        return res.data.user
    }

    const deleteUser = async (id: string) => {
        const res = await axios.delete(`/users/${id}`) // protected + isAdmin
        return res.data
    }
    // Auto-load user if token exists
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getProfile().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);


    // =====================
    // Products
    // =====================
    const getProducts = async () => {
        const res = await axios.get("/products");
        // agar products exist nahi hai to empty array return kare
        return Array.isArray(res.data.products) ? res.data.products : [];
    };

    const getProductById = async (id: string) => {
        const res = await axios.get(`/products/${id}`);
        return res.data?.product || null;
    };

    const addProduct = async (data: FormData) => {
        try {
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/products`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return res.data; // backend returns product directly
        } catch (error: any) {
            console.error("❌ Failed to add product:", error);
            throw new Error(
                error.response?.data?.message || "Failed to add product"
            );
        }
    };

    const editProduct = async (id: string, data: any) => {
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/products/admin/product/${id}`,
                data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            return res.data; // assuming your backend does: res.json(product)
        } catch (error: any) {
            console.error("❌ Failed to edit product:", error);
            throw new Error(
                error.response?.data?.message || "Failed to edit product"
            );
        }
    };





    const deleteProduct = async (id: string) => {
        await axios.delete(`/products/admin/product/${id}`);
    };


    // =====================
    // Categories & Brands
    // =====================

    const getBrands = async () => {
        const res = await axios.get("/brands");
        return res.data.brands;
    };

    // =====================
    // Cart
    // =====================
    const getCart = async () => {
        const res = await axios.get("/cart");
        return res.data.items;
    };
    const addToCart = async (item: CartItem) => {
        await axios.post("/cart/add", item);
    };
    const removeFromCart = async (item: CartItem) => {
        await axios.post("/cart/remove", item);
    };

    // =====================
    // Orders
    // =====================
    const placeOrder = async (data: any) => {
        const token = localStorage.getItem("token");
        const res = await axios.post("/orders", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data.order; // ✅ fix to return only the actual order
    };





    const getOrders = async () => {
        const res = await axios.get("/orders");
        return res.data.orders;
    };
    const trackOrder = async (orderId: string) => {
        const res = await axios.get(`/orders/track/${orderId}`);
        return res.data.order;
    };
    // ✅ User: request a return
    const requestReturn = async (orderId: string) => {
        return await axios.post(`/orders/${orderId}/return`, {
            reason,
            items,
            totalRefund,
            returnMethod,
        });
    };


    const getMyOrders = async () => {
        const res = await axios.get("/orders/my-orders");
        return res.data;
    };

    const getOrderById = async (id: string): Promise<Order> => {
        const res = await axios.get(`/orders/${id}`);
        return res.data;
    };

    const cancelOrder = async (orderId: string) => {
        const res = await axios.patch(`/orders/${orderId}/cancel`);
        return res.data;
    };


    // ✅ Admin: update order status
    const updateOrderStatusByAdmin = async (orderId: string, status: string) => {
        const res = await axios.put(`/orders/${orderId}/status`, { status });
        return res.data;
    };


    // ✅ Admin: get revenue
    const getRevenue = async () => {
        const token = localStorage.getItem("token"); // adjust based on where your token is stored

        const res = await axios.get("/orders/revenue", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // ✅ Return full object, not res.data.revenue
        return res.data;
    };


    // =====================
    // Wishlist
    // =====================

    const getWishlist = async () => {
        const token = localStorage.getItem("token")
        const res = await axios.get("/wishlist", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return res.data.items
    }

    const addToWishlist = async (productId: string) => {
        const token = localStorage.getItem("token")
        await axios.post("/wishlist/add", { productId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }

    const removeFromWishlist = async (productId: string) => {
        const token = localStorage.getItem("token")
        await axios.post("/wishlist/remove", { productId }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    }


    // =====================
    // Admin Dashboard
    // =====================
    const getAdminStats = async () => {
        const res = await axios.get("/dashboard"); // correct route
        return res.data; // { stats, recentOrders, topProducts }
    };
    const getRecentOrders = async () => {
        const res = await axios.get("/admin/orders/recent");
        return res.data.orders;
    };
    const getTopProducts = async () => {
        const res = await axios.get("/admin/products/top");
        return res.data.products;
    };

    // =====================
    // Coupons
    // =====================
    const getCoupons = async (): Promise<Coupon[]> => {
        const res = await axios.get("/coupons")
        console.log("Raw response:", res.data)
        return res.data // ✅ This matches the actual response
    }

    const getCouponById = async (id: string): Promise<Coupon> => {
        const res = await axios.get(`/coupons/${id}`)
        return res.data.coupon // ✅ this now matches the backend
    }


    const addCoupon = async (data: Partial<Coupon>): Promise<Coupon> => {
        const res = await axios.post("/coupons", data)
        return res.data.coupon
    }

    const updateCoupon = async (
        id: string,
        data: Partial<Coupon>
    ): Promise<Coupon> => {
        const res = await axios.put(`/coupons/${id}`, data)

        // ✅ check if it's really inside `res.data.coupon`
        return res.data?.coupon ?? res.data  // fallback if your backend returns just the coupon
    }
    const validateCoupon = async (
        code: string,
        orderTotal: number
    ): Promise<{ valid: boolean; value?: number; type?: string; message?: string }> => {
        try {
            const res = await axios.get(`/coupons/validate`, {
                params: { code, orderTotal }, // ✅ send both
            });

            return {
                valid: true,
                value: res.data.value,
                type: res.data.type,
                message: res.data.message,
            };
        } catch (error: any) {
            console.error("Coupon validation failed:", error?.response?.data || error.message);
            return {
                valid: false,
                message: error?.response?.data?.message || "Invalid or expired coupon",
            };
        }
    };



    const deleteCoupon = async (id: string): Promise<void> => {
        await axios.delete(`/coupons/${id}`)
    }
    // =====================
    // offer
    // =====================
    const createOffer = async (offerData: Offer): Promise<Offer> => {
        const res = await axios.post("/offers", offerData);
        return res.data;
    };

    const getOffers = async (): Promise<Offer[]> => {
        const res = await axios.get("/offers");
        return res.data;
    };

    const deleteOffer = async (id: string): Promise<{ message: string }> => {
        const res = await axios.delete(`/offers/${id}`);
        return res.data;
    };

    // =====================
    // Vendors
    // =====================
    // ✅ API functions
    const getVendors = async (): Promise<Vendor[]> => {
        const res = await axios.get("/vendors")
        return res.data.vendors
    }

    const getVendorById = async (id: string): Promise<Vendor> => {
        const res = await axios.get(`/vendors/${id}`)
        return res.data.vendor
    }

    const addVendor = async (data: Partial<Vendor>): Promise<Vendor> => {
        const res = await axios.post("/vendors", data)
        return res.data.vendor
    }

    const updateVendor = async (id: string, data: Partial<Vendor>): Promise<Vendor> => {
        const res = await axios.put(`/vendors/${id}`, data)
        return res.data.vendor
    }

    const deleteVendor = async (id: string): Promise<void> => {
        await axios.delete(`/vendors/${id}`)
    }
    // =====================
    // Returns
    // =====================
    const getReturnRequests = async (): Promise<ReturnRequest[]> => {
        const res = await axios.get("/returns");
        return res.data.requests;
    };

    const getReturnRequestById = async (id: string): Promise<ReturnRequest> => {
        const res = await axios.get(`/returns/${id}`);
        return res.data.request;
    };

    const approveReturnRequest = async (id: string): Promise<ReturnRequest> => {
        if (!id) throw new Error("Return request ID is missing");

        try {
            const res = await axios.patch(`/returns/${id}/approve`);
            return res.data.request;
        } catch (error: any) {
            console.error("❌ Approve failed:", error);
            throw error;
        }
    };


    const rejectReturnRequest = async (id: string, reason: string): Promise<ReturnRequest> => {
        const res = await axios.patch(`/returns/${id}/reject`, { reason });
        return res.data.request;
    };
    // =====================
    // Support Tickets
    // =====================
    const submitSupportTicket = async (data: Partial<SupportTicket>): Promise<SupportTicket> => {
        const res = await axios.post("/support", data);
        return res.data.ticket;
    };

    const getSupportTickets = async (): Promise<SupportTicket[]> => {
        const res = await axios.get("/support");
        return res.data.tickets;
    };

    const getSupportTicketById = async (id: string): Promise<SupportTicket> => {
        const res = await axios.get(`/support/${id}`);
        return res.data.ticket;
    };

    const updateSupportTicketStatus = async (
        id: string,
        status: SupportTicket["status"]
    ): Promise<SupportTicket> => {
        const res = await axios.patch(`/support/${id}/status`, { status });
        return res.data.ticket;
    };


    // =====================
    // Contact & Newsletter
    // =====================
    const submitContactMessage = async (data: Partial<ContactMessage>) => {
        const res = await axios.post("/contact", data);
        return res.data.message;
    };
    const getContactMessages = async () => {
        const res = await axios.get("/contact");
        return res.data.messages;
    };
    const subscribeNewsletter = async (email: string) => {
        const res = await axios.post("/newsletter", { email });
        return res.data.subscriber;
    };
    const getNewsletterSubscribers = async () => {
        const res = await axios.get("/newsletter");
        return res.data.subscribers;
    };

    // =====================
    // Static Info Pages
    // =====================
    const getShippingPolicy = async () => {
        const res = await axios.get("/shipping");
        return res.data.policy;
    };
    const getReturnPolicy = async () => {
        const res = await axios.get("/returns");
        return res.data.policy;
    };
    const getFAQ = async () => {
        const res = await axios.get("/faq");
        return res.data.faq;
    };
    const getSupportInfo = async () => {
        const res = await axios.get("/support");
        return res.data.support;
    };
    // =====================
    // Banners
    // =====================
    // Fetch all active hero banners
    const createBanner = async (data: Omit<Banner, "_id" | "createdAt" | "updatedAt">): Promise<Banner> => {
        const res = await axios.post("/banners", data)
        return res.data
    }


    const getHeroBanners = async (): Promise<Banner[]> => {
        const res = await axios.get("/banners?type=hero")
        return res.data
    }

    const getPromotionalBanners = async (): Promise<Banner[]> => {
        const res = await axios.get("/banners?type=promotional")
        return res.data
    }

    const getBannerById = async (id: string): Promise<Banner> => {
        const res = await axios.get(`/banners/${id}`)
        return res.data
    }

    const updateBanner = async (id: string, data: Partial<BannerInput>): Promise<Banner> => {
        const res = await axios.put(`/banners/${id}`, data)
        return res.data
    }

    const deleteBanner = async (id: string): Promise<{ success: boolean; id: string }> => {
        const res = await axios.delete(`/banners/${id}`)
        return res.data
    }
    // Toggle isActive status
    const toggleBannerStatus = async (id: string): Promise<Banner> => {
        const res = await axios.patch(`/banners/${id}/toggle`)
        return res.data
    }
    const fixHeroBannerOrder = async (): Promise<{ success: boolean; message: string }> => {
        const res = await axios.post("/banners/fix-order")
        return res.data
    }


    // Reorder hero banners (only for type="hero")
    const reorderHeroImage = async (
        id: string,
        direction: "up" | "down"
    ): Promise<{ success: boolean }> => {
        const res = await axios.post(`/banners/${id}/reorder`, { direction })
        return res.data
    }

    const uploadBannerImage = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append("file", file)
        const res = await axios.post(`/banners/upload`, formData)
        return res.data.imageUrl
    }


    const uploadFile = async (file: File): Promise<{ url: string }> => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await axios.post("/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return res.data; // ✅ { url: string }
    };



    // =====================
    // Brands
    // =====================
    const getBrandsV2 = async (): Promise<Brand[]> => {
        const res = await axios.get("/brands");
        return res.data.brands; // ✅ unwrap the array
    };


    const getBrandById = async (id: number): Promise<Brand> => {
        const res = await axios.get(`/brands/${id}`)
        return res.data
    }
    const createBrand = async (data: Partial<Brand>): Promise<Brand> => {
        const res = await axios.post("/brands", data)
        return res.data
    }

    const updateBrand = async (id: number, data: Partial<Brand>): Promise<Brand> => {
        const res = await axios.put(`/brands/${id}`, data)
        return res.data
    }

    const deleteBrand = async (id: number): Promise<void> => {
        await axios.delete(`/brands/${id}`)
    }

    // =====================
    // Categories
    // =====================
    const addCategory = async (data: Category): Promise<Category> => {
        const res = await axios.post("/categories", data);
        return res.data.category;
    };
    const getCategories = async () => {
        const res = await axios.get("/categories");
        return res.data.categories;
    };
    const getCategoryById = async (id: string) => {
        const res = await axios.get(`/categories/${id}`);
        return res.data.category;
    };
    const updateCategory = async (id: string, data: Partial<Category>) => {
        const res = await axios.put(`/categories/${id}`, data);
        return res.data.category;
    };
    const deleteCategory = async (id: string) => {
        await axios.delete(`/categories/${id}`);
    };

    // =====================
    // Delivery Zones
    // =====================
    const createZone = async (data: Partial<DeliveryZone>) => {
        const res = await axios.post("/zones", data);
        return res.data.zone;
    };

    const getZones = async () => {
        const res = await axios.get("/zones")
        return res.data.zones.map((zone) => ({
            ...zone,
            id: zone.id || zone._id,
        }))
    }

    const getZoneById = async (id: string) => {
        const res = await axios.get(`/zones/${id}`);
        return res.data.zone;
    };
    const updateZone = async (id: string, data: any) => {
        const res = await axios.put(`/zones/${id}`, data);
        return res.data.zone;
    };
    const deleteZone = async (id: string) => {
        await axios.delete(`/zones/${id}`);
    };
    const toggleZoneStatus = async (id: string) => {
        const res = await axios.patch(`/zones/${id}/toggle`);
        return res.data.zone;
    };
    const updateZoneVendors = async (id: string, vendors: string[]) => {
        const res = await axios.patch(`/zones/${id}/vendors`, { vendors });
        return res.data.zone;
    };

    // =====================
    // Legal Documents
    // =====================
    const getLegalDocuments = async () => {
        const res = await axios.get("/legal-documents");
        return res.data.documents;
    };
    const getLegalDocumentById = async (id: string) => {
        const res = await axios.get(`/legal-documents/${id}`);
        return res.data.document;
    };
    const updateLegalDocument = async (
        id: string,
        data: Partial<LegalDocument>
    ): Promise<LegalDocument> => {
        const res = await axios.put(`/legal-documents/${id}`, data)
        return {
            ...res.data.document,
            id: res.data.document._id, // ✅ normalize here too
        }
    }
    const publishLegalDocument = async (id: string) => {
        const res = await axios.patch(`/legal-documents/${id}/publish`);
        return res.data.document;
    };
    const createLegalDocument = async (data: {
        title: string;
        content: string;
        modifiedBy: string;
    }): Promise<LegalDocument> => {
        const res = await axios.post("/legal-documents", data);
        return res.data.document;
    };

    const getLegalDocumentHistory = async (id: string): Promise<LegalDocumentHistory[]> => {
        const res = await axios.get(`/legal-documents/${id}/history`);
        return res.data.history;
    };

    // General Settings
    const getAllSettings = async () => {
        const res = await axios.get("/settings");

        return res.data;
    };

    const getGeneralSettings = async () => {
        const data = await getAllSettings();
        return data.general ?? {};
    };

    const updateGeneralSettings = async (settings: Partial<GeneralSettings>) => {
        await axios.put("/settings/general", settings);
    };

    const getPaymentSettings = async () => {
        const data = await getAllSettings();
        return data.payment ?? {}; // fallback to empty object
    };


    const updatePaymentSettings = async (settings: Partial<PaymentSettings>) => {
        await axios.put("/settings/payment", settings);
    };

    const getShippingSettings = async () => {
        const data = await getAllSettings();
        return data.shipping ?? {};
    };

    const updateShippingSettings = async (settings: Partial<ShippingSettings>) => {
        await axios.put("/settings/shipping", settings);
    };

    const getEmailSettings = async () => {
        const data = await getAllSettings();
        return data.email ?? {};
    };

    const updateEmailSettings = async (settings: Partial<EmailSettings>) => {
        await axios.put("/settings/email", settings);
    };

    const getSecuritySettings = async () => {
        const data = await getAllSettings();
        return data.security ?? {};
    };

    const updateSecuritySettings = async (settings: Partial<SecuritySettings>) => {
        await axios.put("/settings/security", settings);
    };

    const getAppearanceSettings = async () => {
        const data = await getAllSettings();
        return data.appearance ?? {};
    };
    const updateAppearanceSettings = async (settings: Partial<AppearanceSettings>) => {
        await axios.put("/settings/appearance", settings);
    };

    const getNotificationSettings = async () => {
        const data = await getAllSettings();
        return data.notifications ?? {};
    };

    const updateNotificationSettings = async (settings: Partial<NotificationSettings>) => {
        await axios.put("/settings/notifications", settings);
    };

    // =====================
    // Socket Integration
    // =====================
    // useEffect(() => {
    //     const token = localStorage.getItem("token");
    //     if (token && !socketRef.current) {
    //         socketRef.current = io(process.env.NEXT_PUBLIC_API_URL!, {
    //             auth: { token },
    //         });
    //     }

    //     return () => {
    //         socketRef.current?.disconnect();
    //         socketRef.current = null;
    //     };
    // }, []);

    return (
        <ApiContext.Provider
            value={{
                user: state.user,
                loading,
                login,
                logout,
                getProfile,
                updateProfile,
                createPaymentSession,
                register,
                getAllUsers,
                getUserById,
                updateUser,
                deleteUser,
                getProducts,
                getProductById,
                addProduct,
                editProduct,
                deleteProduct,
                getCategories,
                getBrands,
                getCart,
                addToCart,
                removeFromCart,
                getOrderById,
                placeOrder,
                getOrders,
                getMyOrders,
                cancelOrder,
                trackOrder,
                requestReturn,
                updateOrderStatusByAdmin,
                getRevenue,
                getWishlist,
                addToWishlist,
                removeFromWishlist,
                getAdminStats,
                getRecentOrders,
                getTopProducts,
                getVendors,
                getVendorById,
                addVendor,
                updateVendor,
                deleteVendor,
                submitContactMessage,
                getContactMessages,
                subscribeNewsletter,
                getNewsletterSubscribers,
                getShippingPolicy,
                getReturnPolicy,
                getFAQ,
                getReturnRequests,
                getReturnRequestById,
                approveReturnRequest,
                rejectReturnRequest,
                submitSupportTicket,
                getSupportTickets,
                getSupportTicketById,
                updateSupportTicketStatus,
                addCategory,
                getCategoryById,
                updateCategory,
                deleteCategory,
                getBrandById,
                createBrand,
                updateBrand,
                getBrandsV2,
                deleteBrand,
                getZones,
                getZoneById,
                createZone,
                updateZone,
                updateZoneVendors,
                getAppearanceSettings,
                getGeneralSettings,
                getPaymentSettings,
                getShippingSettings,
                getEmailSettings,
                getSecuritySettings,
                getNotificationSettings,
                updateGeneralSettings,
                updatePaymentSettings,
                updateShippingSettings,
                updateEmailSettings,
                updateSecuritySettings,
                updateNotificationSettings,
                updateAppearanceSettings,
                getLegalDocumentHistory,
                getLegalDocumentById,
                createLegalDocument,
                updateLegalDocument,
                publishLegalDocument,
                getLegalDocuments,
                toggleZoneStatus,
                deleteZone,
                getSupportInfo,
                createBanner,
                getHeroBanners,
                getPromotionalBanners,
                getBannerById,
                updateBanner,
                deleteBanner,
                toggleBannerStatus,
                reorderHeroImage,
                uploadBannerImage,
                uploadFile,
                fixHeroBannerOrder,
                createOffer,
                getOffers,
                deleteOffer,
                getCoupons,
                getCouponById,
                addCoupon,
                updateCoupon,
                deleteCoupon,
                validateCoupon,
                getReportData,
                // fetchReportData,
                // socket: socketRef.current,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = () => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within <ApiProvider>");
    }
    return context;
};
