import Image from "next/image";

interface Props {
  image: string;
  title: string;
  value: string | number;
}
export default function StatsCard({ image, title, value }: Props) {
  return (
    <div className="px-5 py-2.5 flex gap-3 items-center rounded-lg bg-light800_dark200 flex-1">
      <Image
        src={image}
        alt={title}
        width={50}
        height={50}
      />
      <div>
        <p>{title}</p>
        <p>{value}</p>
      </div>
    </div>
  );
}
