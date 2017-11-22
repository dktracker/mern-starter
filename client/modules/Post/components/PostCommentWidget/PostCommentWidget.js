import React, { Component, PropTypes } from 'react';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

// Import Style
import styles from './PostCommentWidget.css';

export class PostCommentWidget extends Component {
  addComment = () => {
    const nameRef = this.refs.name;
    const contentRef = this.refs.content;
    if (nameRef.value && contentRef.value) {
      this.props.addComment(nameRef.value, contentRef.value, this.props.post.cuid);
      nameRef.value = contentRef.value = '';
    }
  };

  render() {
    const data = this.props.post.comments;
    const commentsList = data.map(d => {
      return (<div className={styles['comment-item']} key={d[0]._id}>
        <p className={styles['comment-author']}>{d[0].name} <span className={styles['comment-time']}>[{d[0].dateAdded}]:</span></p>
        <p className={styles['comment-text']}>{d[0].content}</p>
      </div>);
    });

    return (
      <div className={styles['single-post-comments']}>

        <div className={styles['form-content']}>
          <h3>Post comment</h3>
          <input placeholder="Author name" className={styles['form-field-input']} ref="name" />
          <textarea placeholder="Comment text" className={styles['form-field-textarea']} ref="content" />
          <a className={styles['comment-submit-button']} href="#" onClick={this.addComment}><FormattedMessage id="submit" /></a>
        </div>

        <h3>Comments</h3>

        {commentsList}

      </div>
    );
  }
}

PostCommentWidget.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
    comments: PropTypes.string.isRequired,
  }).isRequired,
  addComment: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(PostCommentWidget);
