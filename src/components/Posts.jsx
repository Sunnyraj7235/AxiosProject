import { useEffect, useState } from "react";
import { getPost, deletePost } from "../api/PostApi";
import { Form } from "./Form";
import { toast, ToastContainer } from "react-toastify";

export const Posts = () => {
  const [data, setData] = useState([]);
  const [updateDataApi, setUpdatedDataApi] = useState({});

  const getPostData = async () => {
    const res = await getPost();
    console.log(res.data);
    setData(res.data);
  };

  useEffect(() => {
    getPostData();
  }, []);

  // function to delete Post

  const handleDeletePost = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!isConfirmed) {
      return;
    }

    try {
      const res = await deletePost(id);
      if (res.status === 200) {
        const newUpdatedPosts = data.filter((curPost) => {
          return curPost.id !== id;
        });
        setData(newUpdatedPosts);
      }
      toast.success("Deleted Successfully", { autoClose: 3000 });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete the post.");
    }
  };

  // function to Edit the post
  const handleEditPost = (curElem) => setUpdatedDataApi(curElem);

  return (
    <>
      <section className="section-form">
        <ToastContainer />
        <Form
          data={data}
          setData={setData}
          updateDataApi={updateDataApi}
          setUpdatedDataApi={setUpdatedDataApi}
        />
      </section>
      <section className="section-post">
        <ol>
          {data.map((curElem) => {
            const { id, body, title } = curElem;
            return (
              <li key={id}>
                <p>Title: {title}</p>
                <p>Body: {body}</p>
                <button onClick={() => handleEditPost(curElem)}>Edit</button>
                <button
                  className="btn-delete"
                  onClick={() => handleDeletePost(id)}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
};
