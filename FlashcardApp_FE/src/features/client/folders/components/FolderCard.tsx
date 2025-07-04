import { FolderTypes as FolderTypes } from "@/types/folder.types";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Globe, Lock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash } from "lucide-react";
import FolderDeleteDialog from "./FolderDeleteDialog";
import FolderUpdateInfoDialog from "./FolderUpdateInfoDialog";
import FolderShareDialog from "./FolderShareDialog";

interface FolderCardDropdownMenuProps {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
}

export function FolderCardDropdownMenu({ slug, name, description, tags, isPublic }: FolderCardDropdownMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-primary/20 -mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-transparent transition-all duration-200 hover:ml-2">
        <EllipsisVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-popover mt-2 flex flex-col rounded-xl border border-transparent shadow-lg">
        <FolderUpdateInfoDialog
          slug={slug}
          name={name}
          description={description}
          tags={tags}
          isPublic={isPublic}
        />
        <FolderShareDialog slug={slug} name={name} description={description || ""} tags={tags || []} isPublic={isPublic} />
        <FolderDeleteDialog
          trigger={
            <Button variant="ghost" className="hover:bg-destructive/15 justify-start rounded-lg bg-transparent">
              <Trash className="text-destructive" />
              <p className="text-destructive">Delete</p>
            </Button>
          }
          slug={slug}
          name={name}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FolderCard({ folder }: { folder: FolderTypes }) {
  return (
    <div className="group relative w-full perspective-[1000px]">
      {/* Folder tab */}
      <div className="bg-card border-border/50 absolute -top-6 z-10 h-12 w-28 rounded-t-lg border shadow-md"></div>

      {/* Main folder body with 3D hover effect */}
      <div className="bg-card text-card-foreground border-border/50 relative z-30 flex w-full transform flex-col justify-between rounded-xl border shadow-md transition-all duration-300 ease-in-out group-hover:-rotate-x-15 group-hover:shadow-xl">
        <Link to={`/folders/${folder.slug}`} className="flex flex-grow flex-col gap-4 px-4 pt-4 pb-4" title={folder.name}>
          <div className="flex flex-col overflow-hidden">
            <Button variant="link" className="text-foreground -ml-4 w-full cursor-pointer justify-start text-lg font-medium">
              <div className="block truncate overflow-hidden">{folder.name}</div>
            </Button>
            <div className="line-clamp-2 truncate overflow-hidden">
              {folder.description ? folder.description : <p className="text-muted-foreground">No description</p>}
            </div>
          </div>
        </Link>
        <div className="flex flex-wrap items-end justify-between gap-4 p-4">
          <Link to={`/folders/${folder.slug}`} className="flex flex-shrink-0 gap-2">
            <Badge variant="default" title="Flashcards in this folder" className="text-white">
              {folder.flashcardCount > 2 ? folder.flashcardCount + " flashcards" : folder.flashcardCount + " flashcard"}
            </Badge>
            {folder.isPublic ? (
              <Badge variant="secondary" className="bg-green-200 dark:bg-green-700 text-green-800 dark:text-green-200" title="Public folder">
                <Globe />
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200" title="Private folder">
                <Lock />
              </Badge>
            )}
          </Link>
          <div className="flex items-center justify-between">
            <Button
              className="hover:bg-accent/80 bg-accent text-accent-foreground justify-start rounded-xl shadow-sm hover:scale-105"
              onClick={() => (window.location.href = `/folders/${folder.slug}/study`)}
            >
              <GraduationCap className="h-4 w-4" />
              Study
            </Button>
            <FolderCardDropdownMenu slug={folder.slug} name={folder.name} description={folder.description || ""} tags={folder.tags || []} isPublic={folder.isPublic || false} />
          </div>
        </div>
      </div>

      {/* Paper inside the folder */}
      <div className="absolute top-0 right-0 left-0 z-20 mx-auto h-32 w-[90%] translate-y-2 scale-[.98] rounded-md bg-gray-200 shadow-sm transition-all duration-300 ease-in-out group-hover:-translate-y-3" />
    </div>
  );
}
