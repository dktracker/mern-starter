import { ADD_POST, ADD_POSTS, DELETE_POST, ADD_COMMENT, DELETE_COMMENT } from './PostActions';

// Initial State
const initialState = { data: [] };

const PostReducer = (state = initialState, action) => {
  let posts;
  let commentIndex;
  switch (action.type) {
    case ADD_POST :
      return {
        data: [action.post, ...state.data],
      };

    case ADD_POSTS :
      return {
        data: action.posts,
      };

    case DELETE_POST :
      return {
        data: state.data.filter(post => post.cuid !== action.cuid),
      };

    case ADD_COMMENT :
      posts = JSON.stringify(state.data);
      posts = JSON.parse(posts);

      for (let i = 0; i < posts.length; i++) {
        if (posts[i].cuid === action.comment.pid) {
          posts[i].comments.push([{
            name: action.comment.name,
            content: action.comment.content,
            pid: action.comment.pid,
            dateAdded: action.comment.dateAdded,
            __v: action.comment.__v,
            _id: action.comment._id,
          }]);
        }
      }

      return {
        data: posts,
      };

    case DELETE_COMMENT :
      posts = JSON.stringify(state.data);
      posts = JSON.parse(posts);

      commentIndex = -1;

      for (let i = 0; i < posts.length; i++) {
        if (posts[i].cuid === action.comment.pid) {
          for (let j = 0; j < posts[i].comments.length; j++) {
            if (posts[i].comments[j][0]._id === action.comment.id) commentIndex = JSON;
          }
          posts[i].comments.splice(commentIndex, 1);
        }
      }

      return {
        data: posts,
      };

    default:
      return state;
  }
};

/* Selectors */

// Get all posts
export const getPosts = state => state.posts.data;

// Get post by cuid
export const getPost = (state, cuid) => state.posts.data.filter(post => post.cuid === cuid)[0];

// Export Reducer
export default PostReducer;
