import Link from "next/link";

type Props = {
  title: string;
  active?: boolean;
  link?: string;
};

export default function SidebarItem({
  title,
  active = false,
  link,
}: Props) {
  const className = `flex w-full items-center rounded-2xl px-4 py-3 text-sm font-medium transition
      ${
        active
          ? "bg-blue-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-100"
      }`;
  return link ? (
    <Link href={link} className={className}>
      {title}
    </Link>
  ) : (
    <div className={className}>{title}</div>
  );
}