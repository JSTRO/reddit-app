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
    const { subreddit } = this.state;

    fetch('https://www.reddit.com/r/' + subreddit + '.json')
      .then((response) =>
        response.json()
      )
      .then((data) =>
        this.setState({
          isLoading: false,
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
          <div className="form-group">
            <input 
              type="text" 
              className="form-control" 
              value={subreddit} placeholder="Type subreddit here..." 
              onChange={this.handleChange}>
            </input>
          </div>  
        </form> 
        {this.state.error ? <p>Thats not a valid subreddit g</p> : null} 
        <div className="row">
          <div className="col-md-12">
            {this.state.posts.map((child) => {
              const { id } = child.data 
              return <Post key={id} post={child.data}/>
            })}
          </div>
        </div>
             
      </div>
    );
  }
}

class Post extends Component {
  constructor () {
    super()
    this.state = {
      clicked: false
    };

  // this.handleClick = this.handleClick.bind(this);
    this.openComments = this.openComments.bind(this);
  }

  // handleClick(event) {
  //   const { clicked } = this.state;
  //   this.setState({clicked: true});
  //   clicked ? this.setState({clicked: false}) : null
  // }

  openComments(event) {
    const { comments } = this.state
    comments ? this.setState({comments: false}) : this.setState({comments: true})
  }
  
  render() {
    const { post } = this.props;
    console.log(post)
    
    const { expanded } = this.state;
    const { comments } = this.state;
    return (
      <div className="panel panel-default">
        <div className="panel-body" id="Post" onClick={this.handleClick}>
          <p className="score"> {post.score} </p>
          <a href={post.url} target="_blank">{post.title}</a>  
          <p>
            <h5 className="domain">({post.domain})</h5>
            <button onClick={this.openComments} className="btn btn-xs btn-primary" id="commentButton"> Comments </button>
          </p>
          {/*<button onClick={this.handleClick} className="btn btn-xs btn-primary" id="button"> {expanded ? "Minimize-" : "Expand+"}</button>*/}
          {comments ? <CommentList key={post.permalink} permalink={post.permalink}/> : null}
          {expanded ? <p>{post.selftext} <img src={post.url} alt={post.url}/> </p> : null}
        </div>
      </div>  
    )
  }
}

// class Embed extends Component {

//   render () {

//     return (
//       <div className="col-md-6">
//          <p>Hello</p>
//       </div> 
//     )
//   }
// }

class CommentList extends Component {
  constructor () {
    super()
    this.state = {
      isLoading: true,
      error: null,
      comments: []
    };
  }

  componentDidMount() {
    this.fetchCommentsForPost();
  }

  fetchCommentsForPost() {
    this.state = {
      isLoading: true
    }

    fetch('https://www.reddit.com' + this.props.permalink + '.json')
      .then((response) =>
        response.json()
      )
      .then((data) =>
        this.setState({
          isLoading: false,
          error: null,
          comments: data[1].data.children
        })
      )
  }

  render() {

    const { comments, isLoading } = this.state;

    const rootComment = comments.map((val) => {
      console.log(val)  
      return <ul><li>» {val.data.body}</li></ul>;
    })
    if (isLoading) {
      return <p> Loading... </p>
    }

    return ( 

      <div>{rootComment}</div>
    )
  }
}

export default App;