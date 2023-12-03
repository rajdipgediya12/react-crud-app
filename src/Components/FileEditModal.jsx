import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Typography,
  Box,
} from "@mui/material";

import "react-toastify/dist/ReactToastify.css";

import { editRow } from "../slices/dataSlice";

// import firebase from "firebase";

// const firebaseConfig = {
//   apiKey: "your api key",
//   authDomain: "your credentials",
//   projectId: "file-upload-964c7",
//   storageBucket: "your credentials",
//   messagingSenderId: "your credentials",
//   appId: "your credentials",
// };

const FileEditModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedRow,
  onSave,
}) => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const [editedData, setEditedData] = useState({
    id: "",
    filename: "",
    filesize: "",
  });

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      const isAnyFileEmpty = files.some((file) => file.size === 0);
      if (!isAnyFileEmpty) {
        setSelectedFile(files);
        setFileError(null);
      } else {
        setFileError("Please select non-empty file(s).");
        toast.error("Please select non-empty file(s)", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } else {
      setSelectedFile([]);
      setFileError(null);
    }
  };

  useEffect(() => {
    if (selectedRow) {
      setEditedData({
        id: selectedRow.id,
        filename: selectedRow.filename,
        filesize: selectedRow.filesize,
      });
    }
  }, [selectedRow]);

  const saveEditedData = async () => {
    if (selectedFile && selectedFile.length > 0 && selectedFile[0].size > 0) {
      const newData = {
        id: selectedRow.id,
        filename: editedData.filename,
        filesize: editedData.filesize,
      };
      dispatch(editRow({ id: selectedRow.id, newData }));
      toast.success("Data edited successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "toast-message",
      });
      setIsModalOpen(false);
      onSave(selectedFile, selectedRow);
    } else {
      setFileError("Please select a non-empty file.");
      toast.error("Please select non-empty file(s)", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };
  return (
    <>
      <ToastContainer />

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Row</DialogTitle>
        <DialogContent>
          {selectedRow && (
            <div>
              <TextField
                label="ID"
                fullWidth
                disabled
                value={editedData.id}
                className="mb-3"
                onChange={(e) =>
                  setEditedData({ ...editedData, id: e.target.value })
                }
              />
              <TextField
                label="File Name"
                className="mb-3"
                fullWidth
                value={editedData.filename}
                onChange={(e) =>
                  setEditedData({ ...editedData, filename: e.target.value })
                }
              />
              <TextField
                label="File Size"
                className="mb-3"
                fullWidth
                value={editedData.filesize}
                onChange={(e) =>
                  setEditedData({ ...editedData, filesize: e.target.value })
                }
              />
              <Paper elevation={3} sx={{ p: 3, textAlign: "center", my: 2 }}>
                <label htmlFor="file-input">
                  <input
                    type="file"
                    id="file-input"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.csv"
                    style={{ display: "none" }}
                    multiple
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                  >
                    Choose File
                  </Button>
                </label>
                {fileError && (
                  <Typography className="error-message">{fileError}</Typography>
                )}
                {selectedFile && (
                  <Box mt={2}>
                    <Typography variant="subtitle1">Selected File:</Typography>
                    <Typography>{selectedFile[0].name}</Typography>
                  </Box>
                )}
              </Paper>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={saveEditedData} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FileEditModal;
