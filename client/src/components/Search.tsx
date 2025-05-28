import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import type { FileProps } from "@/types";
import Thumbnail from "./Thumbnail";
import FormattedDateTime from "./FormattedDateTime";
import { useNavigate } from "react-router-dom";
import { searchFile } from "@/services/file.service";
import useDebounce from "@/hooks/useDebounce";

const Search = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<FileProps[]>([]);
  const navigate = useNavigate();
  const debounceQuery = useDebounce(query);

  const handleCickItem = (file: FileProps) => {
    setOpen(false);
    setResults([]);

    // navigate to the page where file exists
    navigate(
      `${
        ["video", "audio"].includes(file.type)
          ? "/media"
          : "/" + file.type + "s"
      }`
    );

    setQuery("");
  };

  useEffect(() => {
    if (!query || query === "") {
      setOpen(false);
      return;
    }
    (async function () {
      const data = await searchFile(debounceQuery);
      if (data.success) {
        setOpen(true);
        setResults(data.results);
      }
    })();
  }, [debounceQuery]);

  return (
    <div className="search">
      <div className="search-input-wrapper">
        <img
          src="/assets/icons/search.svg"
          alt="search"
          width={20}
          height={20}
        />

        <Input
          value={query}
          placeholder="Search ..."
          className="search-input"
          onChange={(e) => setQuery(e.target.value)}
        />

        {open && (
          <ul className="search-result">
            {results.length > 0 ? (
              results.map((file) => (
                <SearchListItem
                  key={file._id}
                  file={file}
                  handleCickItem={handleCickItem}
                />
              ))
            ) : (
              <p className="empty-result">No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;

const SearchListItem = ({
  file,
  handleCickItem,
}: {
  file: FileProps;
  handleCickItem: (file: FileProps) => void;
}) => {
  return (
    <li
      key={file._id}
      className="flex items-center justify-between cursor-pointer hover:bg-gray-50 px-4 "
      onClick={() => handleCickItem(file)}
    >
      <div className="flex cursor-pointer items-center gap-4">
        <Thumbnail
          type={file.type}
          extension={file.extension}
          url={file.url}
          className="size-9 min-w-9"
        />
        <p className="subtitle-2 line-clamp-1 text-light-100">
          {file.name + (file.type !== "other" ? `.${file.extension}` : "")}
        </p>
      </div>

      <FormattedDateTime
        date={file.createdAt}
        className="caption line-clamp-1 text-light-100"
      />
    </li>
  );
};
