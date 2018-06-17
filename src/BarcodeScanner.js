import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Quagga from 'quagga';

import { Alert } from "@blueprintjs/core";
import Controller from './components/Controller';
import BarcodeListing from './components/BarcodeListing';

import './BarcodeScanner.css';

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barcodes: [],
      alert: {
        isOpen: false
      },
      isScanning: false
    }
  }

  processBarcode = (codeData) => {
    const { barcodes } = this.state;
    const existingCode = barcodes.find(barcode => barcode.code === codeData.code);
    if (existingCode) {
      const newAlert = {
        isOpen: true,
        message: 'This barcode has already been scanned.',
        type: 'alert',
        confirmButtonText: 'Close'
      };
      this.setState({ alert: newAlert });
    } else {
      const imageData = this.saveImageData();
      const newBarcode = {
        code: codeData.code,
        format: codeData.format,
        name: 'Product name',
        image: imageData,
        nameChangeCallback: (name) => this.onBarcodeNameChange(codeData.code, name)
      };
      const newAlert = {
        isOpen: true,
        message: `Do you want to save barcode: ${codeData.code}?`,
        image: imageData,
        confirmCallback: () => this.saveBarcode(newBarcode),
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        type: 'confirm'
      };
      this.setState({ alert: newAlert });
    }
  }

  saveBarcode = (newBarcode) => {
    const { barcodes } = this.state;
    const existingBarcode = barcodes.find(barcode => barcode.code === newBarcode.code);
    if (!existingBarcode) {
      this.setState({ barcodes: barcodes.concat(newBarcode) });
    }
  }

  startScan = () => {
    this.setState({ isScanning: true }, () => {
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
    });
  }

  stopScan = () => {
    this.setState({ isScanning: false });
    Quagga.stop();
  }

  saveImageData = () => {
    const width = 300;
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

  onBarcodeNameChange = (code, name) => {
    const { barcodes } = this.state;
    const modifiedBarcodes = barcodes.map(barcode => {
      return (barcode.code === code) ? { ...barcode, name } : barcode
    });

    this.setState({ barcodes: modifiedBarcodes });
  }

  render() {
    const { alert, barcodes, isScanning } = this.state;
    return (
      <Router>
        <div className="barcode-scanner">
          <header>
            <h1 className="barcode-scanner__title">Barcode Scanner</h1>
          </header>
          <Route
            exact
            path="/"
            render={() => {
              return (
                <div>
                  <p className="barcode-scanner__intro">
                    To get started, click on scan and start scanning! :)
                  </p>
                  <p><Link to="/codes">View Barcodes</Link></p>
                  <Controller onStart={this.startScan} onStop={this.stopScan} />
                  {isScanning &&
                    <div>
                      <div id="scanner" className="viewport">
                        <video id="video" autoPlay="true" preload="auto"></video>
                      </div>
                      <canvas id="canvas" className="barcode-scanner-canvas" />
                    </div>
                  }
                </div>
              )
            }}
          />
          <Route
            path="/codes"
            render={() => {
              return (
                <div>
                  <div><Link to="/">Scan Barcodes</Link></div>
                  <BarcodeListing
                    headings={['Code', 'Name', 'Scanned Image']}
                    barcodes={barcodes}
                  />
                </div>
              )
            }}
          />
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
      </Router>
    );
  }
}

export default BarcodeScanner;
