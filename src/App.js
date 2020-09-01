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
      adding: false,
      newBookmarkName: '',
      newBookmarkSubtitle: '',
      newBookmarkURL: '',
    };

    //bind functions
    this.deleteBookmark = this.deleteBookmark.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleInputSubmit = this.handleInputSubmit.bind(this);

    //load saved bookmarks on page load
    this.getBookmarkList();
  }

  componentDidMount() {
    // TODO: set up event listeners
  }

  getBookmarkList(){
    // console.log('starting getBookmarkList...');
    return Promise.resolve(monday.storage.instance.getItem('bookmarks').then(res => {
      // let keys = Object.keys(res.data.value);
      // console.log(keys);
      console.log(res.data.value);
      var returnedValue = JSON.parse(res.data.value);
      if(isEmpty(returnedValue)){
        this.setState({bookmarks: [{}]});
        this.setState({adding: true});
        return;
      } else {
        console.log('getBookmarkCompleting...');
        this.setState({bookmarks: returnedValue});
      }
   }));
  }

  addNewBookmark(){
    this.setState({adding: true});
  }

  editBookmarks(){
     this.setState({editable: true});
  }

  viewBookmarks(){
    this.getBookmarkList().then( res => {
      this.setState({editable: false});
      this.setState({adding: false});
    });
 }

  /**
   * Deletes a single bookmark
   * @param {String} bookmarkID - Bookmark to delete.
   */
  deleteBookmark(key){
    return Promise.resolve(monday.storage.instance.getItem('bookmarks').then(res => {
      let currentBookmarks = [{}];
      currentBookmarks = JSON.parse(res.data.value);

      if(isEmpty(currentBookmarks)){
        // this.setState({bookmarks: [{}]});
        this.getBookmarkList();
        return;
      } else {
        var newBookmarks = currentBookmarks.filter(bookmark => bookmark.key !== key);
        saveBookmarks(newBookmarks).then(res => {
          this.getBookmarkList();
          return;
        });
      }
    }));
  
  }

  handleInputChange(event){
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
  }

  handleInputSubmit(event){
    //Get favicon
    var faviconURL = getFaviconURL(this.state.newBookmarkURL);

    //save bookmark
    var newBookmark = {
      // "key": "2",
      "name": this.state.newBookmarkName,
      "subtitle": this.state.newBookmarkSubtitle,
      "url": this.state.newBookmarkURL,
      "favicon": faviconURL 
    }

    addBookmark(newBookmark).then(res => {
      this.viewBookmarks();
    });

    event.preventDefault();

  }

  render() {
    const bookmarkList = this.state.bookmarks;

    /* 
    //PRACTICE BOOKMARKS
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
    */


    if (this.state.adding) {
      return (
        <div className="App">
          <form onSubmit={this.handleInputSubmit}>
            <input 
              name="newBookmarkName" 
              className="new-bookmark-input" 
              placeholder="New Bookmark Name"
              onChange={this.handleInputChange}></input>
            <input 
              name="newBookmarkSubtitle" 
              className="new-bookmark-input" 
              placeholder="New Bookmark Subtitle"
              onChange={this.handleInputChange}></input>
            <input 
              name="newBookmarkURL" 
              className="new-bookmark-input" 
              placeholder="New Bookmark URL"
              onChange={this.handleInputChange}></input>
            <input className="submitNew" type="submit" value="Save"></input>
          </form>
          <button onClick={() => this.viewBookmarks()}>Cancel</button>
        </div>
      );
    } else {
      return (
        <div className="App">

          {bookmarkList.map((bookmark) =>
          <Bookmark 
            id={bookmark.key}
            url={bookmark.url} 
            name={bookmark.name} 
            favicon={bookmark.favicon} 
            subtitle={bookmark.subtitle}
            deleteBookmark={this.deleteBookmark}
            />
          )}
          
  
          {/* <CreateBookmarkForm /> */}
          {/* <button onClick={() => saveBookmarks(practiceBookmarks)}>Set 2</button> */}
          {/* <button onClick={() => addBookmark(pracAddSingleBookmark)}>Add</button> */}
          {/* <button onClick={() => this.getBookmarkList()}>Refresh</button>  */}
          {/* <button onClick={() => deleteAllBookmarks()}>Clear All</button> */}
          <button className="addNew" onClick={() => this.addNewBookmark()}>+</button>
          {/* <button onClick={() => this.editBookmarks()}>Edit</button> */}
        </div>
      );
    }
  }
}

class Bookmark extends React.Component {

  handleClick = () => {
    window.open(this.props.url, '_blank', 'noopener,noreferrer');
  }

  handleClickDelete(e){
    this.props.deleteBookmark(this.props.id);
  }

  render(){
    return (
    <div className="bookmark-card-component" >
      <div className="bookmark-card-image" onClick={this.handleClick}>
        <div className="bookmark-img">
          <img className="bookmark-photo" src={this.props.favicon} alt="Logo" />
        </div>
      </div>
      <div className="bookmark-remove editable">
          <button className="danger-button" onClick={this.handleClickDelete.bind(this)}>X</button>
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



// ================= Backend ==================
//https://jsdoc.app/tags-param.html <- how to document

/**
 * Saves bookmark(s) to Monday instance.
 * @param {Object} bookmarkList - Bookmarks to save.
 */
function saveBookmarks(bookmarkList){
  return Promise.resolve(monday.storage.instance.setItem('bookmarks', JSON.stringify(bookmarkList)).then(res => {
    // console.log(res);
    console.log('new bookmark saved!');
  }))
}

/**
 * Adds a new bookmark to Monday instance.
 * @param {Object} bookmark - Bookmark to add.
 */
function addBookmark(bookmark){
  var newKey = new Date().getTime().toString() + bookmark.name;

  return monday.storage.instance.getItem('bookmarks').then(res => {
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
      console.log('starting to save new bookmark...');
      return Promise.resolve(saveBookmarks(newBookmark));
    } else {
      var newBookmark = {
        "key": newKey,
        "name": bookmark.name,
        "subtitle": bookmark.subtitle,
        "url": bookmark.url,
        "favicon": bookmark.favicon
      }
      console.log('starting to save new bookmark...');
      currentBookmarks.push(newBookmark);
      return Promise.resolve(saveBookmarks(currentBookmarks));
    }
 });
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


export default App;


