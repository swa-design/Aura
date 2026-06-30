import { useParams } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Placeholder() {
  const params = useParams();
  const pageName = params.page || "Page";

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold mb-2 capitalize">{pageName}</h1>
        <p className="text-foreground/60 mb-8">
          This feature is coming soon. The foundation is ready, and you can help build it out!
        </p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
