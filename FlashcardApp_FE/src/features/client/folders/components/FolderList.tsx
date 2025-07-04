import { FolderTypes } from "@/types/folder.types";
import FolderCard, { FolderCardDropdownMenu } from "./FolderCard";
import { useGetFolderList } from "../hooks/useGetFolderList";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import FolderDeleteDialog from "./FolderDeleteDialog";
import { GraduationCap, Trash } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";

export function FolderListGridView({ folderList }: { folderList: FolderTypes[] }) {
  const { folderListLoading } = useGetFolderList();
  if (folderListLoading) {
    return <CustomLoader />;
  } else {
    return (
      <div className="mt-6 h-auto w-full">
        <div className="grid w-full min-w-xs grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {folderList.map((folder: FolderTypes) => (
            <FolderCard key={folder.slug} folder={folder} />
          ))}
        </div>
      </div>
    );
  }
}

export function FolderListTableView({ folderList }: { folderList: FolderTypes[] }) {
  const { folderListLoading } = useGetFolderList();
  const isMobile = useIsMobile();
  if (folderListLoading) {
    return <CustomLoader />;
  } else {
    return (
      <Table className="rounded-2xl shadow-lg backdrop-blur-md">
        <TableHeader className="bg-card/80 rounded-t-2xl">
          <TableRow>
            <TableHead className="px-4 font-bold">Folder Name</TableHead>
            <TableHead className="px-4 font-bold">Created At</TableHead>
            <TableHead className="px-4 font-bold">Flashcards Count</TableHead>
            <TableHead className="px-4 font-bold">Public Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-card/30">
          {folderList.map((folder: FolderTypes) => (
            <TableRow key={folder.slug} className="group hover:bg-card/60 border-none transition-colors duration-200">
              <TableCell className="flex min-w-xl flex-1 justify-between px-4">
                <Button
                  variant="link"
                  className="text-foreground h-auto p-0 font-medium transition-colors"
                  onClick={() => (window.location.href = `/folders/${folder?.slug}`)}
                >
                  {folder.name}
                </Button>
                <div className="flex items-center">
                  <Button
                    size="sm"
                    className={`bg-accent hover:bg-accent/60 transform rounded-lg border-0 transition-all duration-200 ${!isMobile && "opacity-0 group-hover:opacity-100"}`}
                    onClick={() => (window.location.href = `/folders/${folder?.slug}/study`)}
                  >
                    <GraduationCap className="h-4 w-4" />
                    Study
                  </Button>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <FolderCardDropdownMenu slug={folder.slug} name={folder.name} description={folder.description || ""} tags={folder.tags || []} isPublic={folder.isPublic || false} />
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4">{new Date(folder.createdAt).toLocaleDateString("en-GB")}</TableCell>
              <TableCell className="px-4">
                <span className="bg-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white">
                  {folder.flashcardCount < 2 ? `${folder.flashcardCount} flashcard` : `${folder.flashcardCount} flashcards`}
                </span>
              </TableCell>
              <TableCell className="px-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${folder.isPublic ? "bg-green-200 text-green-800" : "bg-blue-300 text-blue-800"}`}
                >
                  {folder.isPublic ? "Public" : "Private"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}
