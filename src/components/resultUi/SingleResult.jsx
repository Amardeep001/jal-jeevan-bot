// component which give only one result at a time
const SingleResult = ({ resultData, loading }) => {
  return (
    <div className="mt-[40px] flex flex-col justify-center items-center ">
      {/* {(loading || resultData?.text) && (
        <h1 className="text-[24px] ">Our results are - </h1>
      )} */}
      {/* {resultData?.text && !loading && ( */}
      <div className="mt-10 flex justify-center gap-x-[10px] ">
        <div className="w-[70%] px-[10px] py-[20px] text-center border rounded-lg bg-gray-50 ">
          {/* <h2 className="text-[20px] ">Result 1</h2> */}
          {/* <p>{resultData?.text}</p> */}
          <p>Hello text</p>
        </div>
      </div>
      {/* )} */}
      {/* {loading && (
        <div className="mt-5">
          <Loader />
        </div>
      )} */}
    </div>
  );
};

export default SingleResult;
