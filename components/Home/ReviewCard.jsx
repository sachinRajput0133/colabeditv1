import CustomLink from "@widget/customLink";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
const ReviewCard = ({
  href = "#",
  title,
  img,
  name = "",
  date = "",
  imageClasName = "",
  titleClassName = "",
  imageDivClasName="",
  desc = "",
}) => {
  console.log("🚀 ~ LatestUpdatesCard ~ title:", title);
  return (
    <CustomLink
      href={href}
      className=" hover:shadow-md duration-75 ease-in-out  rounded-md flex items-start justify-between group hover:border-primary transition-all hover:blue-shadow"
    >
      <div className="grid grid-cols-12 gap-4 ">
        <div className={`col-span-12 ${imageDivClasName}`}>
          <Image
            src={img}
            className={`h-[230px] w-[450px] min-w-[40px] object-cover ${imageClasName}   rounded-md`}
            alt="Drona"
            width={600}
            height={100}
          />
        </div>
        <div className="col-span-7 text-left w-full ">
          <h4
            className={`line-clamp-2 text-black flex  !font-bold text-2xl ${titleClassName}`}
            data-tip={title}
          >
            {title}
          </h4>
          {desc ? <h3>{desc}</h3> : <></>}
          <div className="w-full  flex gap-2">
            <span>{name}</span>
            <span>{date}</span>
          </div>
        </div>
      </div>
      {/* <button type="button" className="text-mid-gray group-hover:text-primary transition">
        <RightArrowIcon fill="currentColor" size="24" />
      </button> */}
    </CustomLink>
  );
};

export default ReviewCard;
