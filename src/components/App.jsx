import React from 'react';
import { animateScroll } from 'react-scroll';

import api from '../services/api';
import Searchbar from './Searchbar/Searchbar';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
// import Button from './Button/Button';
import Modal from './Modal/Modal';

import { PER_PAGE } from '../services/api';
import STATUS from '../services/statuses';

import css from './app.module.css';

export class App extends React.Component {
  state = {
    status: STATUS.IDLE,
    error: '',
    searchQuery: '',
    page: 0,
    maxPage: 0,
    hits: [],
    isModalOpened: false,
    modalImgAlt: '',
    modalImgURL: '',
  };

  onSubmit = formValue => {
    if (this.state.searchQuery !== formValue) {
      this.setState({ searchQuery: formValue, page: 1 });
    }
  };

  toggleModal = () => {
    this.setState({ isModalOpened: !this.state.isModalOpened });
  };

  closeModalOnBackdropCLick = event => {
    if (event.currentTarget === event.target) {
      this.toggleModal();
    }
  };

  openModal = event => {
    if (event.target.tagName !== 'IMG') return;
    this.setState({
      modalImgAlt: event.target.alt,
      modalImgURL: event.target.dataset.largeimageurl,
    });
    this.toggleModal();
  };

  onLoadMoreClick = () => {
    this.setState(prevState => {
      return { page: ++prevState.page };
    });

    animateScroll.scrollToBottom({
      duration: 1000,
      delay: 0,
      smooth: 'linear',
    });
  };

  loadNewImages = async (searchQuery, page, prevState) => {
    this.setState({ status: STATUS.PENDING });

    let data = {};
    try {
      data = await api(searchQuery, page);
      if (!data.total) {
        throw new Error('No results found.');
      }
    } catch (error) {
      this.setState({ status: STATUS.REJECTED, error: error.message });
      return;
    }

    if (page === 1) {
      this.setState({
        hits: [...data.hits],
        maxPage: Math.ceil(data.totalHits / PER_PAGE),
      });
    } else {
      this.setState({ hits: [...prevState.hits, ...data.hits] });
    }

    this.setState({ status: STATUS.RESOLVED });
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;
    if (searchQuery === prevState.searchQuery && page === prevState.page) {
      return;
    }

    !searchQuery
      ? this.setState({
          status: STATUS.REJECTED,
          error: 'Empty input, write something, please.',
        })
      : this.loadNewImages(searchQuery, page, prevState);
  }

  render() {
    const {
      status,
      error,
      hits,
      page,
      maxPage,
      isModalOpened,
      modalImgAlt,
      modalImgURL,
    } = this.state;

    return (
      <div className={css.app}>
        <Searchbar onSubmit={this.onSubmit} />

        {status === STATUS.PENDING && <Loader />}
        {status === STATUS.REJECTED && <p className={css.error}>{error}</p>}
        {status === STATUS.RESOLVED && (
          <ImageGallery hits={hits} openModal={this.openModal} />
        )}
        {status === STATUS.RESOLVED && page !== maxPage && (
          // <Button onLoadMoreClick={this.onLoadMoreClick} />
          <button className={css.button} type="button" onClick={onLoadMoreClick}>Load more</button>
        )}

        {isModalOpened && (
          <Modal
            onClose={this.closeModalOnBackdropCLick}
            onEscapeClose={this.toggleModal}
            imageAlt={modalImgAlt}
            imageURL={modalImgURL}
          />
        )}
      </div>
    );
  }
}
