import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { DataGridPro, LicenseInfo } from "@mui/x-data-grid-pro";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { Box, Button } from "@mui/material";

import FileEditModal from "./FileEditModal";
import "react-toastify/dist/ReactToastify.css";

import { setData, deleteRow, editRow } from "../slices/dataSlice";

LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_KEY);

const FileDownload = ({ saveEditedData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState([
    { file: {}, id: 0 },
  ]);

  const data = useSelector((state) => state.data.data);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://mocki.io/v1/d4d60c31-d34f-4884-8689-ca5887408cd2")
      .then((data) => data.json())
      .then((data) => dispatch(setData(data?.pdfs)));
  }, [dispatch]);

  const openEditModal = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
    dispatch(editRow({ id: row.id }));
  };

  const handleDelete = (rowId) => {
    try {
      const rowToDeleteIndex = data.findIndex((row) => row.id === rowId);

      if (rowToDeleteIndex === -1) {
        console.error(`No row with id #${rowId} found`);
        toast.error(`No row with id #${rowId} found`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
        return;
      }

      const updatedData = data.filter((_, index) => index !== rowToDeleteIndex);

      const updatedDataWithIds = updatedData.map((row, index) => ({
        ...row,
        id: index + 1,
      }));

      dispatch(deleteRow({ id: rowId }));
      setSelectedRow(null);
      toast.success("Row deleted successfully", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });

      dispatch(setData(updatedDataWithIds));
    } catch (error) {
      console.error("Error deleting row:", error);
      toast.error("Error deleting row", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const handleFileSelection = (selectedFile, selectedRow) => {
    console.log("selectedFile::>",selectedFile)
    const temp = selectedFileName.length > 0 ? selectedFileName : [];
    temp.push({ file: selectedFile, id: selectedRow.id });
    setSelectedFileName(temp);
  };

  const downloadFile = (item) => {
    if (item.file) {
      try {
        const blob = new Blob(item.file);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = item.file[0].name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
        toast.error("Error downloading file", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "filename",
      headerName: "File Name",
      minWidth: 100,
      flex: 1,
    },
    {
      field: "filesize",
      headerName: "File Size",
      width: 100,
      flex: 1,
    },
    {
      field: "url",
      headerName: "Download",
      width: 100,
      flex: 1,
      renderCell: (params) => {
        const temp = selectedFileName.filter(
          (item) => item.id === params.row.id
        );
        const item = temp.length > 0 ? temp[0] : {};

        return (
          <Box>
            <div className="">
              <Button
                onClick={() => {
                  if (selectedRow) {
                    downloadFile(item);
                  }
                }}
                endIcon={
                  item && item.file ? <FileDownloadOutlinedIcon /> : null
                }
              />
              {Object.keys(item).length > 0 ? item.file[0]?.name : ""}
            </div>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 150,
      maxWidth: 150,
      sortable: false,
      disableColumnMenu: false,
      renderCell: (params) => {
        return (
          <Box>
            <div className="table-actions">
              <Button
                onClick={() => openEditModal(params.row)}
                endIcon={<ModeEditOutlineOutlinedIcon />}
              />
              <FileEditModal />
              <Button
                className="deleteIcon"
                onClick={() => handleDelete(params.row.id)}
                endIcon={<DeleteOutlineOutlinedIcon />}
              />
            </div>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          p: 1,
          borderRadius: "3px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <DataGridPro
          {...data}
          columns={columns}
          getRowId={(row) => {
            return row.id;
          }}
          rows={data ? data : []}
          density="standard"
          className="overflow-hidden"
        />
      </Box>
      <FileEditModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedRow={selectedRow}
        saveEditedData={saveEditedData}
        onSave={handleFileSelection}
      />
    </>
  );
};

export default FileDownload;
