import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import { connect } from "ngrok";
// import concurrently from "concurrently";
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
      bookmarks: [{}],
      editable: false,
    };
  }

  componentDidMount() {
    // TODO: set up event listeners
  }

  getBookmarkList(){
    monday.storage.instance.getItem('bookmarks').then(res => {
      // let keys = Object.keys(res.data.value);
      // console.log(keys);
      console.log(res.data.value);
      var returnedValue = JSON.parse(res.data.value);
      if(isEmpty(returnedValue)){
        this.setState({bookmarks: [{}]});
        return;
      } else {
        this.setState({bookmarks: returnedValue});
      }
   });

  }


  editBookmarks(){
     this.setState({editable: true});
  }

  viewBookmarks(){
    this.setState({editable: false});
 }

  render() {
    const bookmarkList = this.state.bookmarks;
    
    var practiceBookmarks = [{
      "key": "1",
      "name": "ESPN",
      "subtitle": "Scores from the last 10 games.",
      "url": "https://espn.com",
      "favicon": "https://espn.com/favicon.ico"
    },{
      "key": "2",
      "name": "Heap",
      "subtitle": "Latest testing data for entire period.",
      "url": "https://heap.io",
      "favicon": "https://heap.io/favicon.ico" 
    }]
    var pracAddSingleBookmark = {
      // "key": "2",
      "name": "Google",
      "subtitle": "Needs some more info, look here",
      "url": "https://google.com",
      "favicon": "https://google.com/favicon.ico" 
    }

    if (this.state.editable){
      return (
      <div className="App">

          {bookmarkList.map((bookmark) =>
          <EditableBookmark key={bookmark.key} id={bookmark.key} url={bookmark.url} name={bookmark.name} favicon={bookmark.favicon} subtitle={bookmark.subtitle}/>
          )}

  
          {/* <CreateBookmarkForm /> */}
          <button onClick={() => addBookmark(pracAddSingleBookmark)}>Add</button>
          <button onClick={() => this.getBookmarkList()}>Refresh</button> 
          <button onClick={() => deleteAllBookmarks()}>Clear All</button>
          <button onClick={() => this.viewBookmarks()}>Finish</button>
          <button onClick={() => getFaviconURL('https://stackoverflow.com/questions/8498592/extract-hostname-name-from-string')}>get favicon url</button>
        </div>
      );

    } else {
      return (
        <div className="App">

          {bookmarkList.map((bookmark) =>
          <Bookmark key={bookmark.key} url={bookmark.url} name={bookmark.name} favicon={bookmark.favicon} subtitle={bookmark.subtitle}/>
          )}
          
  
          {/* <CreateBookmarkForm /> */}
          <button onClick={() => saveBookmarks(practiceBookmarks)}>Set 2</button>
          <button onClick={() => addBookmark(pracAddSingleBookmark)}>Add</button>
          <button onClick={() => this.getBookmarkList()}>Refresh</button> 
          <button onClick={() => deleteAllBookmarks()}>Clear All</button>
          <button onClick={() => this.editBookmarks()}>Edit</button>
        </div>
      );
    }
  }
}

class Bookmark extends React.Component {

  handleClick = () => {
    console.log('Clicked');
    // window.open("https://www.w3schools.com", '_blank', 'noopener,noreferrer');
    window.open(this.props.url, '_blank', 'noopener,noreferrer');
  }

