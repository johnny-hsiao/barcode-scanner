import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hash from 'string-hash';
import EditableInput from '../EditableInput';

import './BarcodeListing.css';

class BarcodeListing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ''
    };
  }

  onSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  }

  render() {
    const { searchTerm } = this.state;
    const { headings, barcodes } = this.props;
    const filteredBarcodes = searchTerm ? barcodes.filter(barcode => {
      return barcode.name.toLowerCase().includes(searchTerm) || barcode.code.toString().toLowerCase().includes(searchTerm);
    }) : barcodes;
    return (
      <div>
        <div className="barcode-listing__search-bar pt-input-group">
          <span className="pt-icon pt-icon-search" />
          <input
            className="pt-input"
            type="search"
            placeholder="Search product name/barcode"
            onChange={this.onSearchChange}
          />
        </div>
        <table className="barcode-listing__table pt-html-table pt-html-table-striped">
          <thead>
            <tr>
              {headings.map(heading => <th key={hash(heading)}>{heading}</th>)}
            </tr>
          </thead>
          <tbody>
            {filteredBarcodes.map(barcode => (
              <tr key={hash(barcode.code)}>
                <td>{barcode.code}</td>
                <td>
                  <EditableInput
                    text={barcode.name}
                    placeholder="Enter product name."
                    onTextChange={barcode.nameChangeCallback}
                  />
                </td>
                <td>
                  <img src={barcode.image} alt={barcode.name} className="barcode-listing__scanned-image" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

BarcodeListing.propTypes = {
  headings: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  barcodes: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ).isRequired
};

export default BarcodeListing;
