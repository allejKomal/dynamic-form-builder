import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Calendar,
  FileText,
  Settings,
  Users,
  ToggleLeft,
  Layers,
} from "lucide-react";
import PageWrapper from "@/components/page-wrapper";

// Define a type for the routes
type Route = {
  name: string;
  url: string;
};

// Define the routes array with specific types
const routes: Route[] = [
  { name: "Basic Form", url: "basic-form" },
  { name: "Example-01", url: "example-one" },
  { name: "Conditional Form", url: "conditional-form" },
  { name: "Repeating Group Form", url: "repeating-group-form" },
];

// Define the mapping of route names to icons with the correct type
const routeIcons: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {
  dashboard: BarChart3,
  calendar: Calendar,
  reports: FileText,
  settings: Settings,
  users: Users,
  "Basic Form": FileText,
  "Example-01": BarChart3,
  "Conditional Form": ToggleLeft,
  "Repeating Group Form": Layers,
};

// Define the mapping of route names to color classes
const iconColors: Record<string, string> = {
  dashboard: "bg-blue-500 text-white",
  calendar: "bg-green-500 text-white",
  reports: "bg-yellow-500 text-white",
  settings: "bg-gray-500 text-white",
  users: "bg-teal-500 text-white",
};

 const renderComponentGrid = (components: Route[]) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {components
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((route, index) => {
          const IconComponent = routeIcons[route.name] || BarChart3;
          const colorClasses =
            iconColors[route.name] ||
            "bg-muted text-muted-foreground dark:bg-muted dark:text-muted-foreground";

          return (
            <Link
              key={index}
              href={route.url}
              className="group p-4 rounded-lg border bg-card hover:bg-accent hover:shadow-lg transform-gpu transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-md transition-all duration-300 ${colorClasses} group-hover:scale-105`}
                >
                  <IconComponent className="w-5 h-5 transition-transform duration-300" />
                </div>
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground capitalize transition-colors duration-300">
                    {route.name.replace("-", " ")}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default function Home() {
  return (
    <PageWrapper
      title="Component Library"
      description="A collection of reusable UI components and layouts"
      showFooter
    >
      <div className="container mx-auto px-6 py-10">
        <div className="mx-auto space-y-12">
          {routes.length > 0 && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  UI Components
                </h2>
                <p className="text-muted-foreground">
                  Essential UI components for building modern interfaces
                </p>
              </div>
              {renderComponentGrid(routes)}
            </div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
