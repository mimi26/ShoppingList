import React, { PropTypes } from 'react';
import axios from 'axios';

export default class ShoppingList extends React.Component {
  static propTypes = {
     // this is passed from the Rails view
  };

  /**
   * @param props - Comes from your rails view.
   * @param _railsContext - Comes from React on Rails
   */
  constructor(props, _railsContext) {
    super(props);

    this.state = {
      listItem: '',
       items: {}
     };
  }

  componentDidMount = () => {
    this.getListData();
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.postListData(this.state.listItem)
  }

  handleInputChange = (event) => {
    this.setState({ listItem: event.target.value });
  };

  postListData = (item) => {
    axios.post('https://shoppinglist-e808d.firebaseio.com/.json', {item})
    .then((response) => {
    this.getListData();
    })
  }

  getListData = () => {
    axios.get('https://shoppinglist-e808d.firebaseio.com/.json')
    .then((response) => {
      console.log(response.data);
      let items = response.data;
      this.setState({ items });
    });
  }

  render() {
    return (
      <div>
        <h3>
         Things To Buy:
        </h3>
        <hr />
        <form
          onSubmit={this.handleSubmit}>
          <label>
            Enter New Shopping List Item:
          </label>
          <input
            type="text"
            value={this.state.listItem}
            onChange={this.handleInputChange}
          />
          <input
            type="submit"
            value="add item"
          />
        </form>
        <ul>
          {Object.keys(this.state.items)
          .map((key) => {return (
            <li key={key}>{this.state.items[key].item}</li>
            )})}
        </ul>
      </div>
    );
  }
}
