/* eslint-disable no-unused-vars */

export type FileType = "document" | "image" | "video" | "audio" | "other";

export interface FileProps {
  _id: string;
  type: string;
  name: string;
  url: string;
  extension: string;
  size: number;
  owner: {
    id: string;
    fullName: string;
    email: string;
  };
  sharedWith: string[] | [];
  cloudinary_asset_id: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ActionType {
  label: string;
  icon: string;
  value: string;
}

declare interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}
declare interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}
declare interface RenameFileProps {
  fileId: string;
  name: string;
  extension: string;
  path: string;
}
declare interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
declare interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

// declare interface ShareInputProps {
//   file: Models.Document;
//   onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onRemove: (email: string) => void;
// }
