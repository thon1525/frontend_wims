import Barcode from "react-barcode";
import { createRoot } from "react-dom/client";
export const generateBarcodeBase64 = (barcodeValue) => {
    return new Promise((resolve, reject) => {
      if (!barcodeValue) {
        resolve(null);
        return;
      }
  
      try {
        // Create a temporary div to render the barcode
        const tempDiv = document.createElement("div");
        tempDiv.style.position = "absolute";
        tempDiv.style.left = "-9999px";
        document.body.appendChild(tempDiv);
  
        // Render the barcode using react-barcode
        const barcode = (
          <Barcode
            value={barcodeValue}
            width={1}
            height={30}
            displayValue
            fontSize={12}
            format="CODE128"
          />
        );
  
        
        const root = createRoot(tempDiv);
        root.render(barcode);
  
        // Wait for the rendering to complete
        setTimeout(() => {
          const svg = tempDiv.querySelector("svg");
          if (!svg) {
            document.body.removeChild(tempDiv);
            reject(new Error("Failed to render barcode SVG"));
            return;
          }
  
          // Convert SVG to base64
          const svgData = new XMLSerializer().serializeToString(svg);
          const canvas = document.createElement("canvas");
          const img = new Image();
  
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const base64 = canvas.toDataURL("image/png");
            document.body.removeChild(tempDiv);
            resolve(base64);
          };
  
          img.onerror = () => {
            document.body.removeChild(tempDiv);
            reject(new Error("Failed to load barcode image"));
          };
  
          img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
        }, 100); // Small delay to ensure rendering
      } catch (error) {
        reject(error);
      }
    });
  };