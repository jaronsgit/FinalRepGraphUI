import React, { useContext } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import Tooltip from "@material-ui/core/Tooltip";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Zoom from "@material-ui/core/Zoom";

import { AppContext } from "../../Store/AppContextProvider.js";

function handleSelectSentence(sentenceId) {
  //Request sentence data from the back-end
  //Set the Context state accordingly through dispatch
}

const styles = {
  Paper: {
    padding: 20,
    marginBottom: 10,
    height: "100%",
    overflow: "auto"
  },
  SentencePaper: {
    height: 300,
    overflow: "auto"
  }
};

export default function SentenceList() {
  const { state, dispatch } = useContext(AppContext);

  return (
    <Grid item style={{ width: "100%" }}>
      <List component="nav" aria-label="features">
        <Paper style={styles.SentencePaper}>
          <List component="ul">
            {state.dataSet === null ? (
              <div>No data-set has been uploaded yet</div>
            ) : (
              state.dataSet.map((sentence) => (
                <Tooltip
                  key={sentence.id}
                  TransitionComponent={Zoom}
                  title="Display Graph >"
                  placement="right"
                >
                  <div>
                    <ListItem
                      button
                      onClick={() => handleSelectSentence(sentence.id)}
                    >
                      <ListItemText primary={sentence.input}></ListItemText>
                    </ListItem>
                    <Divider />
                  </div>
                </Tooltip>
              ))
            )}
          </List>
        </Paper>
      </List>
      <Divider />
    </Grid>
  );
}
