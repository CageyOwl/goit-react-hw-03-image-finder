import React from 'react';
import Searchbar from './Searchbar/Searchbar';
import api from '../services/api';
import Loader from './Loader/Loader';
import ImageGallery from './ImageGallery/ImageGallery';
import { PER_PAGE } from '../services/api';
import Button from './Button/Button';
import Modal from './Modal/Modal';
import { animateScroll } from 'react-scroll';
import css from './app.module.css';

export class App extends React.Component {
  state = {
    status: 'idle',
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
    this.setState({ status: 'pending' });

    let data = {};
    try {
      data = await api(searchQuery, page);
      if (!data.total) {
        throw new Error('No results found.');
      }
    } catch (error) {
      this.setState({ status: 'rejected', error: error.message });
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

    this.setState({ status: 'resolved' });
  };

  componentDidUpdate(prevProps, prevState) {
    const { searchQuery, page } = this.state;
    if (searchQuery === prevState.searchQuery && page === prevState.page) {
      return;
    }

    !searchQuery
      ? this.setState({
          status: 'rejected',
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

        {status === 'pending' && <Loader />}
        {status === 'rejected' && <p className={css.error}>{error}</p>}
        {status === 'resolved' && (
          <ImageGallery hits={hits} openModal={this.openModal} />
        )}
        {status === 'resolved' && page !== maxPage && (
          <Button onLoadMoreClick={this.onLoadMoreClick} />
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
