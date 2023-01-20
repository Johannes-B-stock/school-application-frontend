import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function SocialButton({
  link,
  text,
  imgSrc,
}: {
  link?: string;
  text?: string;
  imgSrc?: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (!link) {
      return;
    }
    setIsLoading(true);
    router.push(link);
  };

  return (
    <div className="control has-icons-left">
      <button
        className={`button is-light is-fullwidth is-medium ${
          isLoading ? "is-loading" : ""
        }`}
        onClick={handleClick}
      >
        {imgSrc && (
          <span className="icon mx-1 is-left">
            <Image src={imgSrc} alt="" width="27px" height="27px" />
          </span>
        )}
        <span>{text}</span>
      </button>
    </div>
  );
}
