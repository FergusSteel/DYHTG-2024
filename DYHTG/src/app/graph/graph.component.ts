import { Component, OnInit } from '@angular/core';
import { NgxGraphModule } from '@swimlane/ngx-graph';
import { Node, Edge, ClusterNode } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-graph',
  standalone: true,
  imports: [NgxGraphModule],
  templateUrl: './graph.component.html',
  styleUrl: './graph.component.css'
})
export class GraphComponent  {
	public link_array: any;
	public node_array: any;

		constructor() {
		  this.link_array = [{id: 'Hello', source: 'hello', target: '2'}, {id: 'b', source: 'hello', target: '3'}, {id: 'c', source: '3', target: '4'}, {id: 'd', source: '3', target: '5'}, {id: 'e', source: '4', target: '5'}, {id: 'f', source: '2', target: '6'} ];

	    this.node_array = [{id: 'hello', label: 'Node A', image: "https://i.imgflip.com/60tafm.jpg"}, {id: '2', label: 'Node B', image: "https://i.kym-cdn.com/photos/images/facebook/001/790/326/797.jpg"}, {id: '3', label: 'Node C', image: "https://i.kym-cdn.com/photos/images/facebook/001/790/326/797.jpg"}, {id: '4', label: 'Node D', image: "https://i.kym-cdn.com/photos/images/facebook/001/790/326/797.jpg"}, {id: '5', label: 'Node E', image: "https://i.kym-cdn.com/photos/images/facebook/001/790/326/797.jpg"}, {id: '6', label: 'Node F'}];
		}

		getColour(n: any) : string{
			return "#000FFF";
		}

		getImage(n: any): string {
  			if (n.id !== undefined) {
    				for (let index = 0; index < this.node_array.length; index++) {
      					const node = this.node_array[index];
      					if (node.id === n.id && node.image != undefined) {
        					return node.image;
      					}
    				}
  			}
  			return "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Black.png";
		}

		setNodeArray(playlist: any){
			let node_array:any[] = [];
			let p: any;
			for (p in playlist){
				let image: string = "";
				if (p.img !== undefined) {
					image = p.img;
				}
				node_array.push({id: p, label: p, image: undefined});
			}
			this.node_array = node_array;
		}

		intersection(a: string[], b: string[]) : string[]{
			let intersect = new Set<string>();
			for (let elem in a) {
				for (let elt in b){
					if (elt == elem) {
						intersect.add(elt);
					}
				}
			};
			return Array.from(intersect);
		}

		setLinkArray(playlist: any){
			let link_array:any[] = [];

			for(let i = 0; i <= playlist.length-1; i++){
				for(let j = i+1; j <= playlist.length; j++){
					let intersect = this.intersection(playlist[i].tracks.genres, playlist[j].tracks.genres)
					if (intersect.length > 0){
						link_array.push({id: String(i+j), source: playlist[i].name, target: playlist[j].name });
					}
				}
			}
			this.link_array = link_array;
		}
}
