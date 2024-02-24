import React from "react";
import { useState, useEffect } from "react";
import Paginate from "./paginate";
import "./master.css";
import datas from "./MOCK_DATA2.json";
import Axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import LatexComponent from "./latex";
import Papa from "papaparse";
import Details from "./details";

const Main = () => {
  const [exportData, setExportData] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [data, setData] = useState(datas);
  const [search, setSearch] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const [dets, setDetails] = useState([]);

  const [pnum, setPNum] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    const config = {
      headers: { "content-type": "application/json" },
    };
    Axios.get("https://frb-hosts.org/get-github-catlogs", {}, config)
      .then((response) => {
        console.log(response.data);
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        toast.error("Something went Wrong. Please retry!");
      });
  }, []);

  const handleCheckboxChange = (index, rowData) => {
    // Create a copy of the exportData array
    const newExportData = [...exportData];

    // If the checkbox is checked, append the row data; otherwise, remove the data
    if (newExportData[index]) {
      // Remove the data
      newExportData.splice(index, 1);
    } else {
      // Append the row data
      newExportData[index] = rowData;
    }

    // Update the state
    console.log(newExportData.filter((index) => index !== null && index !== undefined).length);
    if (selectAll && newExportData.filter((index) => index !== null && index !== undefined).length !== data.slice(pnum * 10 - 10, pnum * 10).length) {
      setSelectAll(false);
    } else if (!selectAll && newExportData.filter((index) => index !== null && index !== undefined).length == data.slice(pnum * 10 - 10, pnum * 10).length) {
      setSelectAll(true);
    }
    setExportData(newExportData);
  };

  const handleDownload = () => {
    // Filter out null values and create an array of selected rows
    const selectedRows = exportData.filter((index) => index !== null && index !== undefined);

    // Create a Blob containing the JSON data
    const jsonData = new Blob([JSON.stringify(selectedRows, null, 2)], {
      type: "application/json",
    });

    // Create a download link and trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(jsonData);
    downloadLink.download = "exported_data.json";
    downloadLink.click();
  };

  const handleDownloadCSV = () => {
    // Filter out null values and create an array of selected rows
    const selectedRows = exportData.filter((index) => index !== null && index !== undefined);

    // Create a CSV string using papaparse
    const csvContent = Papa.unparse({
      fields: Object.keys(selectedRows[0]), // Specify headers (you can use LaTeX here)
      data: selectedRows,
    });

    // Create a Blob containing the CSV data
    const csvData = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a download link and trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(csvData);
    downloadLink.download = "exported_data.csv";
    downloadLink.click();
  };

  //   Sorting Start======>
  const handleSort = (column) => {
    // Toggle the sort direction if clicking on the same column
    const direction = sortBy === column && sortDirection === "asc" ? "desc" : "asc";
    setSortBy(column);
    setSortDirection(direction);

    // Sort the data based on the selected column and direction
    const sortedData = [...data].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });

    // console.log(sortedData);

    setData(sortedData);
  };
  //   =========Sorting End====>

  const [scrollY, setScrollY] = useState(0);

  const handleScroll = () => {
    setScrollY(window.scrollY / 8);
  };

  useEffect(() => {
    // Add the event listener when the component mounts
    window.addEventListener("scroll", handleScroll);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array ensures that the effect runs only once (on mount)

  const handleSelectAllChange = () => {
    setSelectAll((prevSelectAll) => !prevSelectAll);
  };

  useEffect(() => {
    setExportData((prevExportData) => {
      if (!selectAll) {
        // Deselect All: Clear exportData
        return [];
      }

      // Select All: Copy all visible rows to exportData
      const newExportData = data
        .slice(pnum * 10 - 10, pnum * 10)
        .filter(
          (e) =>
            e.FRB.includes(search) ||
            String(e["Host R.A."])?.includes(String(search)) ||
            String(e["Host Decl."])?.includes(String(search)) ||
            String(e["Offset ($\u0007rcsec$)"])?.includes(String(search)) ||
            String(e["$M_*$ ($\rm M_{\\odot}$)"])?.includes(String(search)) ||
            String(e["SFR ($\rm M_{\\odot}$\\yr)"])?.includes(String(search)) ||
            String(e["$Z_{\rm gas}$ ($Z_{\\odot}$)"])?.includes(String(search)) ||
            String(e["$t_{m}$ (Gyr)"])?.includes(String(search))
        )
        .map((ini) => ({
          FRB: ini.FRB,
          "Host R.A.": ini["Host R.A."],
          "Host Decl.": ini["Host Decl."],
          "Offset ($\u0007rcsec$)": ini["Offset ($\u0007rcsec$)"],
          "M_*$ ($\rm M_{\\odot}$)": ini["$M_*$ ($\rm M_{\\odot}$)"],
          "SFR ($\rm M_{\\odot}$\\yr)": ini["SFR ($\rm M_{\\odot}$\\yr)"],
          "$Z_{\rm gas}$ ($Z_{\\odot}$)": ini["$Z_{\rm gas}$ ($Z_{\\odot}$)"],
          "$t_{m}$ (Gyr)": ini["$t_{m}$ (Gyr)"],
        }));

      return newExportData;
    });
  }, [selectAll, data, pnum, search]);

  return (
    <>
      <Toaster />
      {isloading && (
        <div
          className="loader d-flex align-items-center justify-content-center position-fixed top-0 start-0"
          style={{ zIndex: "99", height: "100vh", width: "100%", background: "rgba(255, 255, 255, 0.5)", backdropFilter: "blur(10px)" }}
        >
          <h3 className="display-5 fw-bold"> Loading... </h3>
        </div>
      )}
      {/* {console.log(exportData)} */}
      {dets.length == 0 ? (
        <>
          <div className="hero" style={{ backgroundSize: scrollY + 100 + "%" }}>
            <div class="logo">
              <h3 className="fw-bold display-6 text-light">LOGO</h3>
              <div id="container-stars">
                <div id="stars"></div>
              </div>

              <div id="glow">
                <div class="circle"></div>
                <div class="circle"></div>
              </div>
            </div>
          </div>

          <div className="container bg-dark rounded p-3 my-3 ">
            <div className="text-light my-3">
              <p className="lead">
                Welcome to the Open Tidal Disruption Event (TDE) Catalog! This catalog is intended to be a “catch-all” list of possible TDEs that have been claimed over the years in the literature,
                even for events in which the favored interpretation is not a tidal disruption. The catalog is a continual work in progress, and is likely missing a few events and may have a few
                mistakes. The list of TDEs available here is scraped from various data repositories and individual publications. If you use this data, please reference the cited sources of that data,
                and we'd also appreciate if you provided a link to this catalog. Thanks!
              </p>
              <p className="lead">
                The table below is generated from JSON files produced by AstroCats, which agglomerates the data for each TDE as a series of JSON files that all adhere to the same schema. The entirety
                of the data available for any TDE can be downloaded by clicking the icon in the Data column. Advanced data retrieval options are available via the OACAPI. If you would like to
                contribute data yourself, please visit our contribute page. If you spot any mistakes, please create a new issue on our GitHub issue tracking page, or contact us via e-mail.
              </p>
            </div>

            {/* Table start */}
            <div className="downloads w-100">
              <button className="btn btn-info mt-3 mb-1" onClick={handleDownload} disabled={exportData.length == 0}>
                Download JSON
              </button>
              <button className="btn btn-primary mt-3 mb-1 ms-2" onClick={handleDownloadCSV} disabled={exportData.length == 0}>
                Download CSV
              </button>
            </div>

            <div className="w-100 d-flex justify-content-between">
              <button className={`btn ${selectAll ? "btn-warning" : "border-warning text-warning"} mt-3 mb-1`} onClick={() => setSelectAll(!selectAll)}>
                Select All
              </button>

              <input type="text" className=" p-2 px-3 rounded w-50" placeholder="Search..." onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: "200px" }} />
            </div>

            {/* Pagination */}
            {data.length !== 0 && (
              <div className="col-12 text-center">
                <Paginate pagecount={(e) => setPNum(e)} total={data.length} cactive={pnum} />
              </div>
            )}
            {/* Pagination ENd */}

            <div class="table-responsive slim-scroll">
              <table className="table table-striped table-dark table-bordered table-hover rounded shadow mt-5">
                <thead>
                  <tr>
                    <th scope="col">Select</th>
                    <th scope="col" onClick={() => handleSort("FRB")}>
                      FRB {sortBy === "FRB" && <small>({sortDirection})</small>}
                    </th>
                    <th scope="col" onClick={() => handleSort("Host R.A.")}>
                      Host R.A. {sortBy === "Host R.A." && <small>({sortDirection})</small>}
                    </th>
                    <th scope="col" onClick={() => handleSort("Host Decl.")}>
                      Host Decl. {sortBy === "Host Decl." && <small>({sortDirection})</small>}
                    </th>

                    <th scope="col" onClick={() => handleSort("Offset ($\u0007rcsec$)")}>
                      <LatexComponent text="Offset ( `` )" /> {sortBy === "Offset ($\u0007rcsec$)" && <small>({sortDirection})</small>}
                    </th>
                    <th scope="col" onClick={() => handleSort("$M_*$ ($\rm M_{\\odot}$)")}>
                      <LatexComponent text="$M_*$ ($\rm M_{\odot}$)" /> {sortBy === "$M_*$ ($\rm M_{\\odot}$)" && <small>({sortDirection})</small>}
                    </th>
                    <th scope="col" onClick={() => handleSort("SFR ($\rm M_{\\odot}$\\yr)")}>
                      <LatexComponent text="SFR ($\rm M_{\odot}$/yr)" /> {sortBy === "SFR ($\rm M_{\\odot}$\\yr)" && <small>({sortDirection})</small>}
                    </th>

                    <th scope="col" onClick={() => handleSort("$Z_{\rm gas}$ ($Z_{\\odot}$)")}>
                      <LatexComponent text="$Z_{\rm gas}$ ($Z_{\odot}$)" /> {sortBy === "$Z_{\rm gas}$ ($Z_{\\odot}$)" && <small>({sortDirection})</small>}
                    </th>
                    <th scope="col" onClick={() => handleSort("$t_{m}$ (Gyr)")}>
                      <LatexComponent text="$t_{m}$ (Gyr)" /> {sortBy === " $t_{m}$ (Gyr)" && <small>({sortDirection})</small>}
                    </th>
                    <th scope="col" onClick={() => handleSort("$m_r$.")}>
                      <LatexComponent text="$m_r$." /> {sortBy === "$m_r$." && <small>({sortDirection})</small>}
                    </th>
                    <th scope="col" onClick={() => handleSort("Redshift")}>
                      Redshift {sortBy === "Redshift" && <small>({sortDirection})</small>}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .slice(pnum * 10 - 10, pnum * 10)
                    .filter(
                      (e) =>
                        e.FRB.includes(search) ||
                        String(e["Host R.A."])?.includes(String(search)) ||
                        String(e["Host Decl."])?.includes(String(search)) ||
                        String(e["Offset ($\u0007rcsec$)"])?.includes(String(search)) ||
                        String(e["$M_*$ ($\rm M_{\\odot}$)"])?.includes(String(search)) ||
                        String(e["SFR ($\rm M_{\\odot}$\\yr)"])?.includes(String(search)) ||
                        String(e["$Z_{\rm gas}$ ($Z_{\\odot}$)"])?.includes(String(search)) ||
                        String(e["$t_{m}$ (Gyr)"])?.includes(String(search)) ||
                        String(e["$m_r$."])?.includes(String(search)) ||
                        String(e.Redshift.includes(String(search)))
                    )
                    .map((ini, i) => {
                      const rowData = {
                        FRB: ini.FRB,
                        "Host R.A.": ini["Host R.A."],
                        "Host Decl.": ini["Host Decl."],
                        "Offset ($\u0007rcsec$)": ini["Offset ($\u0007rcsec$)"],
                        "$M_*$ ($\rm M_{\\odot}$)": ini["$M_*$ ($\rm M_{\\odot}$)"],
                        "SFR ($\rm M_{\\odot}$\\yr)": ini["SFR ($\rm M_{\\odot}$\\yr)"],
                        "$Z_{\rm gas}$ ($Z_{\\odot}$)": ini["$Z_{\rm gas}$ ($Z_{\\odot}$)"],
                        "$t_{m}$ (Gyr)": ini["$t_{m}$ (Gyr)"],
                        "$m_r$.": ini["$m_r$."],
                        redshift: ini.Redshift,
                        image: ini.image_path,
                      };

                      return (
                        <tr key={i}>
                          <th scope="row">
                            <input
                              type="checkbox"
                              checked={exportData.some((data) => data && data.FRB === ini.FRB && data["Host R.A."] === ini["Host R.A."] && data["Host Decl."] === ini["Host Decl."])}
                              onChange={() => handleCheckboxChange(i, rowData)}
                            />
                          </th>
                          <td className="text-info" style={{ cursor: "pointer" }} onClick={() => setDetails(rowData)}>
                            {rowData.FRB}
                          </td>
                          <td>{rowData["Host R.A."]}</td>
                          <td>{rowData["Host Decl."]}</td>

                          <td>{rowData["Offset ($\u0007rcsec$)"]}</td>
                          <td>{rowData["$M_*$ ($\rm M_{\\odot}$)"]}</td>
                          <td>{rowData["SFR ($\rm M_{\\odot}$\\yr)"]}</td>
                          <td>{rowData["$Z_{\rm gas}$ ($Z_{\\odot}$)"]}</td>
                          <td>{rowData["$t_{m}$ (Gyr)"]}</td>
                          <td>{rowData["$m_r$."]}</td>
                          <td>{rowData.redshift}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <Details data={dets} off={(e) => setDetails(e)} />
      )}
    </>
  );
};

export default Main;