  render(){
    return (
    <div className="bookmark-card-component" >
      <div className="bookmark-card-image" onClick={this.handleClick}>
        <div className="bookmark-img">
          <img className="bookmark-photo" src={this.props.favicon} alt="Logo" />
        </div>
      </div>
      <div className="bookmark-card-container" onClick={this.handleClick}>
        <div className="bookmark-card-inner">
          <div className="bookmark-card-content">
            <div className="bookmark-card-title">{this.props.name}</div>
            <div className="bookmark-card-subtitle">
              <div className="multiline-ellipsis-component">{this.props.subtitle}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

class EditableBookmark extends React.Component {

  constructor(props){
    super(props);
    this.handleClickDelete = this.handleClickDelete.bind(this);
  }

  handleClickDelete(e){
    //Delete bookmark
    console.log('deleting: ' + this.props.id);
    deleteBookmark(this.props.id);
  }

  render(){
    return (
    <div className="bookmark-card-component" >
      <div className="bookmark-remove editable">
          <button className="danger-button" onClick={this.handleClickDelete}>Remove</button>
      </div>
      <div className="bookmark-card-container editable">
        <div className="bookmark-card-inner editable">
          <div className="bookmark-card-content">
            <div className="bookmark-card-title editable-text">
              <div className="bookmark-card-title">{this.props.name}</div>
            </div>
            <div className="bookmark-card-subtitle">
              <div className="multiline-ellipsis-component">{this.props.subtitle}</div>
            </div>
            <div className="bookmark-card-subtitle">
              <div className="multiline-ellipsis-component">{this.props.url}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}

class NewBookmark extends React.Component {

  render(){
    return (
      <div className="bookmark-card-component" >
      {/* <div className="bookmark-card-image">
        <div className="bookmark-img">
          <img className="bookmark-photo" src={this.props.favicon} alt="Logo" />
        </div>
      </div> */}
      <div className="bookmark-card-container">
        <div className="bookmark-card-inner">
          <div className="bookmark-card-content">
            <div className="bookmark-card-title">Name</div>
            <div className="bookmark-card-subtitle">
              <div className="multiline-ellipsis-component">Subtitle</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    )
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
 * Saves bookmark(s) to Monday instance.
 * @param {Object} bookmarkList - Bookmarks to save.
 */
function saveBookmarks(bookmarkList){
  monday.storage.instance.setItem('bookmarks', JSON.stringify(bookmarkList)).then(res => {
    console.log(res);
  })
}

/**
 * Adds a new bookmark to Monday instance.
 * @param {Object} bookmark - Bookmark to add.
 */
function addBookmark(bookmark){
  var newKey = new Date().getTime().toString() + bookmark.name;



  monday.storage.instance.getItem('bookmarks').then(res => {
    // let keys = Object.keys(res.data.value);
    // console.log(keys);
    // console.log(res.data.value);

    let currentBookmarks = [{}];
    currentBookmarks = JSON.parse(res.data.value);
    

    if(isEmpty(currentBookmarks)){
      var newBookmark = [{
        "key": newKey,
        "name": bookmark.name,
        "subtitle": bookmark.subtitle,
        "url": bookmark.url,
        "favicon": bookmark.favicon
      }]
      saveBookmarks(newBookmark);
    } else {
      var newBookmark = {
        "key": newKey,
        "name": bookmark.name,
        "subtitle": bookmark.subtitle,
        "url": bookmark.url,
        "favicon": bookmark.favicon
      }
      currentBookmarks.push(newBookmark);
      saveBookmarks(currentBookmarks);
    }
    // this.setState({bookmarks: newList});
    // return; 
 })
}

/**
 * Deletes all bookmarks created
 *
 */
function deleteAllBookmarks(){
  monday.storage.instance.setItem('bookmarks', '{}').then(res => {
    console.log(res);
  });
}

/**
 * Deletes a single bookmark
 * @param {String} bookmarkID - Bookmark to delete.
 */
function deleteBookmark(key){

  console.log('trying to delete: ' + key);  
  monday.storage.instance.getItem('bookmarks').then(res => {
    let currentBookmarks = [{}];
    currentBookmarks = JSON.parse(res.data.value);

    if(isEmpty(currentBookmarks)){
      // this.setState({bookmarks: [{}]});
      return;
    } else {
      var newBookmarks = currentBookmarks.filter(bookmark => bookmark.key !== key);
      saveBookmarks(newBookmarks);
    }
 });
 
}



/**
 * Checks if an object is empty
 * @param {Object} obj 
 */
function isEmpty(obj){
  return Object.keys(obj).length === 0;
}


/**
 * Get standard favicon.ico url based off any link
 * @param {string} url 
 */
function getFaviconURL(url){
  var favURL;
  var a = document.createElement('a');
  a.href = url;
  favURL = 'https://' + a.hostname + '/favicon.ico';
  console.log(favURL);
  return favURL;
}



/*
**** MOVED THIS FUNCTION INSIDE APP COMPONENT SO IT CAN SAVE TO STATE ****
function getBookmark(){
  monday.storage.instance.getItem('bookmarks').then(res => {
    // let keys = Object.keys(res.data.value);
    // console.log(keys);
    console.log(res.data.value);
    return res.data.value
 })
}
*/

export default App;
