import React from "react";
import { getQuesioners } from "../../../lib/quesionersAPI";
import useSWR from "swr";
import { HSStaticMethods } from "preline/preline";

const Quesioner = () => {
  React.useEffect(() => {
    HSStaticMethods.autoInit();
  }, []);

  const quesioners = async () => {
    const response = await getQuesioners();
    return response.data;
  };

  const { data } = useSWR("quesioners", quesioners);

  const filteredData = data
    ?.filter((item) => [2, 4, 5].includes(item.id))
    ?.map((item) => ({ id: item.id, title: item.title }));

  let dataContent;
  if (!data) {
    return <div className="w-full h-4 bg-gray-200 rounded-full"></div>;
  } else {
    dataContent = filteredData?.map((item) => (
      <div
        key={item.id}
        className="flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl p-4 md:p-5"
      >
        <div className="flex items-center justify-between">
          {item.title}
          <div className="hs-tooltip inline-block">
            <button
              type="button"
              className="hs-tooltip-toggle size-11 inline-flex justify-center items-center gap-2 rounded-full bg-gray-50 border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 focus:outline-hidden focus:bg-blue-50 focus:border-blue-200 focus:text-blue-600"
            >
              <span className="inline-flex justify-center items-center size-11 rounded-full border-4 border-blue-100 bg-blue-200 text-blue-800">
                play
              </span>
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded-md shadow-2xs"
                role="tooltip"
              >
                Mulai Quisioner
              </span>
            </button>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <div className="flex flex-col space-y-5 text-sm font-semibold">
      {dataContent}
    </div>
  );
};

export default Quesioner;
