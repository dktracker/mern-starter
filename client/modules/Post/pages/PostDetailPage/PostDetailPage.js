import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { FormattedMessage } from 'react-intl';

// Import Components
import PostCommentWidget from '../../components/PostCommentWidget/PostCommentWidget';

// Import Style
import styles from '../../components/PostListItem/PostListItem.css';

// Import Actions
import { addCommentRequest, fetchPost } from '../../PostActions';

// Import Selectors
import { getPost } from '../../PostReducer';

// export function PostDetailPage(props) {
class PostDetailPage extends Component {

  handleAddComment = (name, content, pid) => {
    this.props.dispatch(addCommentRequest({ name, content, pid }));
  };

  render() {
    return (
      <div>
        <Helmet title={this.props.post.title} />
        <div className={`${styles['single-post']} ${styles['post-detail']}`}>
          <h3 className={styles['post-title']}>{this.props.post.title}</h3>
          <p className={styles['author-name']}><FormattedMessage id="by" /> {this.props.post.name}</p>
          <p className={styles['post-desc']}>{this.props.post.content}</p>
        </div>

        <PostCommentWidget addComment={this.handleAddComment} post={this.props.post} />

      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
PostDetailPage.need = [params => {
  return fetchPost(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    post: getPost(state, props.params.cuid),
  };
}

PostDetailPage.propTypes = {
  post: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
    comments: PropTypes.array.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect(mapStateToProps)(PostDetailPage);
