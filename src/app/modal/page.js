"use client";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function MyComponent() {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const notify = () => {
    toast.success("The file was sent successfully !", {
      position: toast.POSITION.TOP_CENTER
    });
  }

  const handleAddFile = (event) => {
    const files = event.target.files;
    const updatedSelectedFiles = [...selectedFiles];

    for (let i = 0; i < files.length; i++) {
      updatedSelectedFiles.push(files[i]);
    }

    setSelectedFiles(updatedSelectedFiles);
  };
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFiles([]);
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  const handleFileDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleUpload = () => {
    notify()
    handleClose();
    
  };

  return (
    <div>
      <Button onClick={handleOpen} sx={{ backgroundColor: "blue" }}>
        Open Modal
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
           width:'70%',
              height:'65vh',
            maxHeight: "100vh",
            bgcolor: "#fcfcfa",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
            p: 4,
            textAlign: "center",
           
          }}
        >
          {selectedFiles.length > 0 ? (
            <div className="bg-[#f7f6f2] border-2 border-[#00FFB6] sm:w-full md:w-2/5 lg:w-2/6 mx-auto rounded-3xl">
              <Typography id="modal-description" sx={{ mb: 2 }}>
                Selected Files:
              </Typography>
              <ul>
                {selectedFiles.map((file, index) => (
                  <li className="text-[#4a4646]" key={index}>
                  <DoneAllIcon/> {file.name}
                  </li>
                ))}
              </ul>
              <div className="mb-5">
              <Button
                onClick={handleUpload}
                variant="outlined"
                color="success"
                sx={{ mt: 2  }}
              >
                Send Files
              </Button>
              
              <Button
                onClick={() => {
                  setSelectedFiles([]);
                }}
                variant="outlined"
                color="error"
                
                
                sx={{ mt: 2, backgroundColor: "#f72a0f", color: "#f72a0f" }}
              >
                Clear Files
              </Button>
              <input
                type="file"
                accept=".jpg, .jpeg, .png, .pdf"
                onChange={handleAddFile}
                style={{ display: "none" }}
                id="file-input"
                multiple
              />
            
              </div>  <label htmlFor="file-input">
              <Button
  component="span"
  variant="outlined"
  color="primary"
  sx={{ mt: 2, backgroundColor: "#00FFB6",marginBottom:'10px',width:'80%' }}
>
  Upload Another Files
</Button>

              </label>
            </div>
          ) : (
            <div className="flex justify-center">
              <div
                onDrop={handleFileDrop}
                onDragOver={handleDragOver}
                className=" rounded-md p-5 cursor-pointer mb-5 w-11/12 md:w-2/5 mx-auto md:mx-0  bg-[#f7f6f2] relative border-2 border-[#00FFB6] mt-10"
                style={{
                
    // maxWidth: "30%", 
    height: "45vh",
   
    
                }}
                
              >
                <Image
                  src="csv.svg"
                  alt="login image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: "20%",
                    height: "auto",
                    position: "absolute",
                    top: "50px",
                    left: "-10%",
                  }}
                />
                 <label htmlFor="file-input">
                  <Button
                    component="span"
                    sx={{ mt: 2,   marginBottom:"20px" ,borderRadius:'100%',    boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)" // Box shadow

                  }}
                  >
                    <Image
                      src="upload.svg"
                      alt="login image"
                      variant="contained"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{
                        width: "40px",
                        height: "auto",
                        marginRight: "2px",
                      }}
                    />
                  </Button>
                </label>
                <Typography id="modal-description" sx={{ mb: 2, color:'#475467' }}>
                <span className="text-[#00FFB6] font-extrabold ">Click to update</span>   or drag and drop
                </Typography>
                <Typography id="modal-description" sx={{ mb: 2,color:'#475467' }}>
                  SVG,PNG,JPG or GIF (max. 800 x 400px)
                </Typography>
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .pdf"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                  id="file-input"
                  multiple // Allow multiple file selection
                />
               
                <Image
                  src="pdf.svg"
                  alt="login image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: "20%",
                    height: "auto",
                    position: "absolute",
                    top: "180px",
                    right: "-10%",
                  }}
                />
                <Image
                  src="dock.svg"
                  alt="login image"
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{
                    width: "20%",
                    height: "auto",
                    position: "absolute",
                    top: "200px",
                    right: "90%",
                  }}
                />
                <Image
                      src="File.svg"
                      alt="login image"
                      variant="contained"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{
                        width: "8vw",
                        height: "auto",
                        // marginLeft: "200px",
                        position: "absolute",
                    top: "200px",
                    right: "4%",
                      }}
                    />
              </div>
            </div>
          )}
        </Box>
      </Modal>
        <ToastContainer/>
    </div>
  );
}

export default MyComponent;
