import React, { Component } from "react";
import ChangeMeContract from "./contracts/ChangeMe.json";
import getWeb3 from "./getWeb3";
import { LinkPreview } from '@dhaiwat10/react-link-preview';

import "./App.css";

class App extends Component {
    state = { web3: null, accounts: null, contract: null, url: '', price: 0, newUrl: '', newPrice: 0 };

    componentDidMount = async() => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = ChangeMeContract.networks[networkId];
            const instance = new web3.eth.Contract(
                ChangeMeContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance }, this.init);
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    init = async() => {
        const { contract } = this.state;
        const { link, amount } = await contract.methods.get().call();
        this.setState({ url: link, price: amount });
    };

    _handleUrlChange = (event) => {
        const { value } = event.target

        this.setState({
            newUrl: value
        })
    }

    _handlePriceChange = (event) => {
      const { value } = event.target

      this.setState({
          newPrice: value
      })
    }

    _changeUrl = async() => {
      const { accounts, contract, newUrl, newPrice } = this.state;
      await contract.methods.set(newUrl, newPrice).send({ from: accounts[0] });
      await this.init()
    }

    render() {
        if (!this.state.web3) {
            return <div> Loading Web3, accounts, and contract... </div>;
        }
        return ( <div className="App">
                <div className="change">
                  <input placeholder={this.state.url} type="text" value={ this.state.newUrl } onChange={this._handleUrlChange} />
                  <input placeholder={this.state.price} type="text" value={ this.state.newPrice } onChange={this._handlePriceChange} />
                  <button type="submit" onClick={ this._changeUrl }>Change Me</button>
                </div>
                <LinkPreview url={ this.state.url }  width='400px' />
            </div>
        );
    }
}

export default App;