const prisma = require("../config/prisma");

// list user
exports.listUser = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        address: true,
      },
    });

    res.send(users);
  } catch (error) {
    res.status(500).json({ message: "List User is Error!!!" });
    console.log(error);
  }
};

// change status
exports.changeStatus = async (req, res) => {
  try {
    const { id, enabled } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled: enabled },
    });
    res.send("Update Status Success");
  } catch (error) {
    res.status(500).json({ message: "ChangeStatus is Error!!!" });
    console.log(error);
  }
};

// change role
exports.changeRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { role: role },
    });
    res.send("Update Role Success");
  } catch (error) {
    res.status(500).json({ message: "Change Role is Error!!!" });
    console.log(error);
  }
};

// add user cart
exports.postUserCart = async (req, res) => {
  try {
    const { cart } = req.body;

    // find user
    const user = await prisma.user.findFirst({
      where: { id: Number(req.user.id) },
    });
    console.log(user);

    // clear product on cart
    await prisma.productOnCart.deleteMany({
      where: {
        cart: {
          orderedById: user.id,
        },
      },
    });

    // clear cart
    await prisma.cart.deleteMany({
      where: {
        orderedById: user.id,
      },
    });

    // loop cart from fontend
    let products = cart.map((item) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));

    // sum price
    let cartTotal = products.reduce(
      (sum, item) => sum + item.price * item.count,
      0
    );

    //create new cart
    const newCart = await prisma.cart.create({
      // ช้อมูลที่ได้มาจากการ loop ด้านบน จะถูกส่งเก็บในตาราง cart col products
      data: {
        products: {
          // from database
          create: products, // from fontend เเล้วจะถูกส่งเข้าไปเก็บในตาราง Product on cart เนื่องจาก 2 ตารางนี้เชื่อมกันอยู่
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });
    console.log(newCart);
    res.send("Post User Cart User OK");
  } catch (error) {
    res.status(500).json({ message: "Post User Cart is Error!!!" });
    console.log(error);
  }
};

// get user cart
exports.getUserCart = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      // include 2 อัน เนื่องจาก
      // -include เเรก คือการเลือก col products ในตาราง cart ก่อน (note: เนื่องจาก col Produsts เชื่อมกับ ตาราง Product on cart อยู่ )
      // -include สอง จะไปเลือก col product ของจริงในตาราง Product on cart
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({ products: cart.products, cartTotal: cart.cartTotal });
  } catch (error) {
    res.status(500).json({ message: "Get User Cart is Error!!!" });
    console.log(error);
  }
};

// empty cart
exports.deleteUserCart = async (req, res) => {
  try {
    // ค้นหา ตาราง cart ที่ orderById  ด้วยค่า user
    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    if (!cart) {
      return res.status(400).json({ message: "No cart" });
    }
    // ลบข้อมูลใน ตาราง productoncart ที่ cartId ด้วยค่า ที่ค้นหา cart.id // id ของ ตาราง cart จะมีเชื่อมข้อมูลกันกับ col cartId
    await prisma.productOnCart.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    // ลบข้อมูล ตาราง cart
    const result = await prisma.cart.deleteMany({
      where: { orderedById: Number(req.user.id) },
    });

    res.json({
      message: "Cart Empty Success",
      DeleteCount: result.count, // count ไม่ได้เป็นข้อมูลจาก ตาราง cart เเต่ เป็นค่าที่ prisma เพิ่มเติมเพื่อช่วยให้รู้ว่าเกิดการลบไปกี่แถวในฐานข้อมูล
    });
  } catch (error) {
    res.status(500).json({ message: "Delete User Cart is Error!!!" });
    console.log(error);
  }
};

// save address
exports.userAddress = async (req, res) => {
  try {
    const { address } = req.body;
    const addressUser = await prisma.user.update({
      where: {
        id: Number(req.user.id),
      },
      data: {
        address: address,
      },
    });
    res.send("User Address Cart OK");
  } catch (error) {
    res.status(500).json({ message: "User Address is Error!!!" });
    console.log(error);
  }
};

// save order
exports.postUserOrder = async (req, res) => {
  try {
    // step 1
    // get user cart
    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(req.user.id),
      },
      include: { products: true },
    });

    // step 2
    // check cart empty
    if (!userCart || userCart.products.length === 0) {
      return res.status(400).json({ ok: false, message: "Cart is Empty" });
    }

    // step 3
    // check quantity
    for (const item of userCart.products) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { quantity: true, title: true },
      });
      // check ว่าสินค้าของลูกค้าที่สั่งมีจำนวนมากกว่าสินค้าที่มีใน Stock ไหม ถ้าตรงเงื่อนไขก็จะทำในส่วนเเจ้งให้รู้ค้าทราบว่าสินค้ามีไม่เพียงพอ
      if (!product || item.count > product.quantity) {
        return res.status(400).json({
          ok: false,
          message: ` ขออภัย สินค้า ${product?.title || ""} มีไม่เพียงพอ`, // product?.title หมายถึงว่ามีค่าอยู่ไหม ถ้ามีก็จะเเสดงชื่อสินค้า ถ้าไม่มีก็จะให้เเสดง ""
        });
      }
    }

    // step 4
    // create a new order
    const order = await prisma.order.create({
      data: {
        // ข้อมูลที่จะให้ไปเก็บที่ ตาราง order col products
        products: {
          // value ของข้อมูลนั้นๆที่จะนำไปเก็บ
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
        // order นี้เป็นของ user คนไหน
        orderedBy: {
          connect: { id: req.user.id },
        },
        cartTotal: userCart.cartTotal,
      },
    });

    // step 5  เตรียมข้อมูลสำหรับการ update product
    const updateProducts = userCart.products.map((item) => ({
      // ค้นหาสินค้าที่ต้องการ update ก็คือ update ในตาราง product ที่ col id มีค่าตรงกับ item.productId ที่ได้จากการ map
      where: { id: item.productId },
      // ข้อมูลที่ต้องการ update
      data: {
        // update ในตาราง product col quantity เเละ col sold ด้วย item.count จำนวนคำสั่งซื้อ
        quantity: { decrement: item.count }, // decrement ใช้สำหรับลดค่าจำนวน quantity เช่น quantity = 10 unit // item.couunt ที่ส่งไป = 2 จำนวนคงเหลือใน Stock = 8
        sold: { increment: item.count }, // increment ใช้สำหรับเพิ่มค่าจำนวน sold เช่น sold = 2 uniit // item.count ที่ส่งไป = 2 ยอดที่ขายได้ = 4
      },
    }));

    // step 6 update all products.
    await Promise.all(
      updateProducts.map((productUpdated) =>
        prisma.product.update(productUpdated)
      )
    );

    // step 6 หลังจาก สินค้าเข้าไปเก็บใน ตาราง order เเล้วจะต้องลบ ข้อมูลที่อยู่ใน cart ออก
    await prisma.cart.deleteMany({
      where: {
        orderedById: Number(req.user.id),
      },
    });

    res.json({ ok: true, order });
  } catch (error) {
    res.status(500).json({ message: "Post User Order is Error!!!" });
    console.log(error);
  }
};

// list order
exports.getUserOrder = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { orderedById: Number(req.user.id) },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (orders.length === 0) {
      return res.status(400).json({ ok: false, message: "No Oreder" });
    }
    res.json({ ok: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Get User Order is Error!!!" });
    console.log(error);
  }
};
