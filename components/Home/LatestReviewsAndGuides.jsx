import React from "react";
import ReviewCard from "./ReviewCard";

const LatestReviewsAndGuides = ({ data,isSeeAll }) => {
  if (!data?.data?.length) return null;

  // Split data into first item (feature) and remaining items
  // Items that should wrap back into first column

  return (
    <div className="mt-4">
      <div className="flex mb-4 gap-4">
      <h2 className="text-2xl font-bold ">{data.title.toUpperCase()}</h2>
       <button className="underline cursor-pointer">See all guides</button>

      </div>
      <div className="grid grid-cols-4 gap-4">
          {/* <div className="flex flex-col   justify-start  gap-4"> */}
          {data.data?.map((item, index) => (
            <ReviewCard
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
       
    </div>
  );
};

export default LatestReviewsAndGuides;
