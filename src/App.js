import React, { Component } from 'react';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subreddit: '',
      isLoading: true,
      error: null,
      posts: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({subreddit: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.fetchPostsForSubreddit()
  }

  fetchPostsForSubreddit () {
    isLoading: true
    const { subreddit } = this.state;

    fetch('https://www.reddit.com/r/' + subreddit + '.json')
      .then((response) =>
        response.json()
      )
      .then((data) =>
        this.setState({
          error: false,
          posts: data.data.children
        })
      )
      .catch((error) =>
        this.setState({
          isLoading: false,
          error: true
        })
      )
  }

  render() {
    const { subreddit } = this.state;
    return (
      <div className="App">
        <h2>Reddit App</h2>
        <p>r/{subreddit}</p>
        <form onSubmit={this.handleSubmit}>
          <input type="text" value={subreddit} onChange={this.handleChange}></input>
        </form> 
        {this.state.error ? <p>Thats not a valid subreddit g</p> : null} 
        {this.state.posts.map((child) => {
          const { title, url } = child.data 
          return <Post key={child.data.id} post={child.data}/>
        })}
      </div>
    );
  }
}

class Post extends Component {
  constructor () {
    super()
    this.state = {
      expanded: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.openComments = this.openComments.bind(this);
  }

  handleClick(event) {
    const { expanded } = this.state;
    expanded ? this.setState({expanded: false}) : this.setState({expanded: true})
  }

  openComments(event) {
    const { comments } = this.state
    comments ? this.setState({comments: false}) : this.setState({comments: true})
  }
  
  render() {
    const { post } = this.props;
    const { expanded } = this.state;
    const { comments } = this.state;
    return (
      <div className="Post">
        <p><p className="score"> {post.score}</p><a href={post.url} target="_blank">{post.title}</a> 
          <button onClick={this.handleClick} className="button"> {expanded ? "Minimize-" : "Expand+"}</button>
          <button onClick={this.openComments} className="commentButton"> Comments </button>
          {comments ? <CommentList key={post.permalink} permalink={post.permalink}/> : null}
        </p>
        
        {expanded ? 
        <div> 
          <p>
          {post.selftext} <img src={post.url} alt={post.url}/> 
          </p>
            
        </div> : null}
      </div>
    )
  }
}

class CommentList extends Component {
  constructor () {
    super()
    this.state = {
      error: null,
      comments: []
    };
  }

  componentDidMount() {
    this.fetchCommentsForPost();
  }

  fetchCommentsForPost() {
    isLoading: true

    fetch('https://www.reddit.com' + this.props.permalink + '.json')
      .then((response) =>
        response.json()
      )
      .then((data) =>
        this.setState({
          error: false,
          comments: data[1].data.children
        })
      )
  }

  render() {

    const { comments } = this.state;

    const rootComment = comments.map((val) => {
      console.log(val)  
      return <ul><li>{val.data.body}</li></ul>;
    })

    return (
      <div>{rootComment}</div>
    )
  }
}

export default App;