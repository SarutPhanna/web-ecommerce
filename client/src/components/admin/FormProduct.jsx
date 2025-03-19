import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { createProduct, deleteProduct } from "../../api/product";
import UploadFile from "./Uploadfile";
import ImageSlideFormProduct from "../hooks/ImageSlideFormProduct";
import { CirclePlus } from "lucide-react";

const FormProduct = () => {
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categoris = useEcomStore((state) => state.categoris);
  const getProduct = useEcomStore((state) => state.getProduct);
  // const products = useEcomStore((state) => state.products) || [];

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    images: [],
  });

  const [openAddProduct, setAddProduct] = useState(false);
  const toggleProduct = () => setAddProduct((prev) => !prev);

  useEffect(() => {
    getCategory(token);
    getProduct(token, 20);
  }, []);

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.title ||
      !form.description ||
      !form.price ||
      !form.quantity ||
      !form.categoryId
    ) {
      return toast.warning("Please fill all fields!");
    }

    try {
      const res = await createProduct(token, form);
      toast.success(`Add Product ${res.data.title} Success!`);
      getProduct(token, 20);
      setForm({
        title: "",
        description: "",
        price: "",
        quantity: "",
        categoryId: "",
        images: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("OK?")) {
      try {
        const res = await deleteProduct(token, id);
        getProduct(token);
        toast.success("Successfully deleted product!");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <div>
        <button
          className="flex gap-1 items-center bg-blue-500 p-2 mb-3 rounded text-white hover:bg-blue-600"
          onClick={toggleProduct}
        >
          <CirclePlus />
        </button>
        {openAddProduct && (
          <form
            className="p-10 flex flex-col items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-3 w-full p-10">
              <div>
                <p className="text-lg font-bold after:content-['*'] after:text-red-500">
                  Model
                </p>
                <input
                  className="border-2 w-full h-10 px-2"
                  value={form.title}
                  onChange={handleOnChange}
                  name="title"
                />
              </div>

              <div>
                <p className="text-lg font-bold after:content-['*'] after:text-red-500">
                  Description
                </p>
                <textarea
                  className="border-2 w-full h-20 px-2"
                  value={form.description}
                  onChange={handleOnChange}
                  name="description"
                />
              </div>

              <div>
                <p className="text-lg font-bold after:content-['*'] after:text-red-500">
                  Price
                </p>
                <input
                  className="border-2 w-full h-10 px-2"
                  value={form.price}
                  type="number"
                  onChange={handleOnChange}
                  name="price"
                />
              </div>

              <div>
                <p className="text-lg font-bold after:content-['*'] after:text-red-500">
                  Quantity
                </p>
                <input
                  className="border-2 w-full h-10 px-2"
                  value={form.quantity}
                  type="number"
                  onChange={handleOnChange}
                  name="quantity"
                />
              </div>

              <select
                className="border-2 w-72 h-10 px-2 my-3"
                value={form.categoryId}
                onChange={handleOnChange}
                name="categoryId"
                required
              >
                <option className="text-lg font-bold " value="" disabled>
                  Select
                </option>
                {categoris.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              {/* Uploard */}
              <UploadFile form={form} setForm={setForm} />
              <button className="text-white text-md font-semibold w-20 flex justify-center items-center bg-blue-500 px-16 h-10 rounded-md my-3 hover:bg-blue-600">
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
      <ImageSlideFormProduct handleDelete={handleDelete} />
    </div>
  );
};

export default FormProduct;
