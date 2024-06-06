import React from "react";

const Modal = ({ isShow, isEnd, message }) => {
  return (
    <>
      <div
        tabIndex="-1"
        aria-hidden="true"
        className={`${
          !isShow
            ? "hidden"
            : "cursor-none overflow-y-auto overflow-x-auto fixed z-50 flex flex-col justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        } ${isEnd ? "cursor-auto": ""}`}
      >
        <div className="animate-bounce relative p-4 w-1/2 max-w-2xl max-h-full font-bold text-center bg-slate-500 rounded-lg">
          {message}
          <div className={`${!isEnd ? "hidden" : "flex justify-center items-center p-4 md:p-5 border-gray-200"}`}>
            <button
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Restart
            </button>
            <a
              href="/"
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700"
            >
              Leave
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
