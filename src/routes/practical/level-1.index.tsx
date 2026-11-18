import { createFileRoute, Link } from "@tanstack/react-router";
import { Bot, Car, Cog, Hand, HandMetal, Lightbulb, MonitorPlay, Orbit, PawPrint, Puzzle, Radar, ScanEye, Shapes, Truck, type LucideIcon } from "lucide-react";
import { LEVEL_ONE_CATEGORIES, type LevelOneCategory } from "@/data/levelOneCategories";
import { getLevelOneProjects } from "@/data/levelOneProjects";
import { CategoryCard, ResponsiveCategories } from "@/components/practical/ResponsiveCategories";

export const Route = createFileRoute("/practical/level-1/")({ component: LevelOneCategoriesPage });
const icons: Record<LevelOneCategory["icon"],LucideIcon> = {
 radar:Radar,paw:PawPrint,shapes:Shapes,"monitor-play":MonitorPlay,bot:Bot,lightbulb:Lightbulb,hand:Hand,cog:Cog,"hand-metal":HandMetal,orbit:Orbit,puzzle:Puzzle,"scan-eye":ScanEye,truck:Truck,car:Car,
};
function LevelOneCategoriesPage() {
 return <ResponsiveCategories level={1} categories={LEVEL_ONE_CATEGORIES.map((category,index)=>({
   id:category.id,name:category.name,count:getLevelOneProjects(category.id).length,icon:icons[category.icon],
   href:<Link to="/practical/level-1/$categoryId" params={{categoryId:category.id}} aria-label={`Explore ${category.name}`} className="block h-full focus-visible:outline-2 focus-visible:outline-sky-500"><CategoryCard name={category.name} count={getLevelOneProjects(category.id).length} icon={icons[category.icon]} index={index}/></Link>
 }))}/>;
}
