import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";

dotenv.config();

const token = String(process.env.BOT_TOKEN);
const id = String(process.env.CHANNEL_ID);

export async function upload(buff) {
  try {
    const formData = new FormData();
    formData.append("chat_id", id);
    formData.append("document", buff, "photo.jpg");

    const res = await axios.post(
      `https://api.telegram.org/bot${token}/sendDocument`,
      formData,
      { headers: formData.getHeaders() }
    );

    const fileId = res.data.result.document.file_id;
    const fileRes = await axios.get(
      `https://api.telegram.org/bot${token}/getFile?file_id=${fileId}`
    );

    const filePath = fileRes.data.result.file_path;
    const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;
    return { fileUrl, filePath };
  } catch (e) {
    console.log(e);
  }
}
