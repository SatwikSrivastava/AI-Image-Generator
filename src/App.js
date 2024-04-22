import sampleImg1 from "./assets/loadingimg1.jpg";
import sampleImg2 from "./assets/loadingimg2.jpg";
import sampleImg3 from "./assets/loadingimg3.jpg";
import sampleImg4 from "./assets/loadingimg4.jpg";
import downloadIcon from "./assets/download.webp";
import React, { useState } from "react";
import "./App.css";

function App() {
  const sampleImages = [sampleImg1, sampleImg2, sampleImg3, sampleImg4];
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  console.log(OPENAI_API_KEY);

  const handleImageGeneration = async (e) => {
    e.preventDefault();
    if (isImageGenerating) return;

    const userPrompt = e.target[0].value;
    const userImgQuantity = parseInt(e.target[1].value);

    setIsImageGenerating(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: userPrompt,
            n: userImgQuantity,
            size: "512x512",
            response_format: "b64_json",
          }),
        }
      );

      if (!response.ok)
        throw new Error(
          "Failed to generate AI images. Make sure your API key is valid."
        );

      const { data } = await response.json();
      setGeneratedImages(data);
      console.log(data);
      // Update image cards with generated images
    } catch (error) {
      alert(error.message);
    } finally {
      setIsImageGenerating(false);
    }
  };

  return (
    <div>
      <section className="image-generator">
        <div className="content">
          <h1>OpenAI Image Generator Demo</h1>
          <p>Discover Beautiful Images Of Your Need</p>
          <form onSubmit={handleImageGeneration} className="generate-form">
            <input
              className="prompt-input"
              type="text"
              placeholder="Enter Your Prompt Here"
              required
            />
            <div className="controls">
              <select className="img-quantity">
                <option value="1">1 Image</option>
                <option value="2">2 Images</option>
                <option value="3">3 Images</option>
                <option value="4" selected>
                  4 Images
                </option>
              </select>
              <button
                type="submit"
                className="generate-btn"
                disabled={isImageGenerating}
              >
                {isImageGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </form>
        </div>
      </section>
      <section className="image-gallery">
        <section className="image-gallery">
          {generatedImages.length !== 0 &&
            generatedImages.map((imgData, index) => (
              <div className="img-card" key={index}>
                <img
                  src={`data:image/jpeg;base64,${imgData.b64_json}`}
                  alt={`Image ${index}`}
                />
                <a
                  className="download-btn"
                  href={`data:image/jpeg;base64,${imgData.b64_json}`}
                  download={`${new Date().getTime()}.jpg`}
                >
                  <img src={downloadIcon} alt="download icon" />
                </a>
              </div>
            ))}
          {generatedImages.length === 0 &&
            sampleImages.map((imgData, index) => (
              <div className="img-card" key={index}>
                <img src={imgData} alt={`Image ${index}`} />
              </div>
            ))}
        </section>
      </section>
    </div>
  );
}

export default App;
