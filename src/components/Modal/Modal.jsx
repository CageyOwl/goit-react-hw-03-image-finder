import React from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import css from './modal.module.css';

const modalRoot = document.querySelector('#modal-root');

export default class Modal extends React.Component {
  handleKeyDown = event => {
    if (event.code === 'Escape') {
      this.props.onEscapeClose();
    }
  };

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { imageAlt, imageURL, onClose } = this.props;

    return createPortal(
      <div className={css.overlay} onClick={onClose}>
        <div className={css.modal}>
          <img className="" alt={imageAlt} src={imageURL} />
        </div>
      </div>,
      modalRoot
    );
  }
}

Modal.propTypes = {
  onClick: PropTypes.func.isRequired,
  onEscapeClose: PropTypes.func.isRequired,
  imageAlt: PropTypes.string.isRequired,
  imageURL: PropTypes.string.isRequired,
};