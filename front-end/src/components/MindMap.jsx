import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";
import Tooltip from './Tooltip';

const generateNodesAndEdges = (treeData) => {
  const nodes = [];
  const edges = [];
  let idCounter = 0;

  const centerX = 0;
  const centerY = 0;

  const distanceLevels = [1000, 1150, 1300, 1450, 1600, 1750, 1850];
  const subRadius1 = 700;
  const subRadius2 = 1000;
  const jitterAmount = 60;

  const colorPalette = [
    "#00b894", "#0984e3", "#6c5ce7", "#e17055",
    "#d63031", "#fdcb6e", "#00cec9", "#e84393",
    "#2d3436", "#fab1a0", "#74b9ff", "#55efc4"
  ];

  const getPastelColor = (hexColor) => {
    const num = parseInt(hexColor.replace("#", ""), 16);
    const r = Math.min(255, (num >> 16) + 100);
    const g = Math.min(255, ((num >> 8) & 0x00FF) + 100);
    const b = Math.min(255, (num & 0x0000FF) + 100);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rootId = `node-${idCounter++}`;

  // Controle centralizado de tamanho
  const rootSize = { width: 320, height: 160, fontSize: "3.4rem"};
  const topicSize = { width: 260, height: 120, fontSize: "2.5rem" };
  const subtopicSize = { width: 240, height: 100, fontSize: "1.7rem" };

  // Nó central
  nodes.push({
    id: rootId,
    data: { label: treeData.name },
    position: { x: centerX, y: centerY },
    style: {
      background: "#40807B",
      color: "#fff",
      fontWeight: "bold",
      borderRadius: "12px",
      width: rootSize.width,
      height: rootSize.height,
      fontSize: rootSize.fontSize,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      boxShadow: "0px 4px 12px rgba(0,0,0,0.2)"
    }
  });

  const mainTopics = treeData.children || [];
  const angleStep = (2 * Math.PI) / mainTopics.length;

  mainTopics.forEach((mainTopic, index) => {
    const angle = index * angleStep;
    const distance = distanceLevels[index % distanceLevels.length];

    const mainX = centerX + distance * Math.cos(angle);
    const mainY = centerY + distance * Math.sin(angle);
    const mainId = `node-${idCounter++}`;

    const mainColor = colorPalette[index % colorPalette.length];
    const subColor = getPastelColor(mainColor);

    nodes.push({
      id: mainId,
      data: { label: mainTopic.name },
      position: { x: mainX, y: mainY },
      style: {
        background: mainColor,
        color: "#fff",
        fontWeight: "bold",
        borderRadius: "10px",
        width: topicSize.width,
        height: topicSize.height,
        fontSize: topicSize.fontSize,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxShadow: "0px 3px 8px rgba(0,0,0,0.15)"
      }
    });

    edges.push({
      id: `edge-${rootId}-${mainId}`,
      source: rootId,
      target: mainId,
      type: "smoothstep",
      style: { stroke: mainColor, strokeWidth: 2 }
    });

    const subTopics = mainTopic.children || [];
    const middleIndex = Math.ceil(subTopics.length / 2);

    const firstLayer = subTopics.slice(0, middleIndex);
    const secondLayer = subTopics.slice(middleIndex);

    const layerConfigs = [
      { layer: firstLayer, radius: subRadius1, angleSpan: (100 * Math.PI) / 180 },
      { layer: secondLayer, radius: subRadius2, angleSpan: (130 * Math.PI) / 180 }
    ];

    layerConfigs.forEach(({ layer, radius, angleSpan }) => {
      const layerStep = angleSpan / (layer.length + 1);
      layer.forEach((subTopic, subIndex) => {
        const subAngle = angle - (angleSpan / 2) + (subIndex + 1) * layerStep;
        const jitterX = (Math.random() - 0.5) * jitterAmount;
        const jitterY = (Math.random() - 0.5) * jitterAmount;
        const subX = mainX + radius * Math.cos(subAngle) + jitterX;
        const subY = mainY + radius * Math.sin(subAngle) + jitterY;
        const subId = `node-${idCounter++}`;

        nodes.push({
          id: subId,
          data: {
            label: subTopic.descricao ? (
              <Tooltip text={subTopic.descricao}>
                <strong>{subTopic.name}</strong>
              </Tooltip>
            ) : (
              <strong>{subTopic.name}</strong>
            )
          },
          position: { x: subX, y: subY },
          style: {
            background: subColor,
            color: "#000",
            border: `1px solid ${mainColor}`,
            borderRadius: "10px",
            width: subtopicSize.width,
            height: subtopicSize.height,
            fontSize: subtopicSize.fontSize,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            boxShadow: "0px 2px 6px rgba(0,0,0,0.1)"
          }
        });

        edges.push({
          id: `edge-${mainId}-${subId}`,
          source: mainId,
          target: subId,
          type: "smoothstep",
          style: { stroke: mainColor, strokeWidth: 1.5 }
        });
      });
    });

  });

  return { nodes, edges };
};


function MindMap({ language }) {
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
      <h2 style={{ textAlign: "center" }}>Mapa Mental: {language}</h2>
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
