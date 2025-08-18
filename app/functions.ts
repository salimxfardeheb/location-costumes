export async function handleUpload (e: React.ChangeEvent<HTMLInputElement>,  setPreview: (url: string) => void,
  setUploadedUrl: (url: string) => void){
const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploadedUrl(data.url);
}