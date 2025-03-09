import React from "react";
import ReviewCard from "./ReviewCard";


const LatestUpdates = ({ data }) => {
  if (!data?.subCategories.length) return null;

  // Split data into first item (feature) and remaining items
  const firstItem = data.subCategories[0];
  const remainingItems = data.subCategories.slice(1);

  const firstColumnItems = remainingItems.slice(0, 4);
  const overflowItems = remainingItems.slice(4); // Items that should wrap back into first column

  return (
    <div>
      <div className="grid grid-cols-12 gap-4">
        {/* First card: Takes full width (1-6) and spans two rows */}
        <div className="col-span-6 row-span-2">
          <ReviewCard
            title={firstItem.title}
            desc={firstItem?.desc}
            img={firstItem.img}
            imageClasName="h-[500px] !w-[800px]"
            date={firstItem.date}
            name={firstItem.name}
            titleClassName="text-2xl"
          />
        </div>

        {/* First Column: 2-column layout, max 2 rows (4 items) */}
        <div className="col-span-6 grid grid-cols-2 gap-4">
          {firstColumnItems.map((item, index) => (
            <ReviewCard
              key={item.id}
              index={index}
              title={item.title}
              date={item.date}
              name={item.name}
              img={item.img}
              titleClassName="text-[17px]"
            />
          ))}
        </div>

        {/* Overflow Items: Move back to first column if space available */}
      </div>
      <div>
        {overflowItems.length > 0 && (
          <div className="col-span-6 grid grid-cols-4 gap-4">
            {overflowItems.map((item, index) => (
              <ReviewCard
                key={index + firstColumnItems.length}
                title={item.title}
                date={item.date}
                name={item.name}
                img={item.img}
                titleClassName="text-[17px]"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LatestUpdates;
