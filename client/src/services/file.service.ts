const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface ownerType {
  id: string;
  fullName: string;
  email: string;
}

export const getFiles = async (fileType: string[] | undefined) => {
  try {
    const response = await fetch(
      backendUrl + `/api/file/get-files?fileType=${fileType}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.success) {
      return data.results;
    }
    return [];
  } catch (err) {
    console.log("GET FILES ERROR", err);
    return [];
  }
};

export const uploadFile = async (files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // key must match multer's `.array("files")`
    });

    const response = await fetch(backendUrl + `/api/file/upload`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("FAILED TO UPLOAD FILES", err);
    return null;
  }
};

export const renameFile = async (
  ownerId: string,
  fileId: string,
  newFileName: string
) => {
  try {
    const response = await fetch(backendUrl + `/api/file/rename`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ ownerId, fileId, newFileName }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("FAILED TO RENAME THE FILE", err);
    return null;
  }
};

export const deleteFile = async (fileId: string, owner: ownerType) => {
  try {
    const response = await fetch(backendUrl + `/api/file/delete`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ fileId, owner }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("FAILED TO DELETE FILE", err);
    return null;
  }
};

export const shareFile = async (
  fileId: string,
  ownerId: string,
  shareEmails: string[] | null
) => {
  try {
    const response = await fetch(backendUrl + `/api/file/share`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ fileId, ownerId, shareEmails }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("FAILED TO SHARE FILE", err);
    return null;
  }
};

export const unShareFile = async (
  fileId: string,
  ownerId: string,
  email: string
) => {
  try {
    const response = await fetch(backendUrl + `/api/file/unshare`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ fileId, ownerId, removeEmail: email }),
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("FAILED TO UNSHARE FILE", err);
    return null;
  }
};

export const searchFile = async (searchQuery: string) => {
  try {
    const response = await fetch(
      backendUrl + `/api/file/search-file?query=${searchQuery}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("FAILED TO SEARCH FILE", err);
    return [];
  }
};

export const getTotalSpaceUsed = async () => {
  try {
    const response = await fetch(backendUrl + `/api/file/get-totalspaceused`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("FAILED TO GET TOTAL SPACE USED", err);
    return null;
  }
};
