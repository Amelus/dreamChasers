import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-mind-map',
  templateUrl: './mind-map.page.html',
  styleUrls: ['./mind-map.page.scss'],
})
export class MindMapPage implements OnInit, AfterViewInit {

  mindMap: any;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
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
