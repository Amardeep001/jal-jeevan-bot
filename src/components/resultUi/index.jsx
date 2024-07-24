import Loader from "../commonComponent/loader";

// component for giving three results concurrently.
const ResultUI = ({ resultData, loading }) => {
  return (
    <div className="mt-[50px] flex flex-col justify-center items-center ">
      {(loading || resultData?.text) && (
        <h1 className="text-[24px] ">Our results are - </h1>
      )}
      {resultData?.text && !loading && (
        <div className="mt-10 flex justify-center gap-x-[10px] ">
          <div className="w-[30%] px-[10px] py-[20px] text-center border rounded-lg bg-gray-50 ">
            <h2 className="text-[20px] ">Result 1</h2>
            <p className="mt-5 break-words ">{resultData?.text?.gfr}</p>
          </div>
          <div className="w-[30%] px-[10px] py-[20px] text-center border rounded-lg bg-gray-50">
            <h2 className="text-[20px] ">Result 2</h2>
            <p className="mt-5 break-words ">{resultData?.text?.bfr}</p>
          </div>
          <div className="w-[30%] p-[10px] py-[20px] text-center border rounded-lg bg-gray-50">
            <h2 className="text-[20px] ">Result 3</h2>
            <p className="mt-5 break-words ">{resultData?.text?.cvc}</p>
          </div>
        </div>
      )}
      {loading && (
        <div className="mt-5">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default ResultUI;
