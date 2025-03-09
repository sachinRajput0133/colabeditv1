import React from "react";
import ReviewCard from "./ReviewCard";

const LatestStories = ({ data }) => {
  if (!data?.data?.length) return null;

  // Split data into first item (feature) and remaining items
  // Items that should wrap back into first column

  return (
    <div className="mt-4">
      <h2 className="text-2xl font-bold mb-4">{data.title.toUpperCase()}</h2>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-9 row-span-2 flex flex-col gap-4">
          {/* <div className="flex flex-col   justify-start  gap-4"> */}
          {data.data?.map((item, index) => (
            <ReviewCard
              imageDivClasName="!col-span-5"
              key={index}
              title={item.title}
              date={item.date}
              name={item.name}
              img={item.img}
              titleClassName="text-[17px]"
            />
          ))}
          {/* </div> */}
        </div>
        <div className="col-span-3 grid grid-cols-2 gap-4">Ads</div>
      </div>
    </div>
  );
};

export default LatestStories;
