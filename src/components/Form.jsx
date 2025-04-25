import { useEffect, useState } from "react";
import { postData, updateData } from "../api/PostApi";
import { ToastContainer, toast } from "react-toastify";

export const Form = ({ data, setData, updateDataApi, setUpdatedDataApi }) => {
  const [addData, setAddData] = useState({
    title: "",
    body: "",
  });

  let isEmpty = Object.keys(updateDataApi).length === 0;

  //get the updated Data and add into the input field
  useEffect(() => {
    updateDataApi &&
      setAddData({
        title: updateDataApi.title || "",
        body: updateDataApi.body || "",
      });
  }, [updateDataApi]);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setAddData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  //update Data
  const updatePostData = async () => {
    try {
      const res = await updateData(updateDataApi.id, addData);
      if (res.status == 200) {
        setData((prev) => {
          return prev.map((curElem) => {
            return curElem.id == res.data.id ? res.data : curElem;
          });
        });

        setAddData({ title: "", body: "" });
        setUpdatedDataApi({});
        toast.success(`Data Updated Successfully!! at ID: ${res.data.id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Add data to post function
  const addPostData = async () => {
    try {
      const res = await postData(addData);
      if (res.status == 201) {
        setData([...data, res.data]);
        setAddData({ title: "", body: "" });
      }
      toast.success(`Data Added Successfully!! at ID: ${res.data.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  //form submission
  const handleFormSubmit = (e) => {
    const action = e.nativeEvent.submitter.value;
    e.preventDefault();

    // Check for any empty fields
    const emptyFields = Object.entries(addData)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (emptyFields.length > 0) {
      const fieldNames = emptyFields.join(", ");
      toast.error(`Please fill in the following fields: ${fieldNames}`);
      return;
    }

    if (action == "Add") {
      addPostData();
    } else if (action == "Edit") {
      const isConfirmed = window.confirm(
        "Are you sure you want to update this post?"
      );
      if (!isConfirmed) {
        return;
      }
      updatePostData();
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div>
        <label htmlFor="title"></label>
        <input
          type="text"
          autoComplete="off"
          id="title"
          name="title"
          placeholder="Add Title"
          value={addData.title}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <label htmlFor="body"></label>
        <input
          type="text"
          autoComplete="off"
          id="body"
          name="body"
          placeholder="Add Post"
          value={addData.body}
          onChange={handleInputChange}
        />
      </div>
      <button type="submit" value={isEmpty ? "Add" : "Edit"}>
        {isEmpty ? "Add" : "Edit"}
      </button>
    </form>
  );
};
