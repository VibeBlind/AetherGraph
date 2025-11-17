export type GraphNodeId = string | number;

export interface GraphNode {
  id: GraphNodeId;
  group?: string | number;
  // arbitrary metadata
  [key: string]: any;
}

export interface GraphLink {
  id?: string | number;
  source: GraphNodeId;
  target: GraphNodeId;
  // arbitrary metadata
  [key: string]: any;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}