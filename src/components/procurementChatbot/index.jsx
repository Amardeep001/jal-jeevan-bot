import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import SendIcon from "@mui/icons-material/Send";
import { Snackbar } from "@mui/material";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { ThreeDotsLoader } from "../commonComponent/loader";
import { API_URL } from "../../utils/constants";
import bharatLogo from "../../assets/images/goldenemb.png";
import waterDropLogo from "../../assets/images/waterdrop.png";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import MicIcon from "@mui/icons-material/Mic";
import SettingsVoiceIcon from "@mui/icons-material/SettingsVoice";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";

// common template ui for both tabs
const JalJeevanBot = () => {
  const paragraphRef = useRef(null);
  const inputRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  // const gadInput = JSON.parse(localStorage.getItem("procurementInput"));
  // const gadOutput = JSON.parse(localStorage.getItem("procurementOutput"));
  const [gadChatbotInput, setGadChatbotInput] = useState([]);
  const [gadChatbotOutput, setGadChatbotOutput] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [baseImage, setBaseImage] = useState([]);
  const [tableHeading, setTableHeading] = useState([]);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [textSpeechResult, setTextSpeechResult] = useState(null);
  const [textSpeechInsight, setTextSpeechInsight] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const utteranceRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleSearch = async () => {
    stopListening();
    // if (searchText === "") {
    //   Swal.fire("Please enter some text!");
    //   return;
    // }
    let arr = gadChatbotInput;
    arr.push(searchText || arr[arr.length - 1]);
    setGadChatbotInput(arr);
    // localStorage.setItem("procurementInput", JSON.stringify(arr));
    setSearchText("");
    setLoading(true);
    try {
      let res = await axios.post(
        `${API_URL}analyze`,
        {
          question: searchText || arr[arr.length - 1],
        },
        {
          headers: {
            "Content-Type": "application/json",
            // Add any other headers your API might require
          },
          // timeout: 60000,
        }
      );

      if (res) {
        let outputArr = gadChatbotOutput;
        const base64 = res.data.image;
        const imageBase64 = `data:image/png;base64,${base64}`;
        const keysArray = Object.keys(res.data?.json[0]);
        let tableData = tableHeading;
        tableData.push(keysArray);
        setTableHeading(tableData);
        let imageArr = baseImage;
        imageArr.push(imageBase64);
        setBaseImage(imageArr);
        outputArr.push(res.data);
        setGadChatbotOutput(outputArr);
        // localStorage.setItem("procurementOutput", JSON.stringify(outputArr));
        setTextSpeechResult(res.data?.result);
        setTextSpeechInsight(res.data?.insights);
        setLoading(false);
      }
    } catch (error) {
      console.log("there is some error", error.message);
      setLoading(false);
      let outputArr = gadChatbotOutput;
      outputArr.push("something went wrong");
      setGadChatbotOutput(outputArr);
      // localStorage.setItem("procurementOutput", JSON.stringify({ outputArr }));
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard?.writeText(text);
    setOpen(true);
  };

  const handleEdit = (text) => {
    inputRef.current.focus();
    setSearchText(text);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleRegenerate = () => {
    handleSearch();
  };

  const generatePdf = async (imageResult, jsonData, insights, headingData) => {
    console.log(headingData);
    const data = jsonData;
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text("Report", 20, 20);

    // Add insights text
    doc.setFontSize(14);
    doc.text("Insights:", 20, 30);
    doc.setFontSize(12);
    const insightsText = doc.splitTextToSize(insights, 180); // Split text to fit within the margin
    console.log(insightsText);
    doc.text(insightsText, 20, 40);

    // Add image
    const img = new Image();
    img.src = `${imageResult}`; // Replace with your image path
    img.onload = () => {
      const imageYPosition = 60;
      doc.addImage(img, "JPEG", 15, imageYPosition, 180, 160);
      // Add table
      if (data.length > 0) {
        const headers = ["#", ...Object.keys(data[0])]; // Add index column header
        const tableData = data?.map((item, index) => [
          index + 1,
          ...Object.values(item),
        ]);

        doc.autoTable({
          head: [headers],
          body: tableData,
          startY: imageYPosition + 160 + 10, // Add a small margin after the image
        });
      }
      // Save the PDF
      doc.save("report.pdf");
    };
  };

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const speechRecognition = new window.webkitSpeechRecognition();
      speechRecognition.continuous = true;
      speechRecognition.interimResults = true;
      speechRecognition.lang = "en-US";

      speechRecognition.onresult = (event) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptSegment = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptSegment;
          } else {
            interimTranscript += transcriptSegment;
          }
        }
        setSearchText(finalTranscript || interimTranscript);
      };

      speechRecognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(speechRecognition);
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setSearchText("");
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const handleSpeak = () => {
    if (!isSpeaking) {
      const totalSpeechText = textSpeechInsight + " " + textSpeechResult;
      const utterance = new SpeechSynthesisUtterance(totalSpeechText);
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleMute = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // useEffect(() => {
  //   if ("speechSynthesis" in window && textSpeechResult) {
  //     const utterance = new SpeechSynthesisUtterance(textSpeechResult);
  //     window.speechSynthesis.speak(utterance);
  //     setTextSpeechResult(null);
  //   }
  //   if ("speechSynthesis" in window && textSpeechInsight) {
  //     const utterance = new SpeechSynthesisUtterance(textSpeechInsight);
  //     window.speechSynthesis.speak(utterance);
  //     setTextSpeechInsight(null);
  //   }
  // }, [textSpeechResult, textSpeechInsight]);

  useEffect(() => {
    if (gadChatbotInput.length) {
      paragraphRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [gadChatbotInput.length]);

  return (
    <div className="w-[80%] relative h-full rounded-lg bg-white ">
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message="text is copied."
        sx={{ width: "100%" }}
      />
      <div className="flex justify-between px-6 py-4 items-center rounded-t-lg bg-[#fdf5e6] ">
        <img alt="bihar_logo" src={bharatLogo} />
        <h1 className="text-black text-[20px] font-medium mx-5 ">
          Jal Jeevan Mission - Har Ghar Jal
        </h1>
        <img alt="bihar_logo" src={waterDropLogo} className="h-[70px] " />
      </div>
      <hr className="h-px bg-gray-400 border-0"></hr>
      <div className="w-full max-h-[65%] rounded-md pb-5 overflow-y-auto ">
        {gadChatbotInput.length === 0 && (
          <div className=" rounded-lg py-5 mt-[100px] mx-[120px] px-5 text-center flex flex-col items-center justify-center">
            <h1 className="text-[24px] text-gray-500 font-medium ">
              Start Your Search Today
            </h1>
            <p className="mt-3 text-gray-400 ">
              JAL JEEVAN AI BOT searches data and insights from household tap
              connection from all over India.
            </p>
          </div>
        )}
        {gadChatbotInput.length > 0 &&
          gadChatbotInput.map((item, index) => {
            return (
              <>
                <div
                  key={index}
                  className="flex justify-end mx-5 my-5 "
                  ref={paragraphRef}
                >
                  <div className="border shadow-md border-black bg-[#ecd3c5] text-black rounded-lg px-5 py-1 max-w-[90%] ">
                    {/* {item} */}
                    <div className="flex gap-3 my-2 text-gray-600 text-sm flex-1">
                      <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                        <div className="rounded-full bg-gray-100 border p-1">
                          <svg
                            stroke="none"
                            fill="black"
                            strokeWidth="0"
                            viewBox="0 0 16 16"
                            height="20"
                            width="20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"></path>
                          </svg>
                        </div>
                      </span>
                      <div className="leading-relaxed">
                        <span className="block font-bold text-gray-700">
                          You{" "}
                        </span>
                        {item}
                        <div className="mt-3 flex gap-x-1 ">
                          <CopyToClipboard
                            text={item}
                            onCopy={() => handleCopy(item)}
                          >
                            <svg
                              className="h-5 w-5 text-white-500 cursor-pointer "
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              strokeWidth="2"
                              stroke="currentColor"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              onClick={() => handleCopy(item)}
                            >
                              {" "}
                              <path stroke="none" d="M0 0h24v24H0z" />{" "}
                              <rect x="8" y="8" width="12" height="12" rx="2" />{" "}
                              <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                            </svg>
                          </CopyToClipboard>
                          <svg
                            className="h-5 w-5 text-white-500 cursor-pointer "
                            viewBox="0 0 24 24"
                            strokeWidth="2"
                            stroke="currentColor"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={() => handleEdit(item)}
                          >
                            {" "}
                            <path stroke="none" d="M0 0h24v24H0z" />{" "}
                            <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />{" "}
                            <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />{" "}
                            <line x1="16" y1="5" x2="19" y2="8" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {gadChatbotOutput.length > 0 && gadChatbotOutput[index] && (
                  <div className="text-left mx-5 my-5 max-w-[100%] ">
                    <div className="mt-[50px] border resize-none border-black h-full bg-gray-200 rounded-lg flex flex-col justify-center items-center ">
                      <div className="flex gap-3 px-4 my-4 w-[100%] text-gray-600 text-sm flex-1">
                        <span className="relative flex shrink-0 overflow-hidden rounded-full w-8 h-8">
                          <div className="rounded-full bg-gray-100 border p-1">
                            <svg
                              stroke="none"
                              fill="black"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              height="20"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                              ></path>
                            </svg>
                          </div>
                        </span>
                        <p className="leading-relaxed w-[90%]">
                          <span className="block font-bold text-gray-700">
                            AI{" "}
                          </span>
                          {/* {gadChatbotOutput[index]} */}
                          <div className="w-full mt-[20px] px-[10px] py-[10px] text-center border rounded-lg bg-gray-50 shadow-md ">
                            <button
                              className="px-5 py-1 text-black bg-slate-400 rounded-lg "
                              onClick={() =>
                                generatePdf(
                                  baseImage[index],
                                  gadChatbotOutput[index]?.json,
                                  gadChatbotOutput[index].insights,
                                  tableHeading[index]
                                )
                              }
                            >
                              Download PDF
                            </button>
                            <h1 className="text-[20px] mt-2 font-medium ">
                              Insights
                            </h1>
                            <div>
                              {isSpeaking ? (
                                <button className="mr-1 " onClick={handleMute}>
                                  <VolumeUpIcon />
                                </button>
                              ) : (
                                <button className="mr-1 " onClick={handleSpeak}>
                                  <VolumeOffIcon />
                                </button>
                              )}
                              {gadChatbotOutput[index].insights}
                            </div>
                          </div>
                          <div className="mt-5 flex gap-x-[10px] ">
                            <div className="w-[50%] max-h-[300px] overflow-auto px-[10px] py-[20px] text-center border rounded-lg bg-gray-50 shadow-md ">
                              <img src={baseImage[index]} alt="error" />
                            </div>
                            <div className="w-[50%] max-h-[300px] overflow-auto px-[10px] py-[20px] text-center border rounded-lg bg-gray-50 shadow-md ">
                              <table className="table-auto min-w-full ">
                                <thead>
                                  <tr>
                                    {tableHeading.length > 0 &&
                                      tableHeading[index]?.map((item) => {
                                        return (
                                          <th className="px-4 py-2 bg-[#d5d5d5]  ">
                                            {item}
                                          </th>
                                        );
                                      })}
                                  </tr>
                                </thead>
                                <tbody>
                                  {gadChatbotOutput.length > 0 &&
                                    gadChatbotOutput[index]?.json?.map(
                                      (item) => {
                                        return (
                                          <tr>
                                            {tableHeading.length > 0 &&
                                              tableHeading[index]?.map(
                                                (heading) => {
                                                  return (
                                                    <td className="px-4 py-2 text-white bg-[#466688] ">
                                                      {item[heading]}
                                                    </td>
                                                  );
                                                }
                                              )}
                                          </tr>
                                        );
                                      }
                                    )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                          <div className="w-full mt-[20px] px-[10px] py-[10px] text-center border rounded-lg bg-gray-50 shadow-md ">
                            <h1 className="text-[20px] font-medium ">Result</h1>
                            <p>{gadChatbotOutput[index].result}</p>
                          </div>
                          <div className="mt-3 flex gap-x-1 ">
                            <CopyToClipboard
                              text={gadChatbotOutput[index]?.insights}
                              onCopy={() =>
                                handleCopy(gadChatbotOutput[index]?.insights)
                              }
                            >
                              <svg
                                className="h-5 w-5 text-white-500 cursor-pointer"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                strokeWidth="2"
                                stroke="currentColor"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                onClick={() =>
                                  handleCopy(gadChatbotOutput[index]?.insights)
                                }
                              >
                                {" "}
                                <path stroke="none" d="M0 0h24v24H0z" />{" "}
                                <rect
                                  x="8"
                                  y="8"
                                  width="12"
                                  height="12"
                                  rx="2"
                                />{" "}
                                <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" />
                              </svg>
                            </CopyToClipboard>

                            {index === gadChatbotInput.length - 1 && (
                              <svg
                                className="h-5 w-5 text-white-500 cursor-pointer"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                onClick={handleRegenerate}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                              </svg>
                            )}
                          </div>
                        </p>
                        <div></div>
                      </div>
                    </div>
                  </div>
                )}
                {!gadChatbotOutput[index] && loading && (
                  <div className="text-left mx-5 my-5 max-w-[70%] ">
                    <ThreeDotsLoader />
                  </div>
                )}
              </>
            );
          })}
      </div>
      <div className="flex absolute bottom-0 rounded-lg w-full px-5 mb-5 box-border ">
        <button
          className={` w-[5%] border-2 border-r-none border-gray-300 text-black text-lg font-semibold rounded-l-md`}
          onClick={startListening}
          disabled={isListening}
        >
          {isListening ? <SettingsVoiceIcon /> : <MicIcon />}
        </button>
        <input
          ref={inputRef}
          type="text"
          name="q"
          id="query"
          placeholder="Ask me anything ..."
          value={searchText}
          className="w-[85%] box-border p-3 rounded-md border-2 border-r-white rounded-l-none rounded-r-none border-gray-300 placeholder-gray-500 dark:placeholder-gray-300 dark:bg-gray-500dark:text-gray-300 dark:border-none "
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setSearchText(e.target.value);
            stopListening();
          }}
        />
        <button
          className={`w-[15%] ${
            loading || !searchText ? "bg-violet-400" : "bg-violet-700"
          } text-white text-lg font-semibold rounded-r-md`}
          onClick={handleSearch}
          disabled={loading || !searchText}
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

export default JalJeevanBot;
