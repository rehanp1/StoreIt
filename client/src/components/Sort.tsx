import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sortTypes } from "@/constants";
import type { FileProps } from "@/types";

interface Props {
  files: FileProps[];
  setFiles: React.Dispatch<React.SetStateAction<FileProps[]>>;
}

const Sort = ({ files, setFiles }: Props) => {
  const handleSort = (value: string) => {
    if (!files || files.length <= 1) return;

    const [field, ascOrDesc] = value.split("-");

    files.sort((a: FileProps, b: FileProps) => {
      if (field === "createdAt") {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return ascOrDesc === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (field === "name") {
        return ascOrDesc === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (field === "size") {
        return ascOrDesc === "asc" ? a.size - b.size : b.size - a.size;
      }

      return 0;
    });

    setFiles([...files]);
  };

  return (
    <Select onValueChange={handleSort}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={"Select Sort By"} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort) => (
          <SelectItem
            key={sort.label}
            value={sort.value}
            className="shad-select-item"
          >
            {sort.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default Sort;
