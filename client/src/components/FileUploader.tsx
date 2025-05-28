import { useCallback, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "./ui/button";
import {
  cn,
  convertFileToUrl,
  getFileType,
  getTotalFilesSize,
} from "@/lib/utils";
import Thumbnail from "./Thumbnail";
import { MAX_FILE_SIZE } from "@/constants";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/services/file.service";
import { useLocation } from "react-router-dom";
import useUserAccount from "@/hooks/useUserAccount";

interface Props {
  id: string;
  fullName: string;
  email: string;
  className?: string;
  filesSummary: any;
}

const FileUploader = ({
  id,
  fullName,
  email,
  className,
  filesSummary,
}: Props) => {
  const [files, setFiles] = useState<File[]>([]);
  const { pathname } = useLocation();

  const handleSubmit = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;

      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles); // Optional: if you want to store them locally

      const availableSpace =
        filesSummary?.results?.totalSpace?.all -
        filesSummary?.results?.totalSpace?.used;
      const s = getTotalFilesSize(selectedFiles);
      console.log(availableSpace, s, filesSummary?.results?.totalSpace);

      if (availableSpace > getTotalFilesSize(selectedFiles)) {
        toast({
          description: (
            <p className="body-2 text-white">
              Space is not sufficient for the files.
            </p>
          ),
          className: "error-toast",
        });
        return;
      }

      const uploadPromises = selectedFiles.map(async (file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast({
            description: (
              <p className="body-2 text-white">
                <span className="font-semibold">{file.name}</span> is too large.
                Max file size is 50MB.
              </p>
            ),
            className: "error-toast",
          });
          return;
        }

        return uploadFile([file]).then((uploadedFile) => {
          if (uploadedFile) {
            setFiles((prevFiles) =>
              prevFiles.filter((f) => f.name !== file.name)
            );
          }
        });
      });

      await Promise.all(uploadPromises);
    },
    [id, pathname]
  );

  const handleRemoveFile = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    fileName: string
  ) => {
    e.stopPropagation();
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <div className="cursor-pointer relative ">
      <Button type="button" className={cn("uploader-button", className)}>
        <input
          type="file"
          name="files"
          id="fileUpload"
          multiple
          onChange={handleSubmit}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <img
          src="/assets/icons/upload.svg"
          alt="upload"
          width={20}
          height={20}
        />

        <p>Upload</p>
      </Button>

      {files.length > 0 && (
        <ul className="uploader-preview-list">
          <h5 className="h5 text-gray-700">Uploading</h5>

          {files.map((file, index) => {
            const { type, extension } = getFileType(file.name);
            return (
              <li
                key={`${file.name}-${index}`}
                className="uploader-preview-item"
              >
                <div className="flex item-center gap-3">
                  <Thumbnail
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)}
                  />

                  <div className="preview-item-name">
                    {file.name}
                    <img
                      src="/assets/icons/file-loader.gif"
                      alt="Loader"
                      width={80}
                      height={26}
                    />
                  </div>
                </div>

                <img
                  src="/assets/icons/remove.svg"
                  alt="Remove"
                  width={24}
                  height={24}
                  onClick={(e) => handleRemoveFile(e, file.name)}
                />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default FileUploader;
