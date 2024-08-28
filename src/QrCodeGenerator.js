import { useState, useRef } from "react";
import * as htmlToImage from "html-to-image";
import QRCode from 'react-qr-code';

function QrCodeGenerator() {
  const [url, setUrl] = useState("");
  const [qrIsVisible, setQrIsVisible] = useState(false);

  const handleQrCodeGenerator = () => {
    if (!url) {
      return;
    }
    setQrIsVisible(true);
  };

  const qrCodeRef = useRef(null);

  const downloadQRCode = () => {
    htmlToImage
      .toPng(qrCodeRef.current)
      .then(function (dataUrl) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "qr-code.png";
        link.click();
      })
      .catch(function (error) {
        console.error("Error generating QR code:", error);
      });
  };

  const printQRCode = () => {
    // Check if the QR code is visible
    if (qrCodeRef.current) {
      const svgElement = qrCodeRef.current.querySelector('svg');
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const printWindow = window.open("", "", "width=600,height=600");
        printWindow.document.write("<html><head><title>Print QR Code</title></head><body>");
        printWindow.document.write("<h1>QR Code</h1>");
        printWindow.document.write(`<div>${svgData}</div>`);
        printWindow.document.write("</body></html>");
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      } else {
        console.error("No SVG element found for printing.");
      }
    } else {
      console.error("QR code reference is null.");
    }
  };

  return (
    <div className="qrcode__container">
      <h1>QR Code Generator</h1>
      <div className="qrcode__container--parent" ref={qrCodeRef}>
        <div className="qrcode__input">
          <input
            type="text"
            placeholder="Enter a URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={handleQrCodeGenerator}>Generate QR Code</button>
        </div>
        {/* {qrIsVisible && (
          <div className="qrcode__download">
            <div className="qrcode__image">
              <QRCode value={url} size={300} />
            </div>
          </div>
        )} */}
      </div>

      {qrIsVisible && (
        <div className="qrcode__download">
          <div className="qrcode__image" ref={qrCodeRef}>
            <QRCode value={url} size={300} />
          </div>
          <button onClick={downloadQRCode}>Download QR Code</button>
          <button onClick={printQRCode}>Print QR Code</button>
        </div>
      )}
    </div>
  );
}

export default QrCodeGenerator;

