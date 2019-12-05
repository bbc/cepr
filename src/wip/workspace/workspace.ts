import ProjectObject from "./project";

class WorkspaceObject {
    workspaceName : string = "";
    workspacePath : string = "";
    productionTeam : string = "Unassigned";
    projects : ProjectObject[] = [];
}