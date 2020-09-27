import React from "react";
import Graph from "react-graph-vis";
import "./network.css";

class GraphVisualisation extends React.Component{

    constructor(props) {
        super(props);
        this.state = {graph: props.graph};
        this.layoutGraph.bind(this);
    }

    layoutGraph(graph) {
        //Determine span lengths of each node
        const graphNodeSpanLengths = graph.nodes
            .map((node) => node.anchors[0])
            .map((span) => span.end - span.from);
        //Determine unique span lengths of all the node spans
        let uniqueSpanLengths = [];
        const map = new Map();
        for (const item of graphNodeSpanLengths) {
            if (!map.has(item)) {
                map.set(item, true); // set any value to Map
                uniqueSpanLengths.push(item);
            }
        }
        uniqueSpanLengths.sort((a, b) => a - b); //sort unique spans ascending

        //Sort the nodes into each level based on their spans
        let nodesInLevels = [];
        for (const level of uniqueSpanLengths) {
            let currentLevel = [];

            for (
                let spanIndex = 0;
                spanIndex < graphNodeSpanLengths.length;
                spanIndex++
            ) {
                if (graphNodeSpanLengths[spanIndex] === level) {
                    currentLevel.push(graph.nodes[spanIndex]);
                }
            }

            nodesInLevels.push(currentLevel);
        }
        //Find the nodes in each level with the same span and group them together
        //Find the unique spans in each level
        let uniqueSpansInLevels = [];
        for (let level of nodesInLevels) {
            let uniqueSpans = []; //Stores the "stringified" objects
            const spanMap = new Map();
            for (const node of level) {
                if (!spanMap.has(JSON.stringify(node.anchors))) {
                    spanMap.set(JSON.stringify(node.anchors), true); // set any value to Map
                    uniqueSpans.push(JSON.stringify(node.anchors));
                }
            }
            uniqueSpansInLevels.push(uniqueSpans);
            //console.log(uniqueSpans);
        }

        //Iterate through the unique spans in each level and group the same ones together
        for (let level = 0; level < nodesInLevels.length; level++) {
            let newLevelOfGroups = [];
            for (let uniqueSpan of uniqueSpansInLevels[level]) {
                //find the nodes in the level that have the same span and group them together
                let nodesWithCurrentSpan = nodesInLevels[level].filter(
                    (node) => JSON.stringify(node.anchors) === uniqueSpan
                );
                newLevelOfGroups.push(nodesWithCurrentSpan);
            }
            nodesInLevels[level] = newLevelOfGroups;
        }

        //Determine the actual number of levels needed
        let height = 0;
        let previousLevelHeights = [0];
        for (let level of nodesInLevels) {
            let maxLevelHeight = 0;
            for (let item of level) {
                maxLevelHeight = Math.max(maxLevelHeight, item.length);
            }
            previousLevelHeights.push(maxLevelHeight);
            height += maxLevelHeight;
        }
        //console.log({height});
        //console.log({nodesInLevels});
        //console.log({previousLevelHeights});

        //Sort the nodes into the final levels
        let nodesInFinalLevels = [];
        for (let index = 0; index < height; index++) {
            nodesInFinalLevels.push([]);
        }
        for (let level = 0; level < nodesInLevels.length; level++) {
            //console.log(nodesInLevels[level]);
            for (let group of nodesInLevels[level]) {
                //console.log({group});
                for (
                    let nodeGroupIndex = 0;
                    nodeGroupIndex < group.length;
                    nodeGroupIndex++
                ) {
                    //console.log(group[nodeGroupIndex]);
                    let finalLevel =
                        previousLevelHeights
                            .slice(0, level + 1)
                            .reduce(
                                (accumulator, currentValue) => accumulator + currentValue
                            ) + nodeGroupIndex;
                    nodesInFinalLevels[finalLevel].push(group[nodeGroupIndex]);
                }
            }
        }
        console.log({ nodesInFinalLevels });

        //Map the nodes in each level to the correct format

        const totalGraphHeight = height * 50 + (height - 1) * 30; //number of levels times the height of each node and the spaces between them

        for (let level = 0; level < nodesInFinalLevels.length; level++) {
            nodesInFinalLevels[level] = nodesInFinalLevels[level].map((node) => ({
                id: node.id,
                x: node.anchors[0].from * 90,
                y: totalGraphHeight - level * (totalGraphHeight / height),
                label: node.label,
                type: "node",
                nodeLevel: level,
                anchors: node.anchors[0]
            }));
        }

        const tokens = graph.tokens.map((token) => ({
            index: token.index,
            x: token.index * 90,
            y: totalGraphHeight + 100,
            label: token.form,
            type: "token"
        }));

        return nodesInFinalLevels.flat().concat(tokens);
    }

