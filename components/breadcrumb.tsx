interface BreadcrumbProps {
  nama: string
}

export default function Breadcrumb({ nama }: BreadcrumbProps) {
  return (
    <nav className="py-5 text-sm text-[#6E5849]">
      <div className="container mx-auto px-5 max-w-6xl">
        <a href="#" className="text-inherit no-underline">
          Home
        </a>{" "}
        &gt;{" "}
        <a href="#" className="text-inherit no-underline">
          Jelajah
        </a>{" "}
        &gt; <span>{nama}</span>
      </div>
    </nav>
  )
}
