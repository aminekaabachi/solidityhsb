import React, { Component } from "react";
import ChangeMeContract from "./contracts/ChangeMe.json";
import getWeb3 from "./getWeb3";
import { LinkPreview } from "@dhaiwat10/react-link-preview";
import FilledInput from "@mui/material/FilledInput";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import * as Icon from "react-cryptocoins";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';

import { Typography } from '@mui/material';

import "./App.css";

class App extends Component {
  state = {
    //web3 components
    web3: null,
    accounts: null,
    contract: null,
    //history
    history: [],
    //current update
    url: "",
    price: 0,
    owner: null,
    gasprice: 0,
    //new update
    newUrl: "",
    newPrice: 0,
  };

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = ChangeMeContract.networks[networkId];
      const instance = new web3.eth.Contract(
        ChangeMeContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({ web3, accounts, contract: instance }, this.init);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  init = async () => {
    const { web3, contract } = this.state;

    //Getting the current update

    const { url, price, owner, gasprice } = await contract.methods.getCurrent().call();
    const history = await contract.methods.getHistory().call();

    this.setState({
      history,
      url,
      price: price ? web3.utils.fromWei(price, "ether") : 0,
      owner,
      gasprice: gasprice ? web3.utils.fromWei(gasprice, "ether") : 0,
    });
  };

  _handleUrlChange = (event) => {
    const { value } = event.target;

    this.setState({
      newUrl: value,
    });
  };

  _handlePriceChange = (event) => {
    const { value } = event.target;

    this.setState({
      newPrice: value,
    });
  };

  _changeUrl = async () => {
    const { web3, accounts, contract, newUrl, newPrice } = this.state;
    await contract.methods
      .set(newUrl)
      .send({ from: accounts[0], value: web3.utils.toWei(newPrice.toString(), "ether") });
    await this.init();
  };

  render() {
    if (!this.state.web3) {
      return <div> Loading Web3, accounts, and contract... </div>;
    }
    return (
      <div className="App">

      <Typography variant="h1" component="h2">
        TheCryptoLink
      </Typography>

        <div className="change">
          <FormControl
            size="small"
            variant="filled"
            sx={{ m: 1, width: "25ch" }}
          >
            <InputLabel>URL</InputLabel>
            <FilledInput
              placeholder={this.state.url}
              value={this.state.newUrl}
              onChange={this._handleUrlChange}
            />
          </FormControl>
          <FormControl
            size="small"
            variant="filled"
            sx={{ m: 1, width: "15ch" }}
          >
            <InputLabel>PRICE</InputLabel>
            <FilledInput
              endAdornment={
                <InputAdornment position="start">
                  <Icon.EthAlt size={18} />
                </InputAdornment>
              }
              placeholder={this.state.price}
              value={this.state.newPrice}
              onChange={this._handlePriceChange}
            />
          </FormControl>
          <Button
            size="large"
            variant="contained"
            onClick={this._changeUrl}
            sx={{ m: 1, mt: 1.5 }}
            color="success"
          >
            Update
          </Button>
        </div>
        <Divider />

        {/* <Stack direction="row" spacing={1} sx={{ m: 5 }}>
          <Chip
            label={"PRICE: " + this.state.price + ""}
            icon={<Icon.EthAlt size={18} />}
          />
          <Chip label={"OWNER: " + this.state.owner} />
          <Chip
            label={"GAS: " + this.state.gasprice + ""}
            icon={<Icon.EthAlt size={18} />}
          />
        </Stack>
        <Divider /> */}

        <LinkPreview url={this.state.url} width="400px" />
        <Divider />

        <div>
        <TableContainer component={Paper} sx={{ m: 5 }} >
      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Buyer</TableCell>
            <TableCell align="right">URL</TableCell>
            <TableCell align="right">Price&nbsp;<Icon.EthAlt size={18} /></TableCell>
            <TableCell align="right">Gasprice&nbsp;<Icon.EthAlt size={18} /></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.history.reverse().map((row, i) => (
            <TableRow
              key={i}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.owner}
              </TableCell>
              <TableCell align="right">{row.url}</TableCell>
              <TableCell align="right">{ this.state.web3.utils.fromWei(row.price, "ether") }</TableCell>
              <TableCell align="right">{ this.state.web3.utils.fromWei(row.gasprice, "ether") }</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
        </div>
      </div>
    );
  }
}

export default App;
