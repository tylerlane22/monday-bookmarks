import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
// import concurrently from "concurrently";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
    };
  }

  componentDidMount() {
    // TODO: set up event listeners
  }

  render() {
    var practiceBookmark = {
      "name": "Heap",
      "url": "https://heap.io"
    }
    return (
      <div className="App">
        <Bookmark />
        {/* <CreateBookmarkForm /> */}
        <button onClick={() => saveBookmark(practiceBookmark)}>Save bookmark</button>
        <button onClick={() => getBookmark()}>Get bookmark</button>
      </div>
    );
  }
}

class Bookmark extends React.Component {

  render(){
    return (
    <div className="bookmark">
      <img src="https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_e6baf1b33e53120e6109fb1c1c71c3f3/heap.png" alt="Logo" />
      <h2>BM Title</h2>
      <a href="https://www.w3schools.com" target="_blank" rel="noopener noreferrer">
          Go to link
        </a>
    </div>
    );
  }
}

/*
class CreateBookmarkForm extends React.Component {
  //Learned here: https://reactjs.org/docs/forms.html#controlled-components
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      bookmarkName: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    console.log(event);
    this.setState({
      [url]: event.target.url,
      [bookmarkName]: event.target.bookmarkName
    });
  }

  handleSubmit(event) {
    console.log('Submitted URL: ' + this.state.url);
    console.log('Submitted Name: ' + this.state.bookmarkName);
    console.log(this.state);
    event.preventDefault();
  }

  render(){
    return(
      <form onSubmit={this.handleSubmit}>
        <label>
          URL
          <input
            name="url"
            type="text"
            value={this.state.url}
            onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Name:
          <input
            name="bookmarkName"
            type="text"
            value={this.state.bookmarkName}
            onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
*/

// ================= Backend ==================
//https://jsdoc.app/tags-param.html <- how to document

/**
 * Saves a new bookmark and adds to Monday instance.
 * @param {Object} bookmark - Bookmark to save.
 */
function saveBookmark(bookmark){
  monday.storage.instance.setItem('bookmarks', JSON.stringify(bookmark)).then(res => {
    console.log(res);
  })
}

function getBookmark(){
  monday.storage.instance.getItem('bookmarks').then(res => {
    // let keys = Object.keys(res.data.value);
    // console.log(keys);
    console.log(res.data.value);
 })
}

export default App;
