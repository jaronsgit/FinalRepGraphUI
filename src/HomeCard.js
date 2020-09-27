import React from "react";
import { makeStyles } from "@material-ui/core";
import Card from "@material-ui/core";
import CardContent from "@material-ui/core";
import Typography from "@material-ui/core";
import UploadFileButton from "./UploadFileButton";

const useStyles = makeStyles({
  root: {
    minWidth: 390
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 14
  },
  pos: { margin: "auto" }
});

function HomeCard() {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>
        <Typography variant="h4" component="h2">
          Welcome to RepGraph
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          Please upload a data-set to begin
        </Typography>
        <UploadFileButton />
      </CardContent>
    </Card>
  );
}

export default HomeCard;
