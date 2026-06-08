import { useLocation } from "react-router-dom";
import BlogHub from "@/modules/blog/components/BlogHub";
import BlogGuidesPage from "@/modules/blog/components/BlogGuidesPage";
import "@/shared/styles/blog/blog-guides.css";

export default function BlogSectionPage() {
  const { pathname } = useLocation();

  if (pathname === "/blog/guias") return <BlogGuidesPage />;

  return <BlogHub />;
}
