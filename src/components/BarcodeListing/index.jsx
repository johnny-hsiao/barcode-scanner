import React from 'react';
import PropTypes from 'prop-types';
import hash from 'string-hash';
import EditableInput from '../EditableInput';
import './BarcodeListing.css';

const BarcodeListing = (props) => (
  <table className="pt-html-table pt-html-table-striped">
    <thead>
      <tr>
        {props.headings.map(heading => <th key={hash(heading)}>{heading}</th>)}
      </tr>
    </thead>
    <tbody>
      {props.barcodes.map(barcode => (
        <tr key={hash(barcode)}>
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
);

BarcodeListing.propTypes = {
  headings: PropTypes.arrayOf(
    PropTypes.string.isRequired
  ).isRequired,
  barcodes: PropTypes.arrayOf(
    PropTypes.object.isRequired
  ).isRequired
};

export default BarcodeListing;
