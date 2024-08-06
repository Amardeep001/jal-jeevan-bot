import React, { useState } from "react";
import ProcurementChatbot from "./components/procurementChatbot";
import bharatLogo from "../src/assets/images/goldenemb.png";
import waterDropLogo from "../src/assets/images/waterdrop.png";

// main component of app
// default ui component for home page
function App() {
  const [activeTab, setActiveTab] = useState("tab1");
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const options = [
    "Blocks with 100 Percent Household tap connection",
    "Districts with 100 Percent Household tap connection",
    "Household tap connection",
    "Number of Women trained for FTK testing",
    "Total number of households",
    "Villages with 100 Percent Household tap connection",
  ];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div className="h-[100vh] relative flex bg-gradient-to-r from-[#249EE3] to-[#3874D3] gap-x-3 p-5 ">
      <div className="w-[20%] px-4 py-7 flex flex-col ">
        <div className="">
          <div className="flex items-center justify-center gap-x-2">
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
        <div className="mt-5 relative inline-block text-left w-full">
          <div>
            <button
              type="button"
              className="inline-flex justify-between w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[#a4bfe9] text-sm font-medium text-black "
              onClick={() => setIsOpen(!isOpen)}
            >
              {selectedOption || "KPI's list"}
              <svg
                className={`-mr-1 ml-2 h-5 w-5 transform transition-transform ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 00-.707.293l-7 7a1 1 0 001.414 1.414L10 5.414l6.293 6.293a1 1 0 001.414-1.414l-7-7A1 1 0 0010 3z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {isOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {options.map((option, index) => (
                  <div key={index} className="relative group">
                    <button
                      className=" px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left overflow-hidden text-ellipsis whitespace-nowrap"
                      // onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </button>
                    <div className="absolute left-0 top-0 w-full p-2 bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 z-10 transition-opacity">
                      {option}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
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
