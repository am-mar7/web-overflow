import Image from "next/image";
import Link from "next/link";

interface Props {
  iconUrl?: string;
  href?: string;
  isAuthor?: boolean;
  title?: string;
  value: number | string;
  alt: string;
}
export default function Metric({ iconUrl, href, title, value, alt }: Props) {
  const className = "flex gap-1.5 items-center";
  const content = (
    <>
      {iconUrl && (
        <Image
          src={iconUrl}
          alt={alt}
          width={18}
          height={18}
          className="rounded-full object-contain"
        />
      )}
      <p>
        {value}
        {title && (
          <span className="ml-1 subtle-regular text-light500_dark400">
            {title}
          </span>
        )}
      </p>
    </>
  );
  return href ? (
    <Link className={className} key={alt} href={href}>
      {content}
    </Link>
  ) : (
    <div className={className} key={alt}>
      {content}
    </div>
  );
}
