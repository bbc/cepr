import React from 'react';
import ReactDOM from 'react-dom';
import Container from './ui-container';

class  CreateProject extends React.Component {

    constructor(){
        super();
        this.state = {render:'',renderProject : false}
    }

    handleClick (e,a) {
        console.log('this is create project');
        console.log(e);

        this.setState({render:'create-project-ui',currentWorkspace: e});        
    }


    handleProjectClick (e) {
        console.log('this is create project');
        console.log(e);

        if (this.state.renderProject)
        this.setState({renderProject:false});        
        else
        this.setState({renderProject:true,currentWorkspace: e});        
    }

    wsList = [];

   
    divStyle = {
        color: 'black',
        border: '1px solid',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    };

    divContainer = {
        display: 'block', 
        width : '50pc',
        marginTop : '25px',
        marginLeft: '25pc',
    };
    
    main = { 
        width: '800px',
        margin: '0 auto'
    }
    
    sidebar =   {
        width: '200px',
        float: 'left',
        align:'top',
        marginTop : '5px',
    }
    
    
    pagewrap = {
        width: '400px',
        marginLeft: '195px',
        marginTop : '15px',
    }

    render() {
        var action = "project";
        this.wsList =  JSON.parse(localStorage.getItem("workspace"));
       // console.log(this.wsList.length);
        console.log("in projects page");
        console.log(this.wsList);
         
        const totalWorkSpaces = this.wsList == null ? 0 : this.wsList.length;





        const listItems = this.wsList.map((ws) =>
        <div style={this.divStyle}>
            <div style={this.main}>
                <div style={this.sidebar}><h2>{ws.workspaceName} </h2></div><div style={this.pagewrap}>created by Sports User on 22nd July, 2019</div> 
            </div>    
            <div>
                <div style={{margin:"10px"}}>
                <b>Root Path:</b> {ws.workspacePath} &nbsp;&nbsp;&nbsp; 
                <b> Production Team:</b>  {ws.productionTeam} &nbsp;&nbsp;&nbsp; 
                </div>
            </div>


            <div>
            <b> <a href="#" onClick={this.handleProjectClick.bind(this,ws.workspaceName)}>{ ws.projects ? ws.projects.length : 0} Projects </a> </b> &nbsp;&nbsp;&nbsp;

                <a href="#" onClick={this.handleClick.bind(this,ws.workspaceName)}>Create new project</a> &nbsp;&nbsp;&nbsp; 
                <a href="#" onClick={this.handleClick.bind(this,'create-project-ui')}>Add new member</a> 
            </div>

            <div style={{margin:"10px",marginLeft: "200px",width:'auto'}}>     
                    { 
                        ws.projects ?  
                        ws.projects.map((project)  =>  
                        
                        this.state.renderProject && this.state.currentWorkspace == ws.workspaceName ?

                        <div style={this.divStyle}>{project.projectName}</div> : <div></div>
                        )
                        : <div>&nbsp;</div>
                     }
            </div>    


            <div style={{margin:"10px",width:'auto',border:'1 solid'}}>
            { this.state.render != '' && this.state.currentWorkspace == ws.workspaceName ?  <Container state={this.state.render} wsname={ws.workspaceName} /> : null }
            </div>        
        </div> 
        );

        return (
           <div style={this.divContainer} className="projects-form">
                <div><h2>Workspaces</h2></div>
                <div style={this.divStyle}><b> {totalWorkSpaces} workspaces</b></div> 
                {listItems}


            </div>

        );
    }

}


export default CreateProject;
