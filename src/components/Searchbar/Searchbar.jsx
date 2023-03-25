import React from 'react';
import PropTypes from 'prop-types';
import { FiSearch } from 'react-icons/fi';
import css from './searchbar.module.css';

export default class Searchbar extends React.Component {
  state = {
    value: '',
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
  };

  render() {
    return (
      <header className={css.searchbar}>
        <form
          className={css.form}
          onSubmit={event => {
            event.preventDefault();
            this.props.onSubmit(this.state.value.trim());
          }}
        >
          <button className={css.button} type="submit">
            <span>
              <FiSearch size={25} stroke="#3f51b5" />
            </span>
          </button>

          <input
            className={css.input}
            type="text"
            autoComplete="off"
            autoFocus
            placeholder="Search images and photos"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </form>
      </header>
    );
  }
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};