    render(){

        const {graph} = this.state; //destructure internal state

        if(graph.nodes !== undefined){

            let graphNodes = this.layoutGraph(graph);

            const finalGraphNodes = graphNodes.map((node) => ({
                id: node.id,
                x: node.x,
                y: node.y,
                label: node.label,
                title: node.label + " tootip text",
                type: node.type,
                anchors: node.anchors,
                fixed: true,
                nodeLevel: node.nodeLevel
            }));

            const finalGraphEdges = graph.edges.map((edge, index) => {
                const fromID =
                    finalGraphNodes[
                        finalGraphNodes.findIndex((node) => node.id === edge.source)
                        ].id;
                const toID =
                    finalGraphNodes[
                        finalGraphNodes.findIndex((node) => node.id === edge.target)
                        ].id;

                let edgeType = "";

                if (fromID === toID) {
                    edgeType = "curvedCW";
                } else {
                    edgeType = "dynamic";
                }

                return {
                    id: index,
                    from: fromID,
                    to: toID,
                    label: edge.label,
                    smooth: { type: edgeType, roundness: 1 }
                };
                /*source: testGraphNodes[edge.source],
              target: testGraphNodes[edge.target],*/
            });

            const finalGraph = {
                nodes: finalGraphNodes,
                edges: finalGraphEdges
            };

            const options = {
                physics: {
                    enabled: true,
                    forceAtlas2Based: {
                        gravitationalConstant: -50000,
                        centralGravity: 0.0,
                        springConstant: 0.08,
                        springLength: 100,
                        damping: 0,
                        avoidOverlap: 1
                    }
                },
                autoResize: true,
                edges: {
                    color: "#000000",
                    //smooth: true
                    smooth: {
                        enabled: true,
                        type: "dynamic",
                        roundness: 1
                    },
                    physics: true
                },
                nodes: {
                    shape: "box",
                    color: "rgba(97,195,238,0.5)",
                    font: { size: 14, strokeWidth: 4, strokeColor: "white" },
                    widthConstraint: {
                        minimum: 60,
                        maximum: 60
                    },
                    heightConstraint: {
                        minimum: 30
                    }
                },
                height: "500px",
                interaction: { hover: true }
            };

            const events = {
                select: function (event) {
                    var { nodes, edges } = event;
                    console.log(nodes, edges);
                }
            };

            return (
                <Graph
                    graph={finalGraph}
                    options={options}
                    events={events}
                    getNetwork={(network) => {
                        //  if you want access to vis.js network api you can set the state in a parent component using this property
                        network.on("beforeDrawing", function (ctx) {
                            for (let node of finalGraphNodes) {
                                if (node.type === "node") {
                                    let nodeId = node.id;
                                    let nodePosition = network.getPositions([nodeId]);
                                    ctx.strokeStyle = "#A6D5F7";
                                    ctx.fillStyle = "#294475";
                                    ctx.lineWidth = 3;

                                    let nodeBoundingBox = network.getBoundingBox(nodeId);
                                    //console.log(nodeBoundingBox);

                                    ctx.beginPath();
                                    ctx.moveTo(
                                        nodePosition[nodeId].x - 40,
                                        nodeBoundingBox.bottom + 5
                                    );
                                    ctx.lineTo(nodePosition[nodeId].x - 40, nodeBoundingBox.bottom);
                                    ctx.lineTo(
                                        nodePosition[nodeId].x +
                                        40 +
                                        60 * (node.anchors.end - node.anchors.from),
                                        nodeBoundingBox.bottom
                                    );
                                    ctx.lineTo(
                                        nodePosition[nodeId].x +
                                        40 +
                                        60 * (node.anchors.end - node.anchors.from),
                                        nodeBoundingBox.bottom + 5
                                    );

                                    ctx.stroke();
                                    //ctx.fill();
                                    //ctx.stroke();
                                }
                            }
                        });
                    }}
                />
            );
        }else{
            return (<div>Graph Not Selected</div>);
        }
    }
}

export default GraphVisualisation;
