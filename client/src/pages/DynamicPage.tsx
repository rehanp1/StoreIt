import Card from "@/components/Card";
import Sort from "@/components/Sort";
import useUserAccount from "@/hooks/useUserAccount";
import {
  convertFileSize,
  fileTypeParams,
  getTotalFilesSize,
} from "@/lib/utils";
import { getFiles } from "@/services/file.service";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const DynamicPage = () => {
  const { type } = useParams();
  const fileType = fileTypeParams(type);
  const { files, setFiles } = useUserAccount();

  useEffect(() => {
    (async function () {
      if (!fileType) {
        setFiles([]);
        return;
      }
      const result = await getFiles(fileType);
      setFiles(result);
    })();
  }, [type]);

  return (
    <div className="page-container">
      <section className="w-full">
        <h1 className="h2 capitalize md:-mt-5">{type}</h1>
        <div className="total-size-section">
          <p className="body-2">
            Total:{" "}
            <span className="body-2 !font-semibold">
              {convertFileSize(getTotalFilesSize(files))}
            </span>
          </p>

          <div className="sort-container">
            <p className="body-2 hidden sm:block text-light-200">Sort by:</p>
            <Sort files={files} setFiles={setFiles} />
          </div>
        </div>
      </section>

      {/* Render the files */}
      {files.length > 0 ? (
        <section className="file-list">
          {files.map((file) => (
            <Card key={file._id} file={file} />
          ))}
        </section>
      ) : (
        <p className="empty-list">No files uploaded </p>
      )}
    </div>
  );
};

export default DynamicPage;
