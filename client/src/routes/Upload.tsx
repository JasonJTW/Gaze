import { useEffect, useRef, useState } from "react";
import "./Upload.css";

function App() {
  /// Maximum number of uploads
  const maxAllowedFiles = import.meta.env.VITE_maxAllowedFiles;
  const hostName = import.meta.env.VITE_ServerHostName;

  // 使用 useState 跟踪選擇的文件
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // 使用 useEffect 監聽 selectedFiles 的變化，並在超過最大文件數時觸發警告
  useEffect(() => {
    if (fileInputRef.current && selectedFiles.length > maxAllowedFiles) {
      alert(`You can upload a maximum of ${maxAllowedFiles} files !`);
      // 清空選擇的文件
      setSelectedFiles([]);
      fileInputRef.current.value = "";
    }
  }, [selectedFiles]); // eslint-disable-line react-hooks/exhaustive-deps

  // 處理文件選擇事件
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.files);
    if (event.target.files && fileInputRef.current) {
      setSelectedFiles(Array.from(event.target.files));
      console.log(fileInputRef.current.value);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    /// prevent default submit event
    event.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("image", file);
    });
    console.log(formData);

    try {
      const response = await fetch(`${hostName}/api/upload`, {
        method: "POST",
        body: formData,
      });
      /// Check response status code
      if (!response.ok) {
        /// 如果響應狀態碼表示錯誤，讀取錯誤信息
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Upload failed.");
      }
      const result = await response.json();
      alert(result.message);
      window.location.reload();
    } catch (error) {
      const errorMessage = (error as Error).message;
      console.log("Error uploading files:", errorMessage);
      alert("Upload failed: " + errorMessage);
    }
  };

  return (
    <>
      <div>
        <h1>Upload</h1>
        <form
          action={`${hostName}/api/upload`}
          method="POST"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          <input
            type="file"
            name="image"
            id="imageUpload"
            multiple
            onChange={handleFileChange}
            ref={fileInputRef}
            required
          />
          <input type="submit" />
        </form>
      </div>
    </>
  );
}

export default App;
