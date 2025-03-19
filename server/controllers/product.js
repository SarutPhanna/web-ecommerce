const prisma = require("../config/prisma");
const cloudinary = require("cloudinary").v2;

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Product
exports.create = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, images } =
      req.body;
    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Create Product Error" });
  }
};

// Read Many Products
exports.list = async (req, res) => {
  try {
    const { count } = req.params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "List Product Error" });
  }
};

// Read One Product
exports.read = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "List Product Error" });
  }
};

// Update Product
exports.update = async (req, res) => {
  try {
    const { title, description, price, quantity, categoryId, images } =
      req.body;

    await prisma.image.deleteMany({
      where: {
        productId: Number(req.params.id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        title: title,
        description: description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });
    res.send(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update Product Error" });
  }
};

// Remove Product
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    // Find Product
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { images: true },
    });

    if (!product) {
      return res.status(400).json({ message: "Product not found!" });
    }

    // Delete image from cloud
    const deleteImage = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          cloudinary.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        })
    );

    await Promise.all(deleteImage);

    //Delete Product
    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });
    res.send("Remove Product OK");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Remove Product Error" });
  }
};

exports.listby = async (req, res) => {
  try {
    const { sort, order, limit } = req.body;
    const products = await prisma.product.findMany({
      take: limit,
      orderBy: { [sort]: order },
      include: { category: true },
    });
    res.send(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "List by Product Error" });
  }
};

const handleQuery = async (req, res, query) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        title: {
          contains: query,
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Search Query Error" });
  }
};

const handleCategory = async (req, res, categoryId) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId: {
          in: categoryId.map((id) => Number(id)),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({ message: "Search Price Error" });
  }
};

const handlePrice = async (req, res, priceRange) => {
  try {
    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: priceRange[0], // มากกว่า Index ที่ 0
          lte: priceRange[1], // น้อยกว่า Index ที 1
          // ตัวอย่าง หน้าบ้าน: priceRange =[500,1000] คือสินค้าที่ค้นหาจะต้องอยู่ในช่วง มากกว่า 500 เเละต้องน้อยกว่า 1000
        },
      },
      include: {
        category: true,
        images: true,
      },
    });
    res.send(products);
  } catch (error) {
    res.status(500).json({ message: "Search Price Error" });
  }
};

exports.searchFilters = async (req, res) => {
  try {
    const { query, category, price } = req.body;
    if (query) {
      console.log("-->", query);
      await handleQuery(req, res, query);
    }
    if (category) {
      console.log("-->", category);
      await handleCategory(req, res, category);
    }
    if (price) {
      console.log("-->", price);
      await handlePrice(req, res, price);
    }
    res.send("Search Filters by Product OK");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Search Filters  Product Error" });
  }
};

exports.createImages = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.body.image, {
      public_id: `ecom_sarut ${Date.now()}`,
      resource_type: "auto",
      folder: "ecom",
    });
    res.send(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Create Image is Error" });
  }
};

exports.removeImage = async (req, res) => {
  try {
    const { public_id } = req.body;
    cloudinary.uploader.destroy(public_id, (result) => {
      res.send("Remove Image Success!");
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Remove Image is Error" });
  }
};
