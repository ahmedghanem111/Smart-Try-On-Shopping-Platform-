"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useState, useCallback, useEffect } from "react";
import { API } from "@/lib/axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
  });

const getAuthToken = (user) => {
  if (user?.token) return user.token;
  if (user?.accessToken) return user.accessToken;
  const lsToken =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("jwt");
  if (lsToken) return lsToken;
  return null;
};

const buildHeaders = (token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
};

export default function FindMyFitPage() {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [clothes, setClothes] = useState([]);
  const [loadingClothes, setLoadingClothes] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [personFile, setPersonFile] = useState(null);
  const [previewPerson, setPreviewPerson] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClothes = async () => {
      setLoadingClothes(true);
      try {
        const first = await API.get("/api/products?pageNumber=1");
        const totalPages = first.data.pages || 1;
        let all = first.data.products || [];
        if (totalPages > 1) {
          const rest = await Promise.all(
            Array.from({ length: totalPages - 1 }, (_, i) =>
              API.get(`/api/products?pageNumber=${i + 2}`)
            )
          );
          rest.forEach((r) => { all = all.concat(r.data.products || []); });
        }
        const clothesOnly = all.filter((p) => p.category === "Clothes");
        setClothes(clothesOnly);
      } catch {
        setError("Failed to load clothes. Please try again.");
      } finally {
        setLoadingClothes(false);
      }
    };
    fetchClothes();
  }, []);

  const handlePersonFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, WEBP, etc.)");
      return;
    }
    setPersonFile(file);
    setPreviewPerson(URL.createObjectURL(file));
    setError("");
    setResultImage(null);
  }, []);

  const handleTryOn = async () => {
    if (!personFile) return setError("Please upload your photo first.");
    if (!selectedProduct) return setError("Please select a garment.");

    const token = getAuthToken(user);
    if (!token) return setError("You must be logged in to use this feature.");

    setLoading(true);
    setError("");
    setStatus("Preparing images…");

    try {
      const personBase64 = await fileToBase64(personFile);

      setStatus("Loading garment…");
      const garmentResponse = await fetch(selectedProduct.image);
      const garmentBlob = await garmentResponse.blob();
      const garmentBase64 = await fileToBase64(garmentBlob);

      setStatus("Tailoring your fit…");
      const response = await fetch(`${API_BASE_URL}/api/try-on`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify({
          personImage: personBase64,
          garmentImage: garmentBase64,
          description: selectedProduct.name,
        }),
      });

      if (!response.ok) {
        let message = `Server error: ${response.status}`;
        try {
          const errData = await response.json();
          message = errData?.message || errData?.error || message;
        } catch {}
        throw new Error(message);
      }

      const result = await response.json();
      if (!result?.resultImage) throw new Error("Server returned no result image.");

      setResultImage(result.resultImage);
      setStatus("");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setStatus("");
    }
  };

  const dark = theme === "dark";

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      dark ? "bg-[#020617] text-white" : "bg-[#f8fafc] text-slate-900"
    } p-6 md:p-12 selection:bg-blue-500`}>

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-5%] right-[-5%] w-[45%] h-[45%] rounded-full blur-[120px] transition-all duration-1000 ${
          dark ? "bg-blue-600/20" : "bg-blue-400/10"
        }`} />
        <div className={`absolute bottom-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full blur-[120px] transition-all duration-1000 ${
          dark ? "bg-indigo-600/20" : "bg-indigo-400/10"
        }`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-16">

        <header className={`flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-10 transition-colors duration-1000 ${
          dark ? "border-white/5" : "border-slate-200"
        }`}>
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none uppercase">
              FITTING<span className="text-blue-600">ROOM</span>
            </h1>
            <p className="text-[10px] tracking-[0.7em] font-bold opacity-40 uppercase">
              A.I Virtual Atelier
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <p className="text-[9px] font-black uppercase tracking-widest opacity-30 leading-loose">
              Neural Rendering Engine<br />Stable Diffusion v3.5
            </p>
          </div>
        </header>

        <div className="grid lg:grid-cols-2 gap-20 items-start">

          <div className="space-y-16">

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                  dark ? "bg-white text-black" : "bg-black text-white"
                }`}>01</span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">
                  Your Portrait
                </h3>
              </div>

              <label className={`group relative block aspect-[4/5] rounded-[3rem] border-2 border-dashed transition-all duration-700 overflow-hidden cursor-pointer shadow-2xl ${
                dark
                  ? "bg-slate-900/40 border-slate-700 hover:border-blue-500 hover:shadow-blue-500/10"
                  : "bg-white border-slate-200 hover:border-blue-500 shadow-slate-200"
              }`}>
                {previewPerson ? (
                  <img
                    src={previewPerson}
                    alt="Preview"
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full border border-current flex items-center justify-center text-4xl font-thin">+</div>
                    <p className="text-[9px] font-black uppercase tracking-widest">Select High-Res Image</p>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePersonFileChange} />
              </label>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${
                  dark ? "bg-white text-black" : "bg-black text-white"
                }`}>02</span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.4em] opacity-60">
                  Product
                </h3>
              </div>

              <div
                onClick={() => !loadingClothes && setPickerOpen(true)}
                className={`relative p-6 rounded-[2rem] border-2 border-dashed transition-all duration-500 flex items-center gap-6 ${
                  loadingClothes
                    ? "opacity-50 cursor-wait"
                    : "cursor-pointer"
                } ${
                  dark
                    ? "bg-slate-900/40 border-slate-700 hover:border-blue-500"
                    : "bg-white border-slate-200 hover:border-blue-500 shadow-lg"
                }`}
              >
                {loadingClothes ? (
                  <div className="flex items-center gap-4 w-full animate-pulse">
                    <div className={`w-16 h-16 rounded-xl flex-shrink-0 ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
                    <div className="space-y-2">
                      <div className={`h-3 w-28 rounded ${dark ? "bg-slate-700" : "bg-slate-200"}`} />
                      <div className={`h-2 w-20 rounded ${dark ? "bg-slate-800" : "bg-slate-100"}`} />
                    </div>
                  </div>
                ) : selectedProduct ? (
                  <>
                    <div className={`p-3 rounded-xl flex-shrink-0 ${dark ? "bg-black/20" : "bg-slate-100"}`}>
                      <img
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        className="w-16 h-16 object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-black uppercase tracking-widest">{selectedProduct.name}</p>
                      <p className="text-[9px] opacity-40 uppercase tracking-tighter italic mt-1">{selectedProduct.brand}</p>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest opacity-40 flex-shrink-0">Change ↓</p>
                  </>
                ) : (
                  <div className="flex items-center gap-4 w-full">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                      dark ? "bg-slate-800" : "bg-slate-100"
                    }`}>👕</div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest">Select a Garment</p>
                      <p className="text-[9px] opacity-40 uppercase tracking-tighter mt-1">
                        {clothes.length} items available
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleTryOn}
              disabled={loading || !personFile || !selectedProduct}
              className={`w-full py-10 rounded-[2.5rem] text-[13px] font-black uppercase tracking-[1.2em] transition-all transform active:scale-95 shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed ${
                dark
                  ? "bg-white text-black hover:bg-blue-50"
                  : "bg-slate-900 text-white hover:bg-black"
              }`}
            >
              {loading ? "Processing Synthesis…" : "Generate Look"}
            </button>
          </div>

          <div className="lg:sticky lg:top-12">
            <div className={`relative aspect-[3/4] w-full rounded-[4rem] border-4 transition-all duration-1000 overflow-hidden ${
              dark
                ? "bg-black/40 border-white/5"
                : "bg-white border-slate-100 shadow-2xl"
            }`}>
              {loading && (
                <div className={`absolute inset-0 z-40 flex flex-col items-center justify-center backdrop-blur-2xl ${
                  dark ? "bg-black/80" : "bg-white/80"
                }`}>
                  <div className="w-24 h-24 relative animate-spin">
                    <div className="absolute inset-0 border-t-2 border-blue-600 rounded-full" />
                  </div>
                  <p className="mt-10 text-[10px] font-black uppercase tracking-[1.5em] text-blue-500">{status}</p>
                </div>
              )}

              {resultImage ? (
                <img src={resultImage} alt="Result" className="w-full h-full object-cover animate-in fade-in duration-1000" />
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-8">
                  <span className="text-[12px] font-black uppercase tracking-[2.5em] ml-[2.5em]">Your outfit</span>
                  <div className="w-[1px] h-32 bg-current animate-pulse" />
                </div>
              )}
            </div>

            {error && (
              <div className="mt-8 p-6 bg-red-600 text-white rounded-[2rem] text-center uppercase tracking-widest text-[10px] font-black">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {pickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setPickerOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-lg rounded-[2.5rem] overflow-hidden flex flex-col ${
              dark ? "bg-slate-900 border border-white/10" : "bg-white border border-slate-100 shadow-2xl"
            }`}
          >
            <div className={`flex items-center justify-between px-8 py-6 border-b ${
              dark ? "border-white/5" : "border-slate-100"
            }`}>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.4em]">Choose a Garment</p>
                <p className="text-[9px] opacity-40 uppercase tracking-widest mt-1">{clothes.length} items available</p>
              </div>
              <button
                onClick={() => setPickerOpen(false)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-colors ${
                  dark ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200"
                }`}
              >×</button>
            </div>

            <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
              {clothes.length === 0 ? (
                <p className="text-center py-8 text-sm opacity-40 uppercase tracking-widest">No clothes found</p>
              ) : (
                clothes.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => { setSelectedProduct(p); setError(""); setPickerOpen(false); }}
                    className={`flex items-center gap-5 p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                      selectedProduct?._id === p._id
                        ? "border-blue-600 bg-blue-600/5"
                        : dark
                          ? "border-transparent bg-white/5 hover:bg-white/10"
                          : "border-transparent bg-slate-50 hover:bg-slate-100"
                    }`}
                  >
                    <div className={`p-2 rounded-xl flex-shrink-0 ${dark ? "bg-black/30" : "bg-white shadow"}`}>
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black uppercase tracking-widest truncate">{p.name}</p>
                      <p className="text-[9px] opacity-40 uppercase tracking-tighter mt-0.5">{p.brand}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                      selectedProduct?._id === p._id
                        ? "border-blue-600 bg-blue-600"
                        : "border-current opacity-20"
                    }`}>
                      {selectedProduct?._id === p._id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}