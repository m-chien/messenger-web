import api from "./api";
import { AttachmentDTO } from "@/types/message";

export const uploadService = {
  upload: async (file: File): Promise<AttachmentDTO> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/files/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const { objectKey, fileName, fileType, fileSize } = response.data;

    if (!objectKey || objectKey.includes("://")) {
      throw new Error("Upload response does not contain a valid MinIO objectKey");
    }

    return {
      fileUrl: objectKey,
      fileName: fileName || file.name,
      fileType: fileType || file.type || "application/octet-stream",
      fileSize: fileSize ?? file.size,
    };
  },
};
