import React, { useState, useContext } from "react";
import { Card, Typography, Button } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Link, useHistory } from "react-router-dom";
import { DropzoneArea } from "material-ui-dropzone";

import { AppContext } from "./Store/AppContextProvider.js";

const testingEndpoint = "";

export default function HomePage(props) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const history = useHistory();

  const { dispatch } = useContext(AppContext);

  function handleChange(files) {
    setFileObjects({ ...fileObjects, ...files });
  }

  function handleUpload() {
    let formData = new FormData();
    formData.append("data", fileObjects[0]);

    let requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow"
    };

    fetch(
      testingEndpoint + "/UploadData?FileName=SupremeLeaderJanBuys",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        const jsonResult = JSON.parse(result);
        console.log(jsonResult);
        console.log(jsonResult.response);
        dispatch({ type: "SET_DATASET", payload: { dataSet: jsonResult } });
        //this.setState({sentences: jsonResult.data, sentence: jsonResult.data[0]});
        history.push("/main");
      })
      .catch((error) => {
        console.log("error", error);
        history.push("/main"); //for debugging
      });
  }

  return (
    <Card>
      <Typography variant="h4" component="h2">
        Welcome to RepGraph
      </Typography>
      <Typography color="textSecondary">
        Please upload a data-set to begin
      </Typography>
      <DropzoneArea
        acceptedFiles={[".dmrs"]}
        dropzoneText={"Drag and drop an data-set here or click"}
        onChange={(files) => {
          console.log("Files:", files);
          handleChange(files);
        }}
      />
      <Button onClick={handleUpload} startIcon={<CloudUploadIcon />}>
        Upload
      </Button>
    </Card>
  );
}
