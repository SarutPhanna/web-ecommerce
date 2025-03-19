import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { readProduct, updateProduct } from "../../api/product";
import UploadFile from "./Uploadfile";
import { useParams, useNavigate } from "react-router-dom";

const FormEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useEcomStore((state) => state.token);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categoris = useEcomStore((state) => state.categoris);

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
    images: [],
  });

  const fetchProduct = async (token, id) => {
    try {
      const res = await readProduct(token, id);
      setForm(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategory(token);
    fetchProduct(token, id);
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
      const res = await updateProduct(token, id, form);
      toast.success(`Update Product ${res.data.title} Success!`);
      navigate("/admin/product");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <form onSubmit={handleSubmit}>
        <h1>Update Product</h1>
        <input
          className="border"
          value={form.title}
          onChange={handleOnChange}
          name="title"
          placeholder="Title"
        />
        <input
          className="border"
          value={form.description}
          onChange={handleOnChange}
          name="description"
          placeholder="Description"
        />
        <input
          className="border"
          value={form.price}
          type="number"
          onChange={handleOnChange}
          name="price"
          placeholder="Price"
        />
        <input
          className="border"
          value={form.quantity}
          type="number"
          onChange={handleOnChange}
          name="quantity"
          placeholder="Quantity"
        />
        <select
          className="border"
          value={form.categoryId}
          onChange={handleOnChange}
          name="categoryId"
          required
        >
          <option value="" disabled>
            Select
          </option>
          {categoris.map((item, index) => (
            <option key={index} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        <hr />
        {/* Uploard */}
        <UploadFile form={form} setForm={setForm} />
        <button className="bg-blue-500">Update</button>
        <br />
      </form>
    </div>
  );
};

export default FormEditProduct;
