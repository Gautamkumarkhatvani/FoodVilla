import { useState } from "react";
import API from "../../api/axios";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imageName, setImageName] = useState("");
  const [description, setDescription] = useState("");

  const handleUpload = async () => {
    if (!file) return alert("Select file");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("imageName", imageName);
    formData.append("description", description);

    await API.post("/images", formData);
    window.location.reload();
  };

  return (
    <div className="upload-bar">
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <input
        type="text"
        placeholder="Image name"
        value={imageName}
        onChange={(e) => setImageName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default ImageUpload;
