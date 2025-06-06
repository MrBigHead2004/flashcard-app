import { useCallback } from "react";
import api from "@/services/api";
import { FolderCreateTypes, FolderTypes, GetAllFoldersResponse, GetFolderFlashcardListResponse } from "@/types/folder.types";

export function useFolderService() {
  const createFolder = useCallback(async (folderData: FolderCreateTypes): Promise<FolderTypes> => {
    try {
      const response = await api.post("/folders", folderData);
      return response.data;
    } catch (error) {
      console.error("Error creating folder:", error);
      throw new Error("Failed to create folder");
    }
  }, []);

  const deleteFolder = useCallback(async (slug: string): Promise<void> => {
    try {
      await api.delete(`/folders/${slug}`);
    } catch (error) {
      console.error("Error deleting folder:", error);
      throw new Error("Failed to delete folder.");
    }
  }, []);

  const getAllFolders = useCallback(async ({
    page,
    limit,
    sort,
    order,
    getAll,
  }: {
    page?: number;
    limit?: number;
    sort?: "createdAt" | "name" | "updatedAt" | "isPublic";
    order?: "asc" | "desc";
    getAll?: boolean;
  }): Promise<GetAllFoldersResponse> => {
    try {
      const response = await api.get(`/folders?page=${page}&limit=${limit}&sort=${sort}&order=${order}&getAll=${getAll}`);
      return response.data;
    } catch (error) {
      console.error("Error getting folders:", error);
      throw new Error("Failed to getting folders");
    }
  }, []);

  const getFolderBySlug = useCallback(async (slug: string): Promise<FolderTypes> => {
    try {
      const response = await api.get(`/folders/${slug}`);
      return response.data;
    } catch (error) {
      console.error("Error getting folder by slug:", error);
      throw new Error("Failed to get folder by slug");
    }
  }, []);

  const getFolderFlashcardList = useCallback(async (slug: string, page?: number, limit?: number): Promise<GetFolderFlashcardListResponse> => {
    page = 1;
    limit = 30;
    try {
      const response = await api.get(`/folders/${slug}/flashcards?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error getting folder flashcard list:", error);
      throw new Error("Failed to get folder flashcard list");
    }
  }, []);

  const addFlashcardToFolder = useCallback(async (folderSlug: string | undefined, flashcardId: string | undefined): Promise<void> => {
    try {
      await api.post(`/folders/${folderSlug}/flashcards`, { flashcardId });
    } catch (error) {
      console.error("Error adding flashcard to folder:", error);
      throw new Error("Failed to add flashcard to folder");
    }
  }, []);

  const getFlashcardInFolder = useCallback(async (folderSlug: string | undefined, word: string): Promise<FolderTypes> => {
    try {
      const response = await api.get(`/folders/${folderSlug}/flashcards/${word}`);
      return response.data;
    } catch (error) {
      console.error("Error getting flashcard in folder:", error);
      throw new Error("Failed to get flashcard in folder");
    }
  }, []);

  const deleteFlashcardInFolder = useCallback(async (folderSlug: string | undefined, word: string | undefined): Promise<void> => {
    try {
      await api.delete(`/folders/${folderSlug}/flashcards/${word}`);
    } catch (error) {
      console.error("Error deleting flashcard in folder:", error);
      throw new Error("Failed to delete flashcard in folder");
    }
  }, []);

  const checkFlashcardInFavourites = useCallback(async (word: string | undefined): Promise<boolean> => {
    try {
      const response = await api.get(`folders/flashcards/${word}/favourite`);
      return response.data.found;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false; // Flashcard not found in favourites
      }
      console.error("Error checking flashcard in favourites:", error);
      throw new Error("Failed to check flashcard in favourites");
    }
  }, []);

  const getFavouritesSlug = useCallback(async (): Promise<string | undefined> => {
    try {
      const response = await getAllFolders({ getAll: true });
      const favouritesSlug = response.folders.find((folder) => folder.name === "Favourites")?.slug;
      return favouritesSlug;
    } catch (error) {
      console.error("Error getting favourites folder slug:", error);
      throw new Error("Failed to get favourites folder slug");
    }
  }, [getAllFolders]);

  return {
    createFolder,
    deleteFolder,
    getAllFolders,
    getFolderBySlug,
    getFolderFlashcardList,
    addFlashcardToFolder,
    getFlashcardInFolder,
    deleteFlashcardInFolder,
    checkFlashcardInFavourites,
    getFavouritesSlug,
  };
}