import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useReward } from "react-rewards";
import AudioPost from "./AudioPost";
import DynamicImage from "./DynamicImage";
import Scribble from "./Scribble";
import Remixed from "./Remixed";
import toast from "react-hot-toast";
import Comments from "./Comments";

const Post = ({
  tag,
  title,
  username,
  avatar,
  type = "image",
  src,
  id,
  remixid,
}) => {
  // State to toggle comment section visibility
  const [showComments, setShowComments] = useState(false);
  const [showRemixed, setShowRemixed] = useState(false);

  // State to toggle emoji panel visibility
  const [showEmojiPanel, setShowEmojiPanel] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [attestationVisible, setAttestationVisible] = useState(false);

  const rewardRef = useRef(null);

  const [emoji, setEmoji] = useState("");

  const [config, setConfig] = useState({
    emoji: [emoji],
    elementCount: 100,
    spread: 150,
    zIndex: 9999,
    lifetime: 200,
  });

  const { reward, isAnimating } = useReward("rewardId", "emoji", config);

  useEffect(() => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      emoji: [emoji],
    }));
    // Check if the emoji is set to 🎁 and the overlay is not visible, then trigger the reward
    if (emoji === "🎁" && !overlayVisible) {
      reward();
    }
  }, [emoji, overlayVisible]);

  const handleEmojiClick = (selectedEmoji) => {
    // Set the emoji state to update the config for the reward effect
    setEmoji(selectedEmoji);
    // Trigger the reward (emoji rain) effect directly using the reward function
    reward();
    console.log(`Emoji clicked: ${selectedEmoji}`);
    // Add additional actions here if needed
    setTimeout(() => {
      toast(
        (t) => (
          <div className="flex flex-row gap-[10px] items-center">
            <img src="/icons/coin.svg" alt="" /> You earned{" "}
            <span className="font-bold">5</span> coins
          </div>
        ),
        {
          duration: 3000,
        }
      );
    }, 2000);
  };

  // Function to toggle the comment section visibility
  const toggleComments = () => {
    if (showRemixed) {
      setShowRemixed(false);
    }
    setShowComments(!showComments);
  };

  const toggleRemixed = () => {
    if (showComments) {
      setShowComments(false);
    }
    setShowRemixed(!showRemixed);
  };

  // Function to toggle the emoji panel visibility
  const toggleEmojiPanel = () => {
    setShowEmojiPanel(!showEmojiPanel);
  };

  const toggleOverlay = () => {
    if (overlayVisible) {
      // Only set the emoji to 🎁 if closing the overlay
      setEmoji("🎁");
    } else {
      // Ensure the emoji is reset or set to any other value when opening the overlay
      // to avoid immediate triggering of the emoji rain due to the useEffect above.
    }
    setOverlayVisible(!overlayVisible);
  };

  const toggleAttestation = () => {
    setAttestationVisible(!attestationVisible);
    console.log("toggles");
  };

  const getRemixUrl = () => {
    switch (type) {
      case "dynamic":
        return "/remix-image?id=" + id;
      case "scribble":
        return "/remix-scribble?id=" + id;
      case "audio":
        return "/remix-audio?id=" + id;
      default:
        return "/remix-image?id=" + id;
    }
  };

  const [comments, setComments] = useState([
    { username: "user1", text: "Great post!", avatar: "/images/avatar.png" },
    { username: "user2", text: "Love this!", avatar: "/images/avatar.png" },
  ]);

  return (
    <div className="flex flex-col mt-[8px]  relative">
      <div
        className="absolute top-[10px] right-[10px] z-30"
        onClick={toggleAttestation}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
        >
          <path
            d="M12.0844 0.224609L14.5879 1.52061L17.3749 1.94361L18.6379 4.46361L20.6434 6.44361L20.1844 9.22461L20.6434 12.0056L18.6379 13.9856L17.3749 16.5056L14.5879 16.9286L12.0844 18.2246L9.58089 16.9286L6.79389 16.5056L5.53089 13.9856L3.52539 12.0056L3.98439 9.22461L3.52539 6.44361L5.53089 4.46361L6.79389 1.94361L9.58089 1.52061L12.0844 0.224609Z"
            fill="#1E09AE"
          />
          <path
            d="M6.08398 17.916V24.225L12.084 22.725L18.084 24.225V17.916L15.057 18.375L12.084 19.914L9.11098 18.375L6.08398 17.916Z"
            fill="#1E09AE"
          />
        </svg>
      </div>
      <div className="flex flex-col py-[12px] bg-primary">
        <div className="flex flex-row gap-[8px] items-center w-full px-[16px] z-10">
          <img className="h-[24px] w-[24px] rounded-full" src={avatar} alt="" />
          <span className="text-[12px] font-medium"> {username}</span>
        </div>
        <p className="mx-[10px] mt-[7px] text-[14px] z-10">
          {title}/ <span className="text-secondary font-[700]">{tag}</span>
        </p>
      </div>

      <div className="flex flex-col justify-center items-center mx-[10px] mt-[12px] w-[370px] h-[358px] rounded-[8px] z-10">
        {type === "audio" && <AudioPost audioUrl={src} />}
        {type === "dynamic" && <DynamicImage remixId={remixid} />}
        {type === "scribble" && <Scribble src={src} />}
      </div>

      {/* Reward container */}
      <span id="rewardId" />

      <div className="flex flex-row justify-between mx-[10px] mt-[14px]">
        <div className="flex flex-row gap-[30px]">
          <svg
            onClick={toggleComments}
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M3.75082 14.3885C3.88057 14.5187 3.97999 14.676 4.042 14.8491C4.10401 15.0221 4.12708 15.2067 4.10957 15.3897C4.02172 16.2367 3.85517 17.0737 3.61207 17.8897C5.35582 17.486 6.42082 17.0185 6.90457 16.7735C7.17895 16.6345 7.49493 16.6016 7.79207 16.681C8.64386 16.9081 9.52178 17.0224 10.4033 17.021C15.3983 17.021 19.1533 13.5122 19.1533 9.521C19.1533 5.531 15.3983 2.021 10.4033 2.021C5.40832 2.021 1.65332 5.531 1.65332 9.521C1.65332 11.356 2.42457 13.0585 3.75082 14.3885ZM3.13457 19.2697C2.83841 19.3285 2.54128 19.3822 2.24332 19.431C1.99332 19.471 1.80332 19.211 1.90207 18.9785C2.01306 18.7167 2.11479 18.4512 2.20707 18.1822L2.21082 18.1697C2.52082 17.2697 2.77332 16.2347 2.86582 15.271C1.33207 13.7335 0.40332 11.721 0.40332 9.521C0.40332 4.6885 4.88082 0.770996 10.4033 0.770996C15.9258 0.770996 20.4033 4.6885 20.4033 9.521C20.4033 14.3535 15.9258 18.271 10.4033 18.271C9.41288 18.2723 8.42655 18.1437 7.46957 17.8885C6.81957 18.2172 5.42082 18.816 3.13457 19.2697Z"
              fill={showComments ? "#FFC022" : "black"}
            />
          </svg>

          <div className="relative">
            {showEmojiPanel && (
              <div className="absolute -top-[5px] left-[90px] transform -translate-x-1/2 -translate-y-full z-40">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="247"
                    height="56"
                    viewBox="0 0 247 56"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M8.22559 0.599121C3.80731 0.599121 0.225586 4.18084 0.225586 8.59912V37.1296C0.225586 41.5479 3.80731 45.1296 8.22558 45.1296H36.4032L43.4444 54.9089C44.2425 56.0174 45.8924 56.0174 46.6905 54.9089L53.7317 45.1296H238.46C242.878 45.1296 246.46 41.5479 246.46 37.1296V8.59912C246.46 4.18084 242.878 0.599121 238.46 0.599121H8.22559Z"
                      fill="#F5F4F4"
                    />
                  </svg>
                  <div className="flex flex-row gap-[15px] absolute top-[5px] w-full px-[14px] ">
                    <span
                      onClick={() => handleEmojiClick("❤️")}
                      className="text-[24px]"
                    >
                      ❤️
                    </span>
                    <span
                      onClick={() => handleEmojiClick("😂")}
                      className="text-[24px]"
                    >
                      😂
                    </span>
                    <span
                      onClick={() => handleEmojiClick("🔥")}
                      className="text-[24px]"
                    >
                      🔥
                    </span>
                    <span
                      onClick={() => handleEmojiClick("😭")}
                      className="text-[24px]"
                    >
                      😭
                    </span>
                    <span
                      onClick={() => handleEmojiClick("🤩")}
                      className="text-[24px]"
                    >
                      🤩
                    </span>
                    <span
                      onClick={() => handleEmojiClick("🤮")}
                      className="text-[24px]"
                    >
                      🤮
                    </span>
                  </div>
                </div>
              </div>
            )}
            <svg
              onClick={toggleEmojiPanel}
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M10.5425 19.3652C8.22184 19.3652 5.99624 18.4434 4.3553 16.8024C2.71435 15.1615 1.79248 12.9359 1.79248 10.6152C1.79248 8.29459 2.71435 6.06899 4.3553 4.42805C5.99624 2.78711 8.22184 1.86523 10.5425 1.86523C12.8631 1.86523 15.0887 2.78711 16.7297 4.42805C18.3706 6.06899 19.2925 8.29459 19.2925 10.6152C19.2925 12.9359 18.3706 15.1615 16.7297 16.8024C15.0887 18.4434 12.8631 19.3652 10.5425 19.3652ZM10.5425 20.6152C13.1946 20.6152 15.7382 19.5617 17.6135 17.6863C19.4889 15.8109 20.5425 13.2674 20.5425 10.6152C20.5425 7.96307 19.4889 5.41953 17.6135 3.54417C15.7382 1.6688 13.1946 0.615234 10.5425 0.615234C7.89032 0.615234 5.34678 1.6688 3.47141 3.54417C1.59605 5.41953 0.54248 7.96307 0.54248 10.6152C0.54248 13.2674 1.59605 15.8109 3.47141 17.6863C5.34678 19.5617 7.89032 20.6152 10.5425 20.6152Z"
                fill="black"
              />
              <path
                d="M5.89891 12.574C6.04246 12.4911 6.21305 12.4686 6.37316 12.5115C6.53327 12.5544 6.66978 12.6592 6.75266 12.8027C7.13655 13.4682 7.68897 14.0207 8.35432 14.4047C9.01966 14.7887 9.77444 14.9907 10.5427 14.9902C11.3109 14.9907 12.0657 14.7887 12.731 14.4047C13.3963 14.0207 13.9488 13.4682 14.3327 12.8027C14.3734 12.7311 14.4279 12.6682 14.493 12.6177C14.5582 12.5672 14.6327 12.5301 14.7122 12.5085C14.7918 12.4869 14.8748 12.4812 14.9565 12.4919C15.0383 12.5025 15.1171 12.5292 15.1885 12.5704C15.2599 12.6116 15.3224 12.6665 15.3725 12.732C15.4225 12.7975 15.4592 12.8722 15.4802 12.9519C15.5013 13.0316 15.5064 13.1146 15.4952 13.1963C15.4841 13.278 15.4568 13.3566 15.4152 13.4277C14.9216 14.2832 14.2113 14.9935 13.356 15.4872C12.5006 15.981 11.5303 16.2407 10.5427 16.2402C9.55503 16.2407 8.5847 15.981 7.72934 15.4872C6.87397 14.9935 6.16376 14.2832 5.67016 13.4277C5.58728 13.2842 5.56482 13.1136 5.60772 12.9535C5.65062 12.7934 5.75536 12.6569 5.89891 12.574ZM9.29266 8.74023C9.29266 9.77523 8.73266 10.6152 8.04266 10.6152C7.35266 10.6152 6.79266 9.77523 6.79266 8.74023C6.79266 7.70523 7.35266 6.86523 8.04266 6.86523C8.73266 6.86523 9.29266 7.70523 9.29266 8.74023ZM14.2927 8.74023C14.2927 9.77523 13.7327 10.6152 13.0427 10.6152C12.3527 10.6152 11.7927 9.77523 11.7927 8.74023C11.7927 7.70523 12.3527 6.86523 13.0427 6.86523C13.7327 6.86523 14.2927 7.70523 14.2927 8.74023Z"
                fill="black"
              />
            </svg>
          </div>
          <svg
            onClick={toggleOverlay}
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M4.02734 3.74023C4.02734 2.91143 4.35658 2.11658 4.94264 1.53053C5.52869 0.944474 6.32354 0.615234 7.15234 0.615234C7.98115 0.615234 8.776 0.944474 9.36205 1.53053C9.9481 2.11658 10.2773 2.91143 10.2773 3.74023C10.2773 2.91143 10.6066 2.11658 11.1926 1.53053C11.7787 0.944474 12.5735 0.615234 13.4023 0.615234C14.2311 0.615234 15.026 0.944474 15.6121 1.53053C16.1981 2.11658 16.5273 2.91143 16.5273 3.74023V3.74773C16.5273 3.83523 16.5273 4.08523 16.4798 4.36523H19.0273C19.3589 4.36523 19.6768 4.49693 19.9112 4.73135C20.1456 4.96577 20.2773 5.28371 20.2773 5.61523V8.11523C20.2773 8.44675 20.1456 8.7647 19.9112 8.99912C19.6768 9.23354 19.3589 9.36523 19.0273 9.36523V18.7402C19.0273 19.2375 18.8298 19.7144 18.4782 20.0661C18.1265 20.4177 17.6496 20.6152 17.1523 20.6152H3.40234C2.90506 20.6152 2.42815 20.4177 2.07652 20.0661C1.72489 19.7144 1.52734 19.2375 1.52734 18.7402V9.36523C1.19582 9.36523 0.877881 9.23354 0.64346 8.99912C0.40904 8.7647 0.277344 8.44675 0.277344 8.11523V5.61523C0.277344 5.28371 0.40904 4.96577 0.64346 4.73135C0.877881 4.49693 1.19582 4.36523 1.52734 4.36523H4.07484C4.04183 4.16108 4.02594 3.95453 4.02734 3.74773V3.74023ZM5.36234 4.36523H9.02734V3.74023C9.02734 3.49401 8.97885 3.25019 8.88462 3.0227C8.79039 2.79522 8.65228 2.58852 8.47817 2.41441C8.30406 2.2403 8.09736 2.10219 7.86987 2.00796C7.64239 1.91373 7.39857 1.86523 7.15234 1.86523C6.90612 1.86523 6.6623 1.91373 6.43481 2.00796C6.20733 2.10219 6.00063 2.2403 5.82652 2.41441C5.65241 2.58852 5.5143 2.79522 5.42007 3.0227C5.32584 3.25019 5.27734 3.49401 5.27734 3.74023C5.27734 3.84648 5.27984 4.08273 5.33359 4.27773C5.3411 4.30754 5.35071 4.33678 5.36234 4.36523ZM11.5273 4.36523H15.1923C15.2038 4.33673 15.2134 4.3075 15.2211 4.27773C15.2748 4.08273 15.2773 3.84648 15.2773 3.74023C15.2773 3.24295 15.0798 2.76604 14.7282 2.41441C14.3765 2.06278 13.8996 1.86523 13.4023 1.86523C12.9051 1.86523 12.4281 2.06278 12.0765 2.41441C11.7249 2.76604 11.5273 3.24295 11.5273 3.74023V4.36523ZM1.52734 5.61523V8.11523H9.02734V5.61523H1.52734ZM11.5273 5.61523V8.11523H19.0273V5.61523H11.5273ZM17.7773 9.36523H11.5273V19.3652H17.1523C17.3181 19.3652 17.4771 19.2994 17.5943 19.1822C17.7115 19.065 17.7773 18.906 17.7773 18.7402V9.36523ZM9.02734 19.3652V9.36523H2.77734V18.7402C2.77734 18.906 2.84319 19.065 2.9604 19.1822C3.07761 19.2994 3.23658 19.3652 3.40234 19.3652H9.02734Z"
              fill="black"
            />
          </svg>
        </div>
        <div className="flex flex-row gap-[30px]">
          <Link href={getRemixUrl()}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0.277344 4.88428C0.277344 4.71852 0.343192 4.55955 0.460402 4.44234C0.577612 4.32513 0.736583 4.25928 0.902344 4.25928H1.52734C4.27984 4.25928 6.31109 5.80928 7.61984 7.28178C8.23234 7.97178 8.70109 8.65928 9.02734 9.19678C9.35234 8.65928 9.82234 7.97178 10.4348 7.28178C11.7436 5.80928 13.7748 4.25928 16.5273 4.25928V5.50928C14.2798 5.50928 12.5611 6.77178 11.3698 8.11178C10.7257 8.84136 10.1725 9.64641 9.72234 10.5093C10.1721 11.3721 10.7249 12.1771 11.3686 12.9068C12.5623 14.2468 14.2823 15.5093 16.5273 15.5093V16.7593C13.7748 16.7593 11.7436 15.2093 10.4348 13.7368C9.90924 13.1419 9.43817 12.501 9.02734 11.8218C8.70234 12.3593 8.23234 13.0468 7.61984 13.7368C6.31109 15.2093 4.27984 16.7593 1.52734 16.7593H0.902344C0.736583 16.7593 0.577612 16.6934 0.460402 16.5762C0.343192 16.459 0.277344 16.3 0.277344 16.1343C0.277344 15.9685 0.343192 15.8095 0.460402 15.6923C0.577612 15.5751 0.736583 15.5093 0.902344 15.5093H1.52734C3.77484 15.5093 5.49359 14.2468 6.68484 12.9068C7.32897 12.1772 7.88218 11.3721 8.33234 10.5093C7.88257 9.64648 7.32978 8.84143 6.68609 8.11178C5.49234 6.77178 3.77234 5.50928 1.52734 5.50928H0.902344C0.736583 5.50928 0.577612 5.44343 0.460402 5.32622C0.343192 5.20901 0.277344 5.05004 0.277344 4.88428Z"
                fill="black"
              />
              <path
                d="M16.5273 7.34189V2.42689C16.5274 2.36751 16.5443 2.30936 16.5762 2.25926C16.6081 2.20916 16.6535 2.16918 16.7073 2.144C16.7611 2.11881 16.8209 2.10947 16.8798 2.11707C16.9387 2.12466 16.9942 2.14888 17.0398 2.18689L19.9898 4.64439C20.1398 4.76939 20.1398 4.99938 19.9898 5.12438L17.0398 7.58189C16.9942 7.61989 16.9387 7.6441 16.8798 7.6517C16.8209 7.6593 16.7611 7.64996 16.7073 7.62477C16.6535 7.59959 16.6081 7.55961 16.5762 7.50951C16.5443 7.45941 16.5274 7.40126 16.5273 7.34189ZM16.5273 18.5919V13.6769C16.5274 13.6175 16.5443 13.5594 16.5762 13.5093C16.6081 13.4592 16.6535 13.4192 16.7073 13.394C16.7611 13.3688 16.8209 13.3595 16.8798 13.3671C16.9387 13.3747 16.9942 13.3989 17.0398 13.4369L19.9898 15.8944C20.1398 16.0194 20.1398 16.2494 19.9898 16.3744L17.0398 18.8319C16.9942 18.8699 16.9387 18.8941 16.8798 18.9017C16.8209 18.9093 16.7611 18.9 16.7073 18.8748C16.6535 18.8496 16.6081 18.8096 16.5762 18.7595C16.5443 18.7094 16.5274 18.6513 16.5273 18.5919Z"
                fill="black"
              />
            </svg>
          </Link>

          <svg
            onClick={toggleRemixed}
            xmlns="http://www.w3.org/2000/svg"
            width="21"
            height="21"
            viewBox="0 0 21 21"
            fill="none"
          >
            <path
              d="M0.542969 1.75928C0.542969 1.42776 0.674665 1.10981 0.909085 0.875394C1.14351 0.640973 1.46145 0.509277 1.79297 0.509277L8.04297 0.509277C8.37449 0.509277 8.69243 0.640973 8.92685 0.875394C9.16127 1.10981 9.29297 1.42776 9.29297 1.75928V19.2593C9.29297 19.5908 9.16127 19.9087 8.92685 20.1432C8.69243 20.3776 8.37449 20.5093 8.04297 20.5093H1.79297C1.46145 20.5093 1.14351 20.3776 0.909085 20.1432C0.674665 19.9087 0.542969 19.5908 0.542969 19.2593V1.75928ZM11.793 1.75928C11.793 1.42776 11.9247 1.10981 12.1591 0.875394C12.3935 0.640973 12.7114 0.509277 13.043 0.509277L19.293 0.509277C19.6245 0.509277 19.9424 0.640973 20.1769 0.875394C20.4113 1.10981 20.543 1.42776 20.543 1.75928V8.00928C20.543 8.3408 20.4113 8.65874 20.1769 8.89316C19.9424 9.12758 19.6245 9.25928 19.293 9.25928H13.043C12.7114 9.25928 12.3935 9.12758 12.1591 8.89316C11.9247 8.65874 11.793 8.3408 11.793 8.00928V1.75928ZM11.793 13.0093C11.793 12.6778 11.9247 12.3598 12.1591 12.1254C12.3935 11.891 12.7114 11.7593 13.043 11.7593H19.293C19.6245 11.7593 19.9424 11.891 20.1769 12.1254C20.4113 12.3598 20.543 12.6778 20.543 13.0093V19.2593C20.543 19.5908 20.4113 19.9087 20.1769 20.1432C19.9424 20.3776 19.6245 20.5093 19.293 20.5093H13.043C12.7114 20.5093 12.3935 20.3776 12.1591 20.1432C11.9247 19.9087 11.793 19.5908 11.793 19.2593V13.0093Z"
              fill={showRemixed ? "#FFC022" : "black"}
            />
          </svg>
        </div>
      </div>
      {showComments && <Comments initialComments={comments} />}
      {showRemixed && <Remixed remixId={remixid} currentPostId={id} />}
      {overlayVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white h-[214px] w-[370px] rounded-[8px] p-[13px]">
            <div className="flex justify-between">
              <div className="flex items-center  gap-[8px]">
                <svg
                  onClick={toggleOverlay}
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="17"
                  viewBox="0 0 17 17"
                  fill="none"
                >
                  <path
                    d="M3.58008 3.35547C3.58008 2.69243 3.84347 2.05654 4.31231 1.5877C4.78115 1.11886 5.41704 0.855469 6.08008 0.855469C6.74312 0.855469 7.379 1.11886 7.84785 1.5877C8.31669 2.05654 8.58008 2.69243 8.58008 3.35547C8.58008 2.69243 8.84347 2.05654 9.31231 1.5877C9.78115 1.11886 10.417 0.855469 11.0801 0.855469C11.7431 0.855469 12.379 1.11886 12.8478 1.5877C13.3167 2.05654 13.5801 2.69243 13.5801 3.35547V3.36147C13.5801 3.43147 13.5801 3.63147 13.5421 3.85547H15.5801C15.8453 3.85547 16.0996 3.96083 16.2872 4.14836C16.4747 4.3359 16.5801 4.59025 16.5801 4.85547V6.85547C16.5801 7.12069 16.4747 7.37504 16.2872 7.56258C16.0996 7.75011 15.8453 7.85547 15.5801 7.85547V15.3555C15.5801 15.7533 15.422 16.1348 15.1407 16.4161C14.8594 16.6974 14.4779 16.8555 14.0801 16.8555H3.08008C2.68225 16.8555 2.30072 16.6974 2.01942 16.4161C1.73811 16.1348 1.58008 15.7533 1.58008 15.3555V7.85547C1.31486 7.85547 1.06051 7.75011 0.872971 7.56258C0.685435 7.37504 0.580078 7.12069 0.580078 6.85547V4.85547C0.580078 4.59025 0.685435 4.3359 0.872971 4.14836C1.06051 3.96083 1.31486 3.85547 1.58008 3.85547H3.61808C3.59167 3.69215 3.57895 3.52691 3.58008 3.36147V3.35547ZM4.64808 3.85547H7.58008V3.35547C7.58008 3.15849 7.54128 2.96343 7.4659 2.78144C7.39052 2.59946 7.28003 2.4341 7.14074 2.29481C7.00145 2.15552 6.83609 2.04503 6.6541 1.96965C6.47212 1.89427 6.27706 1.85547 6.08008 1.85547C5.8831 1.85547 5.68804 1.89427 5.50605 1.96965C5.32406 2.04503 5.15871 2.15552 5.01942 2.29481C4.88013 2.4341 4.76964 2.59946 4.69426 2.78144C4.61888 2.96343 4.58008 3.15849 4.58008 3.35547C4.58008 3.44047 4.58208 3.62947 4.62508 3.78547C4.63109 3.80931 4.63877 3.83271 4.64808 3.85547ZM9.58008 3.85547H12.5121C12.5213 3.83267 12.529 3.80928 12.5351 3.78547C12.5781 3.62947 12.5801 3.44047 12.5801 3.35547C12.5801 2.95764 12.422 2.57611 12.1407 2.29481C11.8594 2.0135 11.4779 1.85547 11.0801 1.85547C10.6823 1.85547 10.3007 2.0135 10.0194 2.29481C9.73811 2.57611 9.58008 2.95764 9.58008 3.35547V3.85547ZM1.58008 4.85547V6.85547H7.58008V4.85547H1.58008ZM9.58008 4.85547V6.85547H15.5801V4.85547H9.58008ZM14.5801 7.85547H9.58008V15.8555H14.0801C14.2127 15.8555 14.3399 15.8028 14.4336 15.709C14.5274 15.6153 14.5801 15.4881 14.5801 15.3555V7.85547ZM7.58008 15.8555V7.85547H2.58008V15.3555C2.58008 15.4881 2.63276 15.6153 2.72652 15.709C2.82029 15.8028 2.94747 15.8555 3.08008 15.8555H7.58008Z"
                    fill="#262626"
                  />
                </svg>
                <p className="text-[16px] font-[600]">Send a gift</p>
              </div>
              <svg
                onClick={toggleOverlay}
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <path
                  d="M2.22931 2.66076C2.41684 2.47329 2.67115 2.36797 2.93631 2.36797C3.20147 2.36797 3.45578 2.47329 3.64331 2.66076L8.93631 7.95376L14.2293 2.66076C14.3216 2.56525 14.4319 2.48906 14.5539 2.43666C14.6759 2.38425 14.8071 2.35666 14.9399 2.35551C15.0727 2.35435 15.2044 2.37965 15.3273 2.42994C15.4502 2.48022 15.5618 2.55447 15.6557 2.64836C15.7496 2.74225 15.8238 2.85391 15.8741 2.9768C15.9244 3.0997 15.9497 3.23138 15.9486 3.36416C15.9474 3.49694 15.9198 3.62816 15.8674 3.75016C15.815 3.87217 15.7388 3.98251 15.6433 4.07476L10.3503 9.36776L15.6433 14.6608C15.8255 14.8494 15.9263 15.102 15.924 15.3642C15.9217 15.6264 15.8165 15.8772 15.6311 16.0626C15.4457 16.248 15.1949 16.3532 14.9327 16.3554C14.6705 16.3577 14.4179 16.2569 14.2293 16.0748L8.93631 10.7818L3.64331 16.0748C3.45471 16.2569 3.20211 16.3577 2.93991 16.3554C2.67771 16.3532 2.4269 16.248 2.24149 16.0626C2.05608 15.8772 1.95091 15.6264 1.94864 15.3642C1.94636 15.102 2.04715 14.8494 2.22931 14.6608L7.52231 9.36776L2.22931 4.07476C2.04184 3.88723 1.93652 3.63292 1.93652 3.36776C1.93652 3.10259 2.04184 2.84828 2.22931 2.66076Z"
                  fill="#262626"
                />
              </svg>
            </div>
            <p className="text-[12px] mt-[25px] mb-[14px]">How many coins?</p>
            <div className="flex flex-row gap-[12px] h-[40px] rounded-[6px] p-[7px] w-full border-black border-[0.5px]">
              <img className="" src="/icons/coin.svg" alt="" />
              <input
                type="number"
                className="border border-none outline-none"
                name=""
                id=""
              />
            </div>
            <div className="flex w-full justify-end mt-[29px]">
              <button
                onClick={toggleOverlay}
                className="bg-primary text-black h-[40px] w-full rounded-[8px]"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {attestationVisible && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="relative bg-white h-[217px] w-[370px] rounded-[8px] py-[13px] px-[18px]">
            <div className="flex justify-between mb-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M12.0844 0.224609L14.5879 1.52061L17.3749 1.94361L18.6379 4.46361L20.6434 6.44361L20.1844 9.22461L20.6434 12.0056L18.6379 13.9856L17.3749 16.5056L14.5879 16.9286L12.0844 18.2246L9.58089 16.9286L6.79389 16.5056L5.53089 13.9856L3.52539 12.0056L3.98439 9.22461L3.52539 6.44361L5.53089 4.46361L6.79389 1.94361L9.58089 1.52061L12.0844 0.224609Z"
                  fill="#1E09AE"
                />
                <path
                  d="M6.08398 17.916V24.225L12.084 22.725L18.084 24.225V17.916L15.057 18.375L12.084 19.914L9.11098 18.375L6.08398 17.916Z"
                  fill="#1E09AE"
                />
              </svg>
              <svg
                onClick={toggleAttestation}
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
              >
                <path
                  d="M2.22931 2.66076C2.41684 2.47329 2.67115 2.36797 2.93631 2.36797C3.20147 2.36797 3.45578 2.47329 3.64331 2.66076L8.93631 7.95376L14.2293 2.66076C14.3216 2.56525 14.4319 2.48906 14.5539 2.43666C14.6759 2.38425 14.8071 2.35666 14.9399 2.35551C15.0727 2.35435 15.2044 2.37965 15.3273 2.42994C15.4502 2.48022 15.5618 2.55447 15.6557 2.64836C15.7496 2.74225 15.8238 2.85391 15.8741 2.9768C15.9244 3.0997 15.9497 3.23138 15.9486 3.36416C15.9474 3.49694 15.9198 3.62816 15.8674 3.75016C15.815 3.87217 15.7388 3.98251 15.6433 4.07476L10.3503 9.36776L15.6433 14.6608C15.8255 14.8494 15.9263 15.102 15.924 15.3642C15.9217 15.6264 15.8165 15.8772 15.6311 16.0626C15.4457 16.248 15.1949 16.3532 14.9327 16.3554C14.6705 16.3577 14.4179 16.2569 14.2293 16.0748L8.93631 10.7818L3.64331 16.0748C3.45471 16.2569 3.20211 16.3577 2.93991 16.3554C2.67771 16.3532 2.4269 16.248 2.24149 16.0626C2.05608 15.8772 1.95091 15.6264 1.94864 15.3642C1.94636 15.102 2.04715 14.8494 2.22931 14.6608L7.52231 9.36776L2.22931 4.07476C2.04184 3.88723 1.93652 3.63292 1.93652 3.36776C1.93652 3.10259 2.04184 2.84828 2.22931 2.66076Z"
                  fill="#262626"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="text-black text-[12px]">{username}</p>
              <a
                href="https://testnet-scan.sign.global/attestation/SPA_Rwggo7RQqdrhwiXVrurb-"
                target="_blank"
                rel="noreferrer"
                className="flex flex-row items-center gap-[4px] text-blue-500 hover:text-blue-600 text-[12px]"
              >
                view attestation
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M7.24995 2.67383C7.24995 2.57437 7.21044 2.47899 7.14011 2.40866C7.06979 2.33834 6.97441 2.29883 6.87495 2.29883H1.89795C1.59958 2.29883 1.31343 2.41735 1.10245 2.62833C0.891476 2.83931 0.772949 3.12546 0.772949 3.42383L0.772949 10.9238C0.772949 11.2222 0.891476 11.5083 1.10245 11.7193C1.31343 11.9303 1.59958 12.0488 1.89795 12.0488H9.39795C9.69632 12.0488 9.98247 11.9303 10.1934 11.7193C10.4044 11.5083 10.5229 11.2222 10.5229 10.9238V5.94683C10.5229 5.84737 10.4834 5.75199 10.4131 5.68166C10.3428 5.61134 10.2474 5.57183 10.1479 5.57183C10.0485 5.57183 9.95311 5.61134 9.88278 5.68166C9.81246 5.75199 9.77295 5.84737 9.77295 5.94683V10.9238C9.77295 11.0233 9.73344 11.1187 9.66311 11.189C9.59279 11.2593 9.49741 11.2988 9.39795 11.2988H1.89795C1.79849 11.2988 1.70311 11.2593 1.63278 11.189C1.56246 11.1187 1.52295 11.0233 1.52295 10.9238V3.42383C1.52295 3.32437 1.56246 3.22899 1.63278 3.15866C1.70311 3.08834 1.79849 3.04883 1.89795 3.04883H6.87495C6.97441 3.04883 7.06979 3.00932 7.14011 2.93899C7.21044 2.86867 7.24995 2.77328 7.24995 2.67383Z"
                    fill="black"
                  />
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12.7729 0.423828C12.7729 0.324372 12.7334 0.228989 12.6631 0.158663C12.5928 0.0883369 12.4974 0.0488281 12.3979 0.0488281L8.64793 0.0488281C8.54848 0.0488281 8.4531 0.0883369 8.38277 0.158663C8.31244 0.228989 8.27293 0.324372 8.27293 0.423828C8.27293 0.523284 8.31244 0.618667 8.38277 0.688993C8.4531 0.759319 8.54848 0.798828 8.64793 0.798828H11.4927L5.38243 6.90833C5.34757 6.94319 5.31991 6.98459 5.30104 7.03014C5.28217 7.0757 5.27246 7.12452 5.27246 7.17383C5.27246 7.22314 5.28217 7.27196 5.30104 7.31752C5.31991 7.36307 5.34757 7.40446 5.38243 7.43933C5.4173 7.47419 5.45869 7.50185 5.50425 7.52072C5.5498 7.53959 5.59863 7.5493 5.64793 7.5493C5.69724 7.5493 5.74607 7.53959 5.79162 7.52072C5.83718 7.50185 5.87857 7.47419 5.91343 7.43933L12.0229 1.32908V4.17383C12.0229 4.27328 12.0624 4.36867 12.1328 4.43899C12.2031 4.50932 12.2985 4.54883 12.3979 4.54883C12.4974 4.54883 12.5928 4.50932 12.6631 4.43899C12.7334 4.36867 12.7729 4.27328 12.7729 4.17383V0.423828Z"
                    fill="black"
                  />
                </svg>
              </a>
              <div className="flex flex-row items-center gap-[8px] mt-[16px]">
                <img
                  className="border border-black rounded-[2px] rounded-4 w-[40px] h-[40px]"
                  src={src}
                />
                <div>
                  <div className="text-[14px] w-[297px]">
                    {title}/{" "}
                    <span className="text-[14px] text-secondary font-[700]">
                      {tag}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-black opacity-70 mt-[12px]">
                prompt:
              </p>
              <p className="text-[#000] text-[12px] w-[198px]">
                a sushi made of eyes and other body parts on it
              </p>
              <span className="absolute text-black text-opacity-60 text-[10px] bottom-[13px] right-[13px]">
                18th april, 2:30PM
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
