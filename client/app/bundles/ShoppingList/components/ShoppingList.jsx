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
    this.postListData(this.state.listItem);
    this.setState({ listItem: ''})
  }

  handleInputChange = (event) => {
    this.setState({ listItem: event.target.value });
  }

  postListData = (item) => {
    axios.post('https://shoppinglist-e808d.firebaseio.com/.json', {item})
    .then((response) => {
    this.getListData();
    }).catch((error) => {
      console.log(error);
    });
  }

  getListData = () => {
    axios.get('https://shoppinglist-e808d.firebaseio.com/.json')
    .then((response) => {
      let items = response.data;
      this.setState({ items });
    }).catch((error) => {
      console.log(error);
    });
  }

  handleDelete = (itemId) => {
    axios.delete(`https://shoppinglist-e808d.firebaseio.com/${itemId}.json`)
    .then((response) => {
      let items = this.state.items;
      delete items[itemId]
      this.setState({ items });
    }).catch((error) => {
      console.log(error);
    });
  }

  patchListData = (editedItem) => {
    let id = this.state.itemToEdit;
    axios.patch(`https://shoppinglist-e808d.firebaseio.com/${id}.json`, {item: editedItem})
    .then((response) => {
      this.getListData();
      this.setState({
        itemIdToEdit: null,
        itemTextToEdit: ''
      });
    })

  }

  handleEdit = (itemId) => {
    const items = this.state.items;
    this.setState({
      itemIdToEdit: itemId,
      itemTextToEdit: items[itemId].item
    });
  }

  handleEditChange = (event) => {
    this.setState({ itemTextToEdit: event.target.value });
  }

  handleEditSubmit = (event) => {
    event.preventDefault();
    this.patchListData(this.state.itemTextToEdit);
  }

  renderItemorInputField = (key) => {
    if(this.state.itemTextToEdit && this.state.itemIdToEdit === key) {
      return (
        <li key={key}>
          <form
            onSubmit={this.handleEditSubmit}>
            <label>
              Edit Item:
            </label>
            <input
              type="text"
              defaultValue={this.state.items[key].item}
              onChange={this.handleEditChange}
              />
            <input
              type="submit"
              value="update item"
            />
          </form>
        </li>
        )
    } else {
      return (
        <li key={key}>
            <button
              onClick={() => this.handleDelete(key)}>
                Delete
            </button>
            <button
              onClick={() => this.handleEdit(key)}>
                Edit
            </button>
            {this.state.items[key].item}</li>
        )
    }
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
          .map((key) => {return this.renderItemorInputField(key)})}
        </ul>
      </div>
    );
  }
}
