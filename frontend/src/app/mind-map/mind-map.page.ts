import {AfterViewInit, Component, Injectable, OnInit, ViewChild} from '@angular/core';
import {Tree, TreeModule} from 'primeng/tree';
import {TreeNode} from 'primeng/api';
// @ts-ignore
import json_files from './files.json';
// import {MessageService} from 'primeng/api';



@Component({
  selector: 'app-mind-map',
  templateUrl: './mind-map.page.html',
  styleUrls: ['./mind-map.page.scss'],
})
export class MindMapPage implements OnInit, AfterViewInit {

  mindMap: any;
  files: TreeNode[];
  selectedFile: TreeNode;
  @ViewChild('expandingTree', { static: false }) expandingTree: Tree;

  ngOnInit() {
    this.files = json_files.data;
    /*const f = [
      'folderA/file1.txt',
      'folderA/file1.txt',
      'folderA/folderB/file1.txt',
      'folderA/folderB/file2.txt',
      'folderC/file1.txt'
    ];

    this.files = f.reduce(this.reducePath, []);*/
  }

  /* nodeSelect(event) {
    this.messageService.add({severity: 'info', summary: 'Node Selected', detail: event.node.label});
  }

  nodeUnselect(event) {
    this.messageService.add({severity: 'info', summary: 'Node Unselected', detail: event.node.label});
  }

  nodeExpandMessage(event) {
    this.messageService.add({severity: 'info', summary: 'Node Expanded', detail: event.node.label});
  } */

  /*nodeExpand(event) {
    if (event.node) {
      // in a real application, make a call to a remote url to load children of the current node and add the new nodes as children
      this.nodeService.getLazyFiles().then(nodes => event.node.children = nodes);
    }
  }*/

  constructor() {
  }






  reducePath = (nodes: TreeNode[], path: string) => {
    const split = path.split('/');

    // 2.1
    if (split.length === 1) {
      console.log('AAAAAAAA');
      return [
        ...nodes,
        {
          label: split[0],
          icon: 'fa-file-o'
        }
      ];
    }

    // 2.2
    if (nodes.findIndex(n => n.label === split[0]) === -1) {
      console.log('BBBBBBBB');
      return [
        ...nodes,
        {
          label: split[0],
          icon: 'fa-folder',
          children: this.reducePath([], split.slice(1).join('/'))
        }
      ];
    }

    // 2.3
    console.log('CCCCCCCC');
    return nodes.map(n => {
      if (n.label !== split[0]) {
        return n;
      }

      return Object.assign({}, n, {
        children: this.reducePath(n.children, split.slice(1).join('/'))
      });
    });
  }


  ngAfterViewInit(): void {
    // this.expandingTree.isNodeLeaf();
  }

  removeNode() {
    const selectedNode = this.mindMap.getSelectedNode();
    const selectedId = selectedNode && selectedNode.id;

    if (!selectedId) {
      return;
    }
    this.mindMap.removeNode(selectedId);
  }

  addNode() {
    const selectedNode = this.mindMap.getSelectedNode();
    if (!selectedNode) {
      return;
    }

    const nodeId = 'stuff';
    this.mindMap.addNode(selectedNode, nodeId);
  }

  getMindMapData() {
    const data = this.mindMap.getData().data;
    console.log('data: ', data);
  }
}
