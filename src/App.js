import React, { useState } from "react";
import ProcurementChatbot from "./components/procurementChatbot";
import bharatLogo from "../src/assets/images/goldenemb.png";
import waterDropLogo from "../src/assets/images/waterdrop.png";

// main component of app
// default ui component for home page
function App() {
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <div className="h-[100vh] relative flex bg-gradient-to-r from-[#249EE3] to-[#3874D3] gap-x-3 p-5 ">
      <div className="w-[20%] px-4 py-7 flex flex-col ">
        <div className="">
          <div className="flex items-center justify-center gap-x-3">
            <img
              alt="bihar_logo"
              src={bharatLogo}
              className="w-8 h-8 rounded-[100%] "
            />
            <h1 className="text-white font-medium text-[24px] ">
              JAL JEEVAN मित्र
            </h1>
          </div>
          <div className="text-right text-[12px] font-bold ">Powered by AI</div>
        </div>

        <hr className="h-px my-5 bg-gray-400 border-0"></hr>
        <button
          className={` text-left text-[14px] font-medium ${
            activeTab === "tab1" ? "bg-white text-black" : "text-white"
          } rounded-md py-2 px-3 flex items-center gap-x-2 `}
          onClick={() => setActiveTab("tab1")}
        >
          <img alt="bihar_logo" src={waterDropLogo} className="w-5 h-5" />
          JAL AI BOT
        </button>
        {/* <button
          className={` text-left text-[14px] font-medium ${
            activeTab === "tab2" ? "bg-white text-black " : "text-white"
          } rounded-md py-2 px-3 flex items-center gap-x-2 `}
          onClick={() => setActiveTab("tab2")}
        >
          <img alt="bihar_logo" src={biharLogo} className="w-5 h-5" />
          JAL AI BOT
        </button> */}
      </div>
      {activeTab === "tab1" && <ProcurementChatbot />}
      {/* {activeTab === "tab2" && <GadChatbot />} */}
      <div className="absolute bottom-2 w-[20%] left-4 text-[14px] font-medium font-serif ">
        The AI solution is designed and developed by KPMG India
      </div>
    </div>
  );
}

export default App;
