import mongoose from 'mongoose';

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    stars: { type: Number, min: 1, max: 5, required: true },
  },
  { timestamps: true }
);

// Offer Schema
const offerSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: false },
    type: { type: String, enum: ["percentage","fixed","bogo","bundle"], trim:true },
    value: Number,
    startDate: Date,
    endDate: Date,
    description: String,
    minQuantity: Number,
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
  },
  { _id: false }
);

offerSchema.methods.isOfferValid = function() {
  const now = new Date();
  if (this.startDate && now < this.startDate) return false;
  if (this.endDate && now > this.endDate) return false;
  if (this.maxUses && this.usedCount >= this.maxUses) return false;
  return true;
};

// Color Schema
const colorSchema = new mongoose.Schema({
  color: { type: String, required: true },
  images: { type: [String], default: [] },
}, { _id: false });

// Specification Schema
const specificationSchema = new mongoose.Schema({
  material: { type: String, required: true },
  colors: { type: [colorSchema], default: [] },
}, { _id: false });

// Variant Schema
const variantSchema = new mongoose.Schema({
  name: String,
  stock: { type: Number, required: true, min: 0 },
}, { _id: false });

// Category Embedded
const categoryEmbeddedSchema = new mongoose.Schema({
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: String, required: true },
  gender: { type: String, enum: ["male","female","unisex"], default:"unisex" },
}, { _id: false });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  brandImage: String,
  price: { type: Number, required: true },
  originalPrice: Number,
  description: { type: String, required: true },
  category: categoryEmbeddedSchema,
  variants: { type: [variantSchema], default: [] },
  rating: { type: Number, default: 0 },
  reviews: { type: [reviewSchema], default: [] },
  features: { type: [String], default: [] },
  specifications: { type: specificationSchema, required: true },
  offer: offerSchema,
  featured: { type: Boolean, default: false },
}, { timestamps: true });

// Pre-save hook
productSchema.pre("save", function(next){
  if(this.reviews.length > 0){
    const total = this.reviews.reduce((acc,r)=> acc+r.stars,0);
    this.rating = total / this.reviews.length;
  } else this.rating = 0;

  if(this.offer && this.offer.isActive){
    this.offer.isActive = this.offer.isOfferValid();
  }
  next();
});

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;

