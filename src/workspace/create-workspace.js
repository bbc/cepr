import React from 'react';
import ReactDOM from 'react-dom';


class Workspace extends React.Component {

constructor(props) {
  super(props);
  this.state = {workspaceName: '',productionTeam: '',folderTemplate : ''};

  this.handleSubmit = this.handleSubmit.bind(this);
  this.handleInputChange = this.handleInputChange.bind(this);

}

handleSubmit(event) {
  alert('A name was submitted: ' + this.state);
  console.log(this.state);
  
  console.log('Creating workspace with the following values....');
  console.log('Workspace Name: '+ this.state.workspaceName);
  console.log('Production Team: '+ this.state.productionTeam);
  console.log('Folder Template: '+ this.state.folderTemplate);

  this.createWorkspace(this.state.workspaceName,this.state.productionTeam);
  event.preventDefault();
}

handleInputChange(event) {
  const target = event.target;
  const value = target.type === 'checkbox' ? target.checked : target.value;
  const name = target.name;

  this.setState({
    [name]: value
  });
}

  wsList = [];
 createWorkspace(workspaceName,productionTeam){

  // Default root path, we should get this value from root path field Settings screen
  var rootpath = "/cepr-test/";
  // Step 1. Create folder for workspace in dropbox under departmnet root path
  
  
  // 1-a. Connect to dropbox
  var fetch = require('isomorphic-fetch'); // or another library of choice.
  var Dropbox = require('dropbox').Dropbox;
  var DropboxTeam = require('dropbox').DropboxTeam;
  

  //TMFA -5_UThBHfIAAAAAAAAAQC8xRlJfmu6jPJg7_PqVMMn5SygZX7iZXUE-fRW4mvxXm
  //TFA -5_UThBHfIAAAAAAAAAQmCyqAmHg1v7frJRrOnYAiKgiTpZ3rraUCvT6QCQsn6D1
  //user i96Zcu_8aOAAAAAAAAAAJXFBuXccLVUszGQ5bPET8U4zu283iUBX5Bgs2M9Aj5vm

  var dbx = new Dropbox({ accessToken: '-5_UThBHfIAAAAAAAAAQmCyqAmHg1v7frJRrOnYAiKgiTpZ3rraUCvT6QCQsn6D1', fetch: fetch,selectUser : 'dbmid:AADBTXkkDrFALtA9p24GVHVoIBg46kiEZEQ' });
  // dbx.filesListFolder({path: ''})
  //   .then(function(response) {
  //     console.log(response);
  //   })
  //   .catch(function(error) {
  //     console.log(error);
  //   });

  // 1-b. Create workspace folder under the dept rootpath
  var workspacePath = rootpath + workspaceName;
  dbx.filesCreateFolder({ path: workspacePath })
  .then(function(response) {
    console.log("Workspace created successfully with name : " + workspaceName);
    console.log(response);

        // Step 2. Create folder structure from template 
        // Here we will just create hard coded folders for now. IMP this need to be replaced with complete template based solution as part of POC
        // Folder structure to be created:
        
        // [workspace name]
        //            |------ Media
        //            |------ Projects
        //            |------ Misc
        //                      |---------Clips              

        dbx.filesCreateFolderBatch({paths: [workspacePath + "/Media",workspacePath + "/Projects",workspacePath + "/Misc", workspacePath + "/Clips"]})
        .then(function(response) {
          console.log("Project folder created successfully...");
          console.log(response);

         
        })
        .catch(function(error) {
          console.log(error);
        });
        })

  .catch(function(error) {
    console.log(error);
  });  

  // Step 3. Create a record that links workspace, production team, dept.  

  this.wsList = JSON.parse(localStorage.getItem("workspace") || "[]");
  
  console.log("before adding to local storage");
  console.log(this.wsList);  
 
  var ws = new Workspace();
  ws.workspaceName = workspaceName;
  ws.workspacePath = workspacePath;
  ws.productionTeam = productionTeam;
  //ws.workspaceName = "as";
  //ws.workspacePath = "as";

  this.wsList.push(ws);

  localStorage.setItem("workspace",JSON.stringify(this.wsList));


    // var dbxTeam = new DropboxTeam({ accessToken: '-5_UThBHfIAAAAAAAAAQC8xRlJfmu6jPJg7_PqVMMn5SygZX7iZXUE-fRW4mvxXm', fetch: fetch});
    // dbxTeam.teamMembersList()
    //   .then(function(response) {
    //     console.log(response);
    //   })
    //   .catch(function(error) {
    //     console.log(error);
    //   });
  
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
  height: "400px",

};


render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <div style={this.divContainer}>
        <div>
          <h2>Create Workspace</h2>
        </div>
        <div>
          <label style={{margin : 10}}>
             Workspace name 
            <input type="text" value={this.state.workspaceName} name="workspaceName" onChange={this.handleInputChange}  />
          </label>
        </div>
        <div style={{ margin : 10 }}>
          <label>
               Production team
              <select value={this.state.productionTeam} name="productionTeam" onChange={this.handleInputChange} >
                <option value="shortform">Shortform</option>
                <option value="sports-news">Sports News</option>
                <option value="worldcupteam">World Cup Team </option>
                <option value="wimbledon">Wimbledon team</option>
              </select>
          </label>  
        </div>
        <div style={{ margin : 10 }}>
        <label>
              Folder template 
            <select value={this.state.folderTemplate} name="folderTemplate" onChange={this.handleInputChange} >
              <option value="template1">Sports Template 1</option>
              <option value="template2">Sports Template 2</option>
              <option value="template3">Sports Template 3</option>
            </select>
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
      </div>
    </form>
  );
}
}
export default Workspace;
