import React, { PropTypes } from 'react';

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

    this.state = { listItem: '' };
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  handleInputChange = (event) => {
    this.setState({ listItem: event.target.value });
  };



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
      </div>
    );
  }
}
