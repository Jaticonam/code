import BlogHub from "@/modules/blog/components/BlogHub";
import BlogGuidesLayout from "@/modules/blog/components/BlogGuidesLayout";
import "@/shared/styles/blog/pages/blog-guides.css";

export default function BlogSectionPage() {
  const { pathname } = useLocation();

  if (pathname === "/blog/guias") return <BlogGuidesLayout />;

  return <BlogHub />;
}
