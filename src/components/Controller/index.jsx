import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@blueprintjs/core';

import './Controller.css';

const Controller = ({
  onStart,
  onStop
}) => (
  <div className="barcode-scanner-controller">
    <Button className="pt-intent-primary" onClick={onStart}>Scan</Button>
    <Button className="pt-intent-danger" onClick={onStop}>Stop</Button>
  </div>
);

Controller.propTypes = {
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired
};

export default Controller;
