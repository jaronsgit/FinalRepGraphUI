import React, {useState, useEffect} from "react";
import Graph from "react-graph-vis";
import "./network.css";

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
        font: {size: 14, strokeWidth: 4, strokeColor: "white"},
        widthConstraint: {
            minimum: 60,
            maximum: 60
        },
        heightConstraint: {
            minimum: 30
        }
    },
    height: "500px",
    interaction: {hover: true}
};

const events = {
    select: function (event) {
        let {nodes, edges} = event;
        console.log(nodes, edges);
    }
};

const NewGraphVisualisation = ({width, height, graphData: data, ...rest}) => {
    const [graphData, setGraphData] = useState(data);

    useEffect(() => {
        setGraphData(data);
    }, [data]);

    const sentenceSelected = graphData.nodes !== undefined;

    return (
        sentenceSelected ? <div>Select a sentence</div> : <Graph
            graph={graphData}
            options={options}
            events={events}
            {...rest}
            getNetwork={(network) => {
                //  if you want access to vis.js network api you can set the state in a parent component using this property
                //network.body.emitter.emit("_dataChanged");
                //network.redraw();
            }}
        />

    );
};

export default NewGraphVisualisation;
