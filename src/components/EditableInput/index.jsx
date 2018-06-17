import React, { Component } from 'react';
import PropTypes from 'prop-types';

const ENTER = 13;

class EditableInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: props.text,
      isEditing: false
    };
  }

  onTextChange = (e) => {
    this.props.onTextChange(e.target.value);
    this.setState({ text: e.target.value });
  }

  onEnter = (e) => {
    if (e.keyCode === ENTER) {
      this.onEditOff();
    }
  }

  onEditOn = () => {
    this.setState({ isEditing: true });
  }

  onEditOff = () => {
    this.setState({ isEditing: false });
  }

  render() {
    const { text, isEditing } = this.state;
    const { placeholder } = this.props;

    if (isEditing) {
      return (
        <input
          className="pt-input"
          placeholder={placeholder}
          type="text"
          value={text}
          onChange={this.onTextChange}
          onKeyDown={this.onEnter}
          onBlur={this.onEditOff}
        />
      );
    }

    return (
      <input
        readOnly
        className="pt-input"
        placeholder={placeholder}
        type="text"
        value={text}
        onClick={this.onEditOn}
      />
    );
  }
}

EditableInput.propTypes = {
  text: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onTextChange: PropTypes.func
};

EditableInput.defaultProps = {
  placeholder: 'Enter text.'
};

export default EditableInput;
