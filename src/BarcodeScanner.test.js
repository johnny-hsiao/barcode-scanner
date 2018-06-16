import React from 'react';
import ReactDOM from 'react-dom';
import BarcodeScanner from './BarcodeScanner';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<BarcodeScanner />, div);
  ReactDOM.unmountComponentAtNode(div);
});
