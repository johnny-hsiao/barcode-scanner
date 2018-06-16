import React, { Component } from 'react';
import Quagga from 'quagga';

import { Alert, Button } from "@blueprintjs/core";

import './BarcodeScanner.css';

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barcodes: [],
      alert: {
        isOpen: false
      }
    }
  }

  processBarcode = (codeData) => {
    const { barcodes } = this.state;
    const existingCode = barcodes.find(barcode => barcode.code === codeData.code);
    if (existingCode) {
      const newAlert = {
        isOpen: true,
        message: 'Code already exists',
        type: 'alert',
        confirmButtonText: 'Close'
      };
      this.setState({ alert: newAlert });
    } else {
      const imageData = this.saveImageData();
      const newBarcode = {
        code: codeData.code,
        format: codeData.format,
        name: '',
        image: imageData
      };
      const newAlert = {
        isOpen: true,
        message: `Do you want to save barcode: ${codeData.code}?`,
        image: imageData,
        confirmCallback: () => {
          this.saveBarcode(newBarcode);
        },
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        type: 'confirm'
      };
      this.setState({ alert: newAlert });
    }
  }

  saveBarcode = (newBarcode) => {
    const { barcodes } = this.state;
    this.setState({
      barcodes: barcodes.concat(newBarcode)
    })
  }

  startScan = () => {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#scanner')
      },
      frequency: 10,
      decoder : {
        readers : ["code_128_reader", "upc_reader"],
      },
      locate: true
    }, (err) => {
      if (err) {
        console.log(err);
        return
      }
      console.log("Initialization finished. Ready to start");
      Quagga.start();
      Quagga.onDetected((data) => {
        if (data && !this.state.alert.isOpen) {
          this.processBarcode(data.codeResult);
        }
      });
    });
  }

  stopScan = () => {
    Quagga.stop();
  }

  saveImageData = () => {
    const width = 320;
    let height = 0;
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    height = video.videoHeight / (video.videoWidth / width);
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
      return canvas.toDataURL('image/png');
    }
  }

  clearAlert = () => {
    this.setState({ alert: { isOpen: false } })
  }

  render() {
    const { alert, barcodes } = this.state;
    return (
      <div className="barcode-scanner">
        <header>
          <h1 className="barcode-scanner__title">Barcode Scanner</h1>
        </header>
        <p className="barcode-scanner__intro">
          To get started, click on scan and start scanning! :)
        </p>
        <div className="barcode-scanner-controller">
          <Button className="pt-intent-primary" onClick={this.startScan}>Scan</Button>
          <Button className="pt-intent-danger" onClick={this.stopScan}>Stop</Button>
        </div>
        <ul>
          {barcodes.map((barcode, idx) => {
            return (
              <li key={idx}>
                <div>
                  {barcode.code}
                </div>
                <div>
                  <img src={barcode.image} alt={barcode.name} />
                </div>
              </li>
            )
          })}
        </ul>
        <div id="scanner" className="viewport">
          <video id="video" autoPlay="true" preload="auto"></video>
        </div>
        <canvas id="canvas" className="barcode-scanner-canvas" />
        <Alert
          isOpen={alert.isOpen}
          onClose={this.clearAlert}
          onConfirm={alert.confirmCallback}
          confirmButtonText={alert.confirmButtonText}
          cancelButtonText={alert.cancelButtonText}
        >
          {alert.image &&
            <img src={alert.image} alt="" />
          }
          <div>{alert.message}</div>
        </Alert>
      </div>
    );
  }
}

export default BarcodeScanner;
