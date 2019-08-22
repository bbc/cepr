import React from 'react';
import ReactDOM from 'react-dom';

class ProjectTemplateListing extends React.Component {

    constructor(props) {
        super(props);
        this.deptDropboxPath = {value: '/sports-cepr/'};

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
    };

    

    render() {

            var templateList = JSON.parse(localStorage.getItem("projectTemplateList"));                    
            var listItems = templateList.map((template) =>
            <div style={this.divStyle}><b>Name:</b> {template.name}</div> 
            );

            return (
                <div style={this.divContainer} className="projects-form">
                    <div>
                        <h2>Project Templates</h2>
                    </div>
                     <div style={this.divStyle}><b>Project Templates</b>  
</div> 
                     {listItems}      
                 </div>
     
             );

              }
}

     

  
export default ProjectTemplateListing;
