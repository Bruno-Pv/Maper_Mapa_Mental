import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const generateNodesAndEdges = (treeData) => {
  let nodes = [];
  let edges = [];
  let idCounter = 0;

 
  const radiusStep = 400; 
  const angleStep = Math.PI / 3; 

  const traverse = (node, depth = 0, angle = 0, parentId = null, parentX = 0, parentY = 0) => {
    if (!node || typeof node.name !== "string") return;

    const id = `node-${idCounter++}`;
    const radius = depth * radiusStep;

    const x = parentX + Math.cos(angle) * radius;
    const y = parentY + Math.sin(angle) * radius;

    nodes.push({
      id,
      data: { label: node.name },
      position: { x, y },
      style: {
        padding: 10,
        borderRadius: 10,
        border: "2px solid #333",
        background: "#0F52BA",
        color: "#fff",
        width: 180,
        textAlign: "center",
      },
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "smoothstep",
        animated: true,
        style: { stroke: "#888" },
      });
    }

    if (node.children && node.children.length > 0) {
      const count = node.children.length;
      const startAngle = angle - ((count - 1) / 2) * angleStep;
      node.children.forEach((child, i) => {
        traverse(child, depth + 1, startAngle + i * angleStep, id, x, y);
      });
    }
  };

  traverse(treeData, 0, -Math.PI / 2); 

  return { nodes, edges };
};


function ReactFlowMindMap({ language }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    const onConnect = (params) => console.log('Conexão feita:', params);

    const nodeTypes = {};

  const fetchMindMap = useCallback(async () => {
    if (!language) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/mindmap/${language}`);
      if (!response.ok) throw new Error("Erro ao buscar dados da API");
      const data = await response.json();

      const { nodes, edges } = generateNodesAndEdges(data);
      setNodes(nodes);
      setEdges(edges);
      setError(null);
    } catch (e) {
      setError(e.message);
      setNodes([]);
      setEdges([]);
    } finally {
      setLoading(false);
    }
  }, [language, setNodes, setEdges]);

  useEffect(() => {
    fetchMindMap();
  }, [fetchMindMap]);

  if (loading) return <p>Carregando mapa mental de {language}...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (nodes.length === 0) return <p>Mapa mental vazio</p>;

  return (
    <div style={{ width: "100%", height: "90vh" }}>
      <h2 style={{ textAlign: "center" }}>Mapa Mental de {language} (React Flow)</h2>
      <ReactFlow
       nodes={nodes}
       edges={edges}
       fitView
       panOnScroll
       zoomOnScroll
       zoomOnPinch
       zoomOnDoubleClick
       panOnDrag
       minZoom={0.1}
       maxZoom={2}
       onConnect={onConnect}
       onInit={setReactFlowInstance}
       nodeTypes={nodeTypes}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

export default MindMap;
