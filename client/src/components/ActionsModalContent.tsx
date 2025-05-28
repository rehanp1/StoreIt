import type { FileProps } from "@/types";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ImageThumbnail = ({ file }: { file: FileProps }) => {
  return (
    <div className="file-details-thumbnail">
      <Thumbnail type={file.type} extension={file.extension} url={file.url} />
      <div className="flex flex-col">
        <p className="subtitle-2 mb-1">{file.name + "." + file.extension}</p>
        <FormattedDateTime date={file.createdAt} className="caption" />
      </div>
    </div>
  );
};

const Detailow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex">
    <p className="file-details-label">{label}</p>
    <p className="file-details-value">{value}</p>
  </div>
);

export const FileDetails = ({ file }: { file: FileProps }) => {
  return (
    <>
      <ImageThumbnail file={file} />
      <div className="space-y-4 px-2">
        <Detailow label="Format:" value={file.extension} />
        <Detailow label="Size:" value={convertFileSize(file.size)} />
        <Detailow label="Owner:" value={file.owner.fullName} />
        <Detailow label="Last edit:" value={formatDateTime(file.updatedAt)} />
      </div>
    </>
  );
};

interface Props {
  file: FileProps;
  onInputChange: React.Dispatch<React.SetStateAction<string[]>>;
  onRemove: (email: string) => void;
}

export const ShareInput = ({ file, onInputChange, onRemove }: Props) => {
  return (
    <>
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>

        <Input
          type="email"
          placeholder="e.g. xyz@co.in , abc@co.in"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />

        <div className="pt-4">
          <div className="flex justify-between">
            <p className="subtitle-2 text-light-100">Share with</p>
            <p className="subtitle-2 text-light-100">
              {file.sharedWith.length} users
            </p>
          </div>

          <ul className="pt-2 overflow-auto max-h-40">
            {file.sharedWith.map((email: string) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                <p className="subtitle-2">{email}</p>
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <img
                    src="/assets/icons/remove.svg"
                    alt="remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
