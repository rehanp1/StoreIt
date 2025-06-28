import ActionDropdown from "@/components/ActionDropdown";
import Chart from "@/components/Chart";
import FormattedDateTime from "@/components/FormattedDateTime";
import Thumbnail from "@/components/Thumbnail";
import { Separator } from "@/components/ui/separator";
import useUserAccount from "@/hooks/useUserAccount";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { getTotalSpaceUsed } from "@/services/file.service";
import type { FileProps } from "@/types";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";


const Dashboard = () => {
  const { pathname } = useLocation();
  const { filesSummary, setFilesSummary } = useUserAccount();
  // Get usage summary
  const [usageSummary, setUsageSummary] = useState<any>();

  useEffect(() => {
    if (pathname !== "/") return;
    (async function () {
      const data = await getTotalSpaceUsed();
      setFilesSummary(data.results);
      setUsageSummary(getUsageSummary(data.results.totalSpace));
    })();
  }, [pathname]);

  return (
    <div className="dashboard-container">
      <section>
        <Chart
          used={filesSummary?.totalSpace?.used}
          all={filesSummary?.totalSpace?.all}
        />

        {/* Uploaded file type summaries */}
        <ul className="dashboard-summary-list">
          {usageSummary?.map((summary: any) => (
            <Link
              to={summary.url}
              key={summary.title}
              className="dashboard-summary-card"
            >
              <div className="space-y-4">
                <div className="flex justify-between gap-3">
                  <img
                    src={summary.icon}
                    width={100}
                    height={100}
                    alt="uploaded image"
                    className="summary-type-icon"
                  />
                  <h4 className="summary-type-size">
                    {convertFileSize(summary.size) || 0}
                  </h4>
                </div>
                <h5 className="summary-type-title">{summary.title}</h5>
                <Separator className="bg-gray-200" />
                <div className="flex text-sm flex-col text-center space-y-1">
                  <p className="text-light-200">Last modified:</p>
                  <FormattedDateTime
                    date={summary.latestDate}
                    className="text-center !text-sm"
                  />
                </div>
              </div>
            </Link>
          ))}
        </ul>
      </section>

      {/* Recent files uploaded */}
      <section className="dashboard-recent-files">
        <h2 className="h3 xl:h3 text-light-100">Recent files uploaded</h2>
        {filesSummary?.recentUploadFiles?.length > 0 ? (
          <ul className="mt-5 flex flex-col gap-5">
            {filesSummary.recentUploadFiles.map((file: FileProps) => (
              <Link
                to={file.url}
                target="_blank"
                className="flex items-center gap-3"
                key={file._id}
              >
                <Thumbnail
                  type={file.type}
                  extension={file.extension}
                  url={file.url}
                />

                <div className="recent-file-details">
                  <div className="flex flex-col gap-1">
                    <p className="recent-file-name">{file.name}</p>
                    <FormattedDateTime
                      date={file.createdAt}
                      className="caption"
                    />
                  </div>
                  <ActionDropdown file={file} />
                </div>
              </Link>
            ))}
          </ul>
        ) : (
          <p className="empty-list">No files uploaded</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
