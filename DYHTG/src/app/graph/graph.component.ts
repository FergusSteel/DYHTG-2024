import { Component } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [NgxGraphModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphComponent {
	  public link_array: any;
	  public node_array: any;

		constructor() {
		  this.link_array = [{id: 'a', source: '1', target: '2'}, {id: 'b', source: '1', target: '3'}, {id: 'c', source: '3', target: '4'}, {id: 'd', source: '3', target: '5'}, {id: 'e', source: '4', target: '5'}, {id: 'f', source: '2', target: '6'}
  ]
	    this.node_array = [{id: '1', label: 'Node A'}, {id: '2', label: 'Node B'}, {id: '3', label: 'Node C'}, {id: '4', label: 'Node D'}, {id: '5', label: 'Node E'}, {id: '6', label: 'Node F'}];
		}

		getColour(n: any) : string{
			console.log(n.id);
			return "#000FFF";
		}

		getImage(n: any) : string{
			return "https://i.kym-cdn.com/photos/images/facebook/001/790/326/797.jpg";
		}



}
