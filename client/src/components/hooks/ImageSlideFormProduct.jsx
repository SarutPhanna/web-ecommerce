import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { Link } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import placeholder from "../../assets/images/placeholder.jpg";

export const ImageSlideFormProduct = (props) => {
  const { handleDelete } = props;
  const products = useEcomStore((state) => state.products) || [];
  const interval = 5000;

  const [currentIndexes, setCurrentIndexes] = useState(products.map(() => 0));
  console.log(currentIndexes);

  useEffect(() => {
    const timers = products.map((item, index) => {
      if (item.images.length > 1) {
        // จะเริ่มทำงานทุก 3 วินาที
        // Step 1.Set State มีสินค้า 3 ชิ้น เริ่มต้นด้วยรูปเเรก prevIndexes = [0, 1, 2];
        // Step 2.Copy State
        // Step 3.เปลี่ยน Index ของเเต่ละรูปให้ +1 เช่น Index ต่อไป [1,2,0] -> [2,0,1] -> [0,1,2] ทุก 5 วินาที
        // Step 4.คืนค่า Array ใหม่ให้กลับ State ก็จะทำให้ State ตอนนี้ภาพไม่เริ่มจาก 0 เเล้ว จะเป็น 1 เเทน ผ่านไป 5วินาทีก็เป็น 2
        // สรุปเเล้วจะทำ Step 1-4 ทุก 2 วินาที
        return setInterval(() => {
          setCurrentIndexes((prevIndexes) => {
            const newIndexes = [...prevIndexes];
            newIndexes[index] = (newIndexes[index] + 1) % item.images.length;
            return newIndexes;
          });
        }, interval);
      }
      return null;
    });
    // Reset default all images = index 0
    setCurrentIndexes(products.map(() => 0));
    return () => {
      timers.forEach((timer) => timer && clearInterval(timer));
    };
  }, [products, interval]);

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className="bg-gray-300">
          <tr>
            <th className="p-2">No.</th>
            <th>Picture</th>
            <th>Model</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Sold</th>
            <th>UpdatedAt</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {products.map((item, index) => (
            <tr key={index}>
              <th>{index + 1}</th>
              <td className="flex justify-center">
                {item.images &&
                item.images.length > 0 &&
                item.images[currentIndexes[index]] ? (
                  <img
                    className="w-24 h-24 object-contain"
                    src={item.images[currentIndexes[index]].url}
                    alt="thumbnail"
                  />
                ) : (
                  <div className="flex justify-center">
                    <img
                      className="w-24 h-24 object-contain"
                      src={placeholder}
                      alt="Placeholder "
                    />
                  </div>
                )}
              </td>
              <td>{item.title}</td>
              <td>{item.description}</td>
              <td>{item.price}</td>
              <td>{item.quantity}</td>
              <td>{item.sold}</td>
              <td>{item.updatedAt}</td>
              <td className="px-4 py-2 text-center">
                <div className="flex justify-center items-center gap-2">
                  <button className="bg-yellow-500 rounded-md p-1 shadow-md text-white hover:bg-yellow-600">
                    <Link to={`/admin/product/${item.id}`}>
                      <Pencil />
                    </Link>
                  </button>
                  <button
                    className="bg-red-500 rounded-md p-1 shadow-md cursor-pointer text-white hover:bg-red-600"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ImageSlideFormProduct;
