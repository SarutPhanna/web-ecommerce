const prisma = require("../config/prisma");

// change status orders
exports.changeOrderStatus = async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body;
    const orderUpdate = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: orderStatus,
      },
    });
    res.json(orderUpdate);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Change Order Status Is Error" });
  }
};

// get all orders
exports.getOrderAdmin = async (req, res) => {
  try {
    const order = await prisma.order.findMany({
      include: {
        products: {
          include: {
            product: true,
          },
        },
        orderedBy: {
          select: {
            id: true,
            email: true,
            address: true,
          },
        },
      },
    });
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Get Order Admin Is Error" });
  }
};
