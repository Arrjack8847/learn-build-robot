import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Cog, Hand, Lightbulb, MonitorPlay, PawPrint, Puzzle, Radar, Truck, type LucideIcon } from "lucide-react";
import { getAdvancedLevel } from "@/data/advancedSyllabus";
import { CategoryCard, ResponsiveCategories } from "@/components/practical/ResponsiveCategories";

export const Route = createFileRoute("/practical/levels/$levelNumber/")({component: AdvancedLevelCategoriesPage});
function iconFor(name:string):LucideIcon {
 if(/biomimicry/i.test(name))return PawPrint;
 if(/vehicle|navigation/i.test(name))return Truck;
 if(/sensor|automation|security/i.test(name))return Radar;
 if(/illumination|signal|display/i.test(name))return Lightbulb;
 if(/interactive|manipulator/i.test(name))return Hand;
 if(/programming|control/i.test(name))return MonitorPlay;
 if(/mechanism|machine|construction/i.test(name))return Cog;
 return Bot;
}
function AdvancedLevelCategoriesPage() {
 const {levelNumber}=Route.useParams();
 const level=Number(levelNumber);
 const categories=getAdvancedLevel(level);
 if(!categories.length)return <div className="grid min-h-[100dvh] place-items-center"><div className="text-center"><Puzzle className="mx-auto size-10"/><h1 className="mt-3 text-2xl font-bold">This level isn't available.</h1><Link to="/practical/levels" className="mt-3 inline-block text-sky-700">Choose a level</Link></div></div>;
 return <ResponsiveCategories level={level} categories={categories.map((category,index)=>({
  id:category.id,name:category.name,count:category.entries.length,icon:iconFor(category.name),
  href:<Link to="/practical/levels/$levelNumber/$categoryId" params={{levelNumber,categoryId:category.id}} aria-label={`Explore ${category.name}`} className="block h-full focus-visible:outline-2 focus-visible:outline-sky-500"><CategoryCard name={category.name} count={category.entries.length} icon={iconFor(category.name)} index={index}/></Link>
 }))}/>;
}
