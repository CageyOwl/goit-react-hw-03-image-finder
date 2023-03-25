import PropTypes from 'prop-types';
import css from './button.module.css';

export default function Button({ onLoadMoreClick }) {
    return (
        <button className={css.button} type="button" onClick={onLoadMoreClick}>Load more</button>
    );
}

Button.propTypes = {
    onLoadMoreClick: PropTypes.func.isRequired,
};