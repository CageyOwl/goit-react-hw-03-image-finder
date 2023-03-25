import React from 'react';
import PropTypes from 'prop-types';
import ImageGalleryItem from './ImageGalleryItem';
import css from './image-gallery.module.css';

export default class ImageGallery extends React.Component {
  render() {
    const { hits, openModal } = this.props;

    return (
      <ul className={css.gallery} onClick={openModal}>
        {hits.map(hit => (
          <ImageGalleryItem
            key={hit.id}
            tags={hit.tags}
            webformatURL={hit.webformatURL}
            largeImageURL={hit.largeImageURL}
          />
        ))}
      </ul>
    );
  }
}

ImageGallery.propTypes = {
  hits: PropTypes.array.isRequired,
  openModal: PropTypes.func.isRequired,
};
