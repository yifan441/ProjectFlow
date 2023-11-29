// treeStructure.js
class TreeNode {
    constructor(name) {
      this.name = name;
      this.children = [];
    }
  }
  
  class Tree {
    constructor() {
      this.root = null;
    }
  
    addProject(projectName) {
      const newProject = new TreeNode(projectName);
      if (!this.root) {
        this.root = newProject;
      } else {
        this.root.children.push(newProject);
      }
      return newProject;
    }
  
    addTask(projectNode, taskName) {
      const newTask = new TreeNode(taskName);
      projectNode.children.push(newTask);
      return newTask;
    }
  
    addSubtask(taskNode, subtaskName) {
      const newSubtask = new TreeNode(subtaskName);
      taskNode.children.push(newSubtask);
      return newSubtask;
    }
  }
  
  module.exports = { Tree, TreeNode };  
