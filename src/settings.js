import React from 'react';
import ReactDOM from 'react-dom';

class Settings extends React.Component {

    constructor(props) {
        super(props);
        this.deptDropboxPath = {value: '/sports-cepr/'};
        this.deptName = "Sports";
        //this.handleChange = this.handleChange.bind(this);
        //this.handleSubmit = this.handleSubmit.bind(this);
    }


divStyle = {
    color: 'black',
    border: '1px solid',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    textAlign: 'left',
  };
  
  divContainer = {
    textAlign : 'center',
    display: 'block', 
    width : '50pc',
    marginTop : '25px',
    marginLeft: '25pc',
    border: '1px solid',
    paddingTop: 10,
    paddingBottom: 10,
    height: 'auto',
  };

    render() {
        return (
        <div>
            <div style={this.divContainer}>
                <h2>Global Settings</h2>
                <div style={{margin:"10px",padding:"10px"}}>
                    <label style={{margin:"10px;",textAlign:'right'}}> 
                        Department name
                        <input type="text" value={this.deptName.value}></input>
                    </label>
                </div>
                <div>
                    <label> 
                        Department root path
                        <input type="text" value={this.deptDropboxPath.value}></input>
                    </label>
                </div>
                </div>


                <div style={this.divContainer}>
                <h2>User Settings</h2>
                <div style={{margin:"10px;"}}>
                    <label style={{margin:"10px;"}}> 
                        Dropbox folder name
                        <input type="text" value={this.deptName.value}></input>
                    </label>
                </div>
                </div>
            </div>
            );
    }
  }

export default Settings;
