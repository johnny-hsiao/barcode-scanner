import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Quagga from 'quagga';
import { Alert } from '@blueprintjs/core';
import Controller from '../Controller';

import './Scanner.css';

class Scanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      alert: {
        isOpen: false
      },
      isScanning: false
    };
  }

  clearAlert = () => {
    this.setState({ alert: { isOpen: false } });
  }

  processBarcode = (codeData) => {
    const { barcodes, saveBarcode, onBarcodeNameChange } = this.props;
    const existingCode = barcodes.find(barcode => barcode.code === codeData.code);
    let newAlert;
    if (existingCode) {
      newAlert = {
        isOpen: true,
        message: 'This barcode has already been scanned.',
        type: 'alert',
        confirmButtonText: 'Close'
      };
    } else {
      const imageData = this.getImageData();
      const newBarcode = {
        code: codeData.code,
        format: codeData.format,
        name: 'Product name',
        image: imageData,
        nameChangeCallback: (name) => onBarcodeNameChange(codeData.code, name)
      };
      newAlert = {
        isOpen: true,
        message: `Do you want to save barcode: ${codeData.code}?`,
        image: imageData,
        confirmCallback: () => saveBarcode(newBarcode),
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        type: 'confirm'
      };
    }
    this.setState({ alert: newAlert });
  }

  getImageData = () => {
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

  startScan = () => {
    this.setState({ isScanning: true }, () => {
      Quagga.init({
        inputStream : {
          name : 'Live',
          type : 'LiveStream',
          target: document.querySelector('#scanner')
        },
        frequency: 10,
        decoder : {
          readers : ['code_128_reader', 'upc_reader'],
        },
        locate: true
      }, (err) => {
        if (err) {
          console.log(err);
          return
        }
        console.log('Initialization finished. Ready to start');
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

  render() {
    const { isScanning, alert } = this.state;

    return (
      <div>
        <Controller onStart={this.startScan} onStop={this.stopScan} />
        {isScanning &&
          <div>
            <div id="scanner" className="viewport">
              <video id="video" autoPlay="true" preload="auto" />
            </div>
            <canvas id="canvas" className="barcode-scanner-canvas" />
          </div>
        }
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

Scanner.propTypes = {
  barcodes: PropTypes.arrayOf(PropTypes.object).isRequired,
  saveBarcode: PropTypes.func.isRequired,
  onBarcodeNameChange: PropTypes.func.isRequired
};

export default Scanner;
