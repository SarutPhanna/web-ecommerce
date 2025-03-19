import React, { useState, useEffect } from "react";
import { createCategory, removeCategory } from "../../api/category";
import useEcomStore from "../../store/ecom-store";
import { toast } from "react-toastify";
import { Trash2 } from "lucide-react";

const FormCategory = () => {
  // Javascript

  const [errors, setErrors] = useState({
    name: false,
  });

  const token = useEcomStore((state) => state.token);
  const [name, setName] = useState("");
  const categoris = useEcomStore((state) => state.categoris);
  const getCategory = useEcomStore((state) => state.getCategory);

  useEffect(() => {
    getCategory(token);
  }, []);

  // Logic send form
  const handleSubmit = async (e) => {
    e.preventDefault();

    let newErrors = {
      name: name === "",
    };
    setErrors(newErrors);

    if (!name) {
      return toast.warning("Please fill data!");
    }
    if (categoris.some((category) => category.name === name)) {
      return toast.warning("This category already exists!");
    }
    try {
      const res = await createCategory(token, { name });
      toast.success(`Add Category ${res.data.name} Success!`);
      getCategory(token);
      setName(""); // set input is empty after add category
    } catch (error) {
      console.log(error);
    }
  };
  // Remove category
  const handleRemove = async (id) => {
    try {
      const res = await removeCategory(token, id);
      toast.success(`Delete ${res.data.name} Success!`);
      getCategory(token);
    } catch (error) {
      console.log(error);
    }
  };
  // End Javascript
  return (
    <div className="container mx-auto p-4 bg-white shadow-md">
      <h1 className="text-xl font-lg">Category Management</h1>
      {/* Form add category */}
      <form onSubmit={handleSubmit} className="my-4">
        <input
          value={name} // set value name in input
          onChange={(e) => setName(e.target.value)}
          className={`border w-96 h-10 px-2 ${
            errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
          }`}
          type="text"
        />
        <button className="text-white text-md font-semibold bg-blue-500 ml-3 w-auto h-10 px-3 rounded-lg font-lg hover:bg-blue-600">
          Add Category
        </button>
      </form>
      <hr />
      {/* List Categoris */}
      <ul className="list-none">
        {categoris.map((item, index) => (
          <li key={index} className="flex justify-between my-2">
            <span>{item.name}</span>
            <button
              onClick={() => handleRemove(item.id)}
              className="bg-red-500 rounded-md p-1 shadow-sm cursor-pointer hover:bg-red-600"
            >
              <Trash2 className="text-white" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormCategory;
