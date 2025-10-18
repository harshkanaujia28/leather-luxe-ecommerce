import Product from "../models/Product.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// --- Safe parsing helpers ---
const safeParseArray = (value) => {
  try {
    return Array.isArray(value) ? value : JSON.parse(value || "[]");
  } catch {
    return [];
  }
};

const safeParseObject = (value) => {
  try {
    return typeof value === "object" ? value : JSON.parse(value || "{}");
  } catch {
    return {};
  }
};

// --- CREATE PRODUCT CONTROLLER ---
export const createProduct = async (req, res) => {
  try {
    console.log(
      "=== REQUEST FILES ===",
      req.files?.map((f) => f.fieldname)
    );

    // --- Parse JSON fields from multipart form ---
    const variants = safeParseArray(req.body.variants);
    const features = safeParseArray(req.body.features);
    const specifications = safeParseObject(req.body.specifications);
    const offer = safeParseObject(req.body.offer);
    const category = safeParseObject(req.body.category);

    // --- Validation ---
    if (!req.body.name || !req.body.price) {
      return res
        .status(400)
        .json({ success: false, message: "Name & Price required" });
    }
    if (!category.category || !category.subCategory) {
      return res
        .status(400)
        .json({ success: false, message: "Category/SubCategory required" });
    }
    if (!specifications.material) {
      return res
        .status(400)
        .json({ success: false, message: "Material required" });
    }

    // --- Upload color images grouped by field name ---
    const colors = [];

    if (Array.isArray(specifications.colors)) {
      for (let i = 0; i < specifications.colors.length; i++) {
        const colorObj = specifications.colors[i];
        const fieldName = `colorImages_${i}`;
        const filesForColor =
          req.files?.filter((f) => f.fieldname === fieldName) || [];

        console.log(
          `Uploading ${filesForColor.length} file(s) for color:`,
          colorObj.color
        );

        const urls = [];
        for (const file of filesForColor) {
          const uploaded = await uploadToCloudinary(
            file.buffer,
            `products/${colorObj.color}`
          );
          urls.push(uploaded.secure_url);
        }

        colors.push({ color: colorObj.color, images: urls });
      }
    }

    // --- Prepare product data ---
    const productData = {
      name: req.body.name,
      brand: req.body.brand || "",
      brandImage: req.body.brandImage || "",
      price: Number(req.body.price),
      originalPrice: Number(req.body.originalPrice) || 0,
      description: req.body.description || "",
      category,
      variants,
      features,
      specifications: { material: specifications.material, colors },
      offer,
      featured: req.body.featured === "true" || req.body.featured === true,
    };

    console.log("=== PRODUCT DATA TO SAVE ===", productData);

    // --- Save to MongoDB ---
    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("CREATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// ================= GET ALL PRODUCTS =================
export const getProducts = async (req, res) => {
  try {
    const {
      gender,
      productType,
      subCategory,
      minPrice,
      maxPrice,
      offer,
      search,
      sort,
    } = req.query;

    let query = {};

    // Gender filter
    if (gender) query["category.gender"] = gender.toLowerCase();

    // Product type (assuming you store it in category.categoryName or category.category._id)
    if (productType) query["category.categoryName"] = productType;

    // Subcategory
    if (subCategory) query["category.subCategory"] = subCategory;

    // Price filters
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    // Offer filter
    if (offer === "true") query["offer.isActive"] = true;

    // Search by name or brand
    if (search)
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];

    // Base query
    let productsQuery = Product.find(query);

    // Sorting
    if (sort === "priceLow") productsQuery = productsQuery.sort({ price: 1 });
    if (sort === "priceHigh") productsQuery = productsQuery.sort({ price: -1 });
    if (sort === "newest")
      productsQuery = productsQuery.sort({ createdAt: -1 });

    const products = await productsQuery.exec();

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= GET SINGLE PRODUCT =================
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category.category"
    );
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
export const getFilters = async (req, res) => {
  try {
    // Only project category-related fields for performance
    const products = await Product.find(
      {},
      "category.category category.subCategory category.gender"
    ).lean();

    const filters = {};

    for (const p of products) {
      const { gender, category, subCategory } = p.category || {};
      if (!gender || !category || !subCategory) continue;

      if (!filters[gender]) filters[gender] = {};
      if (!filters[gender][category]) filters[gender][category] = [];
      if (!filters[gender][category].includes(subCategory)) {
        filters[gender][category].push(subCategory);
      }
    }

    res.status(200).json(filters);
  } catch (err) {
    console.error("Error building filters:", err);
    res.status(500).json({ success: false, error: "Failed to load filters" });
  }
};

// ================= ADD REVIEW =================
export const addReview = async (req, res) => {
  try {
    const { userId, name, stars, comment } = req.body;
    const { id } = req.params;

    if (!userId || !name || !comment || !stars) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const review = { userId, name, stars, comment, createdAt: new Date() };
    product.reviews.push(review);
    await product.save();

    res.status(201).json({ message: "Review added", reviews: product.reviews });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// ================= RELATED PRODUCTS =================
export const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const related = await Product.find({
      "category.category": product.category.category,
      _id: { $ne: product._id },
    }).limit(10);

    res.status(200).json({ success: true, products: related });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ================= UPDATE PRODUCT =================
// ================= UPDATE PRODUCT =================
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Parse fields from request
    const variants = safeParseArray(req.body.variants);
    const features = safeParseArray(req.body.features);
    const specifications = safeParseObject(req.body.specifications);
    const offer = safeParseObject(req.body.offer);
    const category = safeParseObject(req.body.category);

    // --- Update basic fields ---
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.brandImage = req.body.brandImage || product.brandImage;
    product.price = Number(req.body.price) || product.price;
    product.originalPrice =
      Number(req.body.originalPrice) || product.originalPrice;
    product.description = req.body.description || product.description;
    product.category = category || product.category;
    product.variants = variants.length ? variants : product.variants;
    product.features = features.length ? features : product.features;
    product.offer = offer || product.offer;
    product.featured =
      req.body.featured === "true" ||
      req.body.featured === true ||
      product.featured;

    // --- Handle colors & images ---
    const colors = [];

    if (specifications.colors?.length) {
      for (let i = 0; i < specifications.colors.length; i++) {
        const colorObj = specifications.colors[i];
        // Existing images sent from frontend (URLs)
        let existingImages = colorObj.existingImages || [];

        // New uploaded files for this color
        const fieldName = `colorImages_${i}`;
        const filesForColor =
          req.files?.filter((f) => f.fieldname === fieldName) || [];
        for (const file of filesForColor) {
          const uploaded = await uploadToCloudinary(
            file.buffer,
            `products/${colorObj.color}`
          );
          existingImages.push(uploaded.secure_url);
        }

        colors.push({
          color: colorObj.color,
          images: existingImages,
        });
      }
    }

    // Merge colors into product
    if (colors.length) {
      product.specifications = {
        ...product.specifications,
        material: specifications.material || product.specifications.material,
        colors,
      };
    } else if (specifications.material) {
      // Only material updated
      product.specifications.material = specifications.material;
    }

    await product.save();
    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("UPDATE PRODUCT ERROR:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
// ================= DELETE PRODUCT =================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    await product.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.toString(),
      details: err.errors || err,
    });
  }
};
