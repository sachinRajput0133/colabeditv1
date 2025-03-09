import LayoutWrapper from "@shared/layoutWrapper";
import React from "react";
import LatestUpdates from "./latestUpdates";
import LatestStories from "./LatestStories";
import LatestReviewsAndGuides from "./LatestReviewsAndGuides";

const Home = ({ pageData, userData, seoData, locale }) => {
  const latestUpdates = [
    {
      title: "Skype will take its final curtain (and video) call May 5",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
      desc: "MOcrosoft is shutting the program down after more then 20 years",
    },
    {
      title: "Skype will take its final curtain (and video) call May 5",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
    {
      title: "Skype will take its final curtain (and video) call May 5",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
    {
      title:
        "AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
    {
      title: "Skype will take its final curtain (and video) call May 5",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
    {
      title: "Skype will take its final curtain (and video) call May 5",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
    {
      title: "Skype will take its final curtain (and video) call May 5",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
    {
      title:
        "AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
    {
      title: "Skype will take its final curtain (and video) call May 5",
      img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
      date: "20/7/2025",
      name: "vinu",
    },
  ];
  const latestStories = {
    title: "latest Stories",
    data: [
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
        desc: "MOcrosoft is shutting the program down after more then 20 years",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
        desc: "With the Galaxy A56, Samsung upgraded its midrange smartphone series with a brushed metal frame, Galaxy AI features and faster charge speeds.",
      },
      {
        title:
          "AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "Side Quest, formerly called Mere Mortals, will premiere on March 26 on Apple TV+ alongside the finale of Mythic Quest season 4",
      },
      {
        title:
          "AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "Alphabet has announced a new development for Project Taara's technology that could lead to low-cost, high-speed internet connectivity, even in far-flung locations.",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "India's Top Developer Launch, Lodha Vero in Matunga - Luxurious 2, 3 & 4 BHKs Starting at ₹ 3.39 Cr All In with Modern Amenities. Project is Located At 15 Min From BKC, 5 Min From Five Gardens, Hospital, Malls, Schools.",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "The company's plan for third-party integration with its upgraded assistant is unique.",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "Sigil tries to recreate the experience of tabletop gaming without venturing too far into the realm of full-on video gaming.",
      },
      {
        title:
          "AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "Presenting Vero, Ultra Luxurious 2, 3 & 4 BHK Sky Mansions in Matunga, ₹3.39 Cr Onwards. Jain Derasar & Upashray on premises. 15 mins drive to BKC. 5 mins to Five Gardens. 5 mins drive old Matunga.",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "A charity games bundle that's supporting wildfire relief efforts in Southern California includes hundreds of titles, such as Tunic, Octodad: Dadliest Catch, Hidden Folks and SkateBird.",
      },
    ],
  };
  const latestRevGui = {
    title: "latest Review and guides",
    data: [
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
        desc: "MOcrosoft is shutting the program down after more then 20 years",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
      {
        title:
          "AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
      {
        title:
          "AMD's $549 Radeon 9070 and $599 9070 XT are gunning for NVIDIA's midrange throne",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
      {
        title: "Skype will take its final curtain (and video) call May 5",
        img: "https://images.pexels.com/photos/30847375/pexels-photo-30847375/free-photo-of-stylish-man-walking-along-brick-wall-at-sunset.jpeg",
        date: "20/7/2025",
        name: "vinu",
      },
    ],
  };
  return (
    <LayoutWrapper
      meta={seoData?.data}
      bg="white"
      containerClassName="!px-3 !py-0"
      homeHeader
    >
      <div className="flex gap-24 flex-col">
        <div>adds</div>
        <LatestUpdates data={latestUpdates} />
        <div>adds</div>
        <LatestStories data={latestStories} />
        <div>adds</div>
        <LatestReviewsAndGuides data={latestRevGui} isSeeAll />
      </div>
    </LayoutWrapper>
  );
};

export default Home;
