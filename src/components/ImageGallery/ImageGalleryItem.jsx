import PropTypes from 'prop-types';
import css from './image-gallery.module.css';

export default function ImageGalleryItem({ tags, webformatURL, largeImageURL }) {
  return (
    <li className={css['gallery-item']}>
      <img className={css['gallery-item__image']} src={webformatURL} alt={tags} data-largeimageurl={largeImageURL} />
    </li>
  );
}

ImageGalleryItem.propTypes = {
  tags: PropTypes.string.isRequired,
  webformatURL: PropTypes.string.isRequired,
  largeImageURL: PropTypes.string.isRequired,
};
