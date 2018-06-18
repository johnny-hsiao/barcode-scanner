import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import BarcodeListing from './components/BarcodeListing';
import Scanner from './components/Scanner';

import './BarcodeScanner.css';

const TABLE_HEADINGS = ['Code', 'Name', 'Scanned Image'];

class BarcodeScanner extends Component {
  constructor(props) {
    super(props);

    this.state = {
      barcodes: []
    };
  }

  saveBarcode = (newBarcode) => {
    const { barcodes } = this.state;
    const existingBarcode = barcodes.find(barcode => barcode.code === newBarcode.code);
    if (!existingBarcode) {
      this.setState({ barcodes: barcodes.concat(newBarcode) });
    }
  }

  onBarcodeNameChange = (code, name) => {
    const { barcodes } = this.state;
    const modifiedBarcodes = barcodes.map(barcode => {
      return (barcode.code === code) ? { ...barcode, name } : barcode;
    });

    this.setState({ barcodes: modifiedBarcodes });
  }

  render() {
    const { barcodes } = this.state;

    return (
      <Router>
        <div className="barcode-scanner">
          <header>
            <h1 className="barcode-scanner__title">Barcode Scanner</h1>
          </header>
          <Route
            exact
            path="/"
            render={() => (
              <div>
                <div>
                  <Link to="/codes">View Barcodes</Link>
                </div>
                <p className="barcode-scanner__intro">
                  To get started, click on scan and start scanning! :)
                </p>
                <Scanner
                  barcodes={barcodes}
                  saveBarcode={this.saveBarcode}
                  onBarcodeNameChange={this.onBarcodeNameChange}
                />
              </div>
            )}
          />
          <Route
            path="/codes"
            render={() => (
              <div>
                <div>
                  <Link to="/">Scan Barcodes</Link>
                </div>
                <BarcodeListing
                  headings={TABLE_HEADINGS}
                  barcodes={barcodes}
                />
              </div>
            )}
          />
        </div>
      </Router>
    );
  }
}

export default BarcodeScanner;
