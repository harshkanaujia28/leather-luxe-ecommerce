export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
       
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};


export const isVendor = (req, res, next) => {
  if (req.user?.role !== "vendor") {
    
    return res.status(403).json({ message: "Vendor access only" });
  }
  next();
};

export const isUser = (req, res, next) => {
  if (req.user?.role?.toLowerCase() !== "user") {
    return res.status(403).json({ message: "User access only" });
  }
  next();
};

