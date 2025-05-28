import { type ActionType, type FileProps } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { actionsDropdownItems } from "@/constants";
import { Link } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getDownloadUrl } from "@/lib/utils";
import { deleteFile, renameFile, shareFile, unShareFile } from "@/services/file.service";
import { FileDetails, ShareInput } from "./ActionsModalContent";
import useUserAccount from "@/hooks/useUserAccount";

const ActionDropdown = ({ file }: { file: FileProps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [action, setAction] = useState<ActionType | null>(null);
  const [name, setName] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { account, files, setFiles } = useUserAccount();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropdownOpen(false);
    setAction(null);
    setName(file.name);
  };

  const handleAction = async () => {
    if (!action) return;
    setIsLoading(true);

    const actions = {
      rename: () => renameFile(file.owner.id, file._id, name),

      share: () => shareFile(file._id, file.owner.id, emails),

      delete: () => deleteFile(file._id, file.owner),
    };

    const data = await actions[action.value as keyof typeof actions]();

    if (data.success) {
      if (action.value === "rename") {
        setFiles((prevFiles) =>
          prevFiles.map((f) => {
            return f._id === file._id ? { ...f, name: name } : f;
          })
        );
        // close all modals
        closeAllModals();
      } else if (action.value === "delete") {
        setFiles((prevFiles) => prevFiles.filter((f) => f._id !== file._id));
        // close all modals
        closeAllModals();
      } else if (action.value === "share") {
        setFiles((prevFiles) =>
          prevFiles.map((f) => {
            return f._id === file._id ? data.results : f;
          })
        );
      }
    }

    setIsLoading(false);
  };

  const handleRemoveUser = async (email: string) => {
    const updatedEmails = file.sharedWith.filter((e) => e !== email);

    const data = await unShareFile(file._id, file.owner.id, email);
    if (data.success) {
      setFiles((prevFiles) =>
        prevFiles.map((f) => {
          return f._id === file._id ? data.results : f;
        })
      );
      setEmails(updatedEmails);
    }
  };

  const renderDailogContent = () => {
    if (!action) return null;

    const { value, label } = action;

    return (
      <DialogContent className="shad-dialog button">
        <DialogHeader className="flex flex-col gap-3">
          <DialogTitle className="text-center text-light-100">
            {label}
          </DialogTitle>
          {value === "rename" && (
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

          {value === "details" && <FileDetails file={file} />}

          {value === "share" && (
            <ShareInput
              file={file}
              onInputChange={setEmails}
              onRemove={handleRemoveUser}
            />
          )}

          {value === "delete" && (
            <p className="delete-confirmation">
              Are you sure you want to delete
              <span className="delete-file-name">
                {` ${file.name}.${file.extension} `}
              </span>
              ?
            </p>
          )}
        </DialogHeader>

        {["rename", "delete", "share"].includes(value) && (
          <DialogFooter className="flex flex-col gap-3 md:flex-row">
            <Button onClick={closeAllModals} className="modal-cancel-button">
              Cancel
            </Button>
            <Button onClick={handleAction} className="modal-submit-button">
              <p className="capitalize">{value}</p>
              {isLoading && (
                <img
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={20}
                  height={20}
                  className="animate-spin"
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="shad-no-focus">
          <img src="/assets/icons/dots.svg" alt="dots" width={24} height={24} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="max-w-[200px] truncate">
            {file.name + (file.type !== "other" ? `.${file.extension}` : "")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actionsDropdownItems.map((actionItem) => (
            <DropdownMenuItem
              key={actionItem.value}
              className="shad-dropdown-item"
              onClick={() => {
                setAction(actionItem);

                if (
                  ["delete", "details"].includes(actionItem.value) ||
                  (["rename", "share"].includes(actionItem.value) &&
                    file.owner.id === account?.id)
                ) {
                  setIsModalOpen(true);
                }
              }}
            >
              {actionItem.value === "download" ? (
                <Link
                  to={getDownloadUrl(file.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <img
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                </Link>
              ) : (
                <button
                  disabled={
                    ["rename", "share"].includes(actionItem.value) &&
                    file.owner.id !== account?.id
                  }
                  className="cursor-pointer flex items-center gap-2 disabled:text-light-200"
                >
                  <img
                    src={actionItem.icon}
                    alt={actionItem.label}
                    width={30}
                    height={30}
                  />
                  {actionItem.label}
                  <span className="text-xs">
                    {["rename", "share"].includes(actionItem.value) &&
                      file.owner.id !== account?.id &&
                      "(Admin)"}
                  </span>
                </button>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {renderDailogContent()}
    </Dialog>
  );
};

export default ActionDropdown;
