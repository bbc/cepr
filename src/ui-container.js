import React from 'react';
import ReactDOM from 'react-dom';
import CreateProject from './create-project';
import Workspace from './workspace/create-workspace';
import Settings from './settings';
import CreateProjectUI from './create-project-ui';
import ProjectTemplateListing from './view-project-template';
import SearchProject from './search-project';

function Container(props) {

    console.log(props.action);
    console.log(props.state);
    console.log(props.wsname);

    if (props.state=='project')
    return <CreateProject/>;
    else if (props.state=='workspace') return <Workspace/>;
    else if (props.state=='settings')  return <Settings/>;
    else if (props.state=='create-project-ui')  return <CreateProjectUI wsname={props.wsname}/>;
    else if (props.state=='view-project-template')  return <ProjectTemplateListing/>;
    else if (props.state=='search-project')  return <SearchProject/>;

    else return <h1>{props.state}</h1>;
  }

export default Container;
