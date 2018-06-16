import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import BarcodeScanner from './BarcodeScanner';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<BarcodeScanner />, document.getElementById('root'));
registerServiceWorker();
