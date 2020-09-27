import React from "react";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import {Divider} from "@material-ui/core";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import GraphVisualisation from "./GraphVisualisation";
import NewGraphVisualisation from "./NewGraphVisualisation";
import Graph from "react-graph-vis";
import Visualisation from "./Visualisation";
const styles = {
    Paper: {
        padding: 20,
        marginBottom: 10,
        height: "100%",
        overflow: "auto",
    },
    TextareaAutosize: {
        width: "100%",
    },
};

class VisualisationArea extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { sentence, graphData } = this.props;

        console.log("VisualisationArea render: ",graphData);
        const graphSelected = graphData.nodes !== undefined;
        console.log({graphSelected});

        return (
            <Paper style={styles.Paper} variant="elevation" elevation={5}>
                <Typography variant="h6" align="center">
                    Visualization Area
                </Typography>
                <Divider />
                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="visualization-controls"
                        id="visualization-controls-header"
                    >
                        <Typography>Visualization Control Panel</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">
                                Select visualization format
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-label="visualization-format"
                                name="format"
                                defaultValue="format1"
                            >
                                <FormControlLabel
                                    value="format1"
                                    control={<Radio color="primary" />}
                                    label="Flat/Hierarchical"
                                />
                                <FormControlLabel
                                    value="format2"
                                    control={<Radio color="primary" />}
                                    label="Tree-like"
                                />
                            </RadioGroup>
                        </FormControl>
                    </AccordionDetails>
                </Accordion>
                <Divider />
                {graphSelected ? <Visualisation graphData={graphData}/>: <div>Select a sentence.</div>}
            </Paper>
        );
    }
}

export default VisualisationArea;